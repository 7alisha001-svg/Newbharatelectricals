import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  "https://ftxyuhwejcqxoyhmkczl.supabase.co";

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse";

const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// ======================================================
// EMAIL / SMTP CONFIGURATION
// ======================================================

let emailTransporter: nodemailer.Transporter | null = null;

async function getEmailTransporter() {
  if (emailTransporter) {
    return emailTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // DO NOT use Ethereal in production.
  // Real website enquiries must go through your domain email SMTP.
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS."
    );
  }

  console.log(
    `[SMTP] Initializing SMTP transporter: ${host}:${port} using ${user}`
  );

  emailTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  await emailTransporter.verify();

  console.log("[SMTP] SMTP connection verified successfully.");

  return emailTransporter;
}

// ======================================================
// HTML ESCAPE HELPER
// ======================================================

function escapeHtml(value: any): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ======================================================
// SERVER
// ======================================================

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // ====================================================
  // HEALTH CHECK
  // ====================================================

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      emailConfigured: Boolean(
        process.env.SMTP_HOST &&
          process.env.SMTP_USER &&
          process.env.SMTP_PASS
      ),
    });
  });

  // ====================================================
  // DUPLICATE SUBMISSION PROTECTION
  // ====================================================

  const submissionCache = new Map<string, number>();

  function isDuplicateSubmission(
    phone: string,
    email: string,
    message: string
  ): boolean {
    const now = Date.now();

    const key = `${phone.trim()}_${(email || "").trim()}_${(
      message || ""
    ).slice(0, 100)}`;

    const lastSubmissionTime = submissionCache.get(key);

    if (
      lastSubmissionTime &&
      now - lastSubmissionTime < 15000
    ) {
      return true;
    }

    submissionCache.set(key, now);

    if (submissionCache.size > 1000) {
      for (const [key, timestamp] of submissionCache.entries()) {
        if (now - timestamp > 60000) {
          submissionCache.delete(key);
        }
      }
    }

    return false;
  }

  // ====================================================
  // FORM VALIDATION
  // ====================================================

  function validateFormFields(
    fullName: string,
    phoneNumber: string,
    emailAddress: string
  ): string | null {
    if (!fullName || !fullName.trim()) {
      return "Full name is required.";
    }

    const cleanPhone = phoneNumber
      ? phoneNumber.trim()
      : "";

    if (!cleanPhone) {
      return "Phone number is required.";
    }

    // Remove spaces, brackets and hyphens first
    const normalizedPhone = cleanPhone.replace(
      /[\s\-()]/g,
      ""
    );

    // Correct phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return "Please enter a valid phone number.";
    }

    const cleanEmail = emailAddress
      ? emailAddress.trim()
      : "";

    if (
      cleanEmail &&
      cleanEmail !== "N/A"
    ) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return "Please enter a valid email address.";
      }
    }

    return null;
  }

  // ====================================================
  // SEND FORM / ENQUIRY EMAILS
  // ====================================================

  async function sendFormEmails(submission: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    companyName?: string;
    subject: string;
    message: string;
    pageUrl: string;
    dateTime?: string;
    productName?: string;
    productSku?: string;
    productId?: string;
  }) {
    const transporter = await getEmailTransporter();

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      "Info@newbharatelectricals.com";

    const senderEmail =
      process.env.SMTP_USER ||
      "Info@newbharatelectricals.com";

    const dateTimeStr =
      submission.dateTime ||
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

    const fullName = escapeHtml(submission.fullName);
    const emailAddress = escapeHtml(
      submission.emailAddress
    );
    const phoneNumber = escapeHtml(
      submission.phoneNumber
    );
    const companyName = escapeHtml(
      submission.companyName || "Not Provided"
    );
    const subject = escapeHtml(
      submission.subject
    );
    const message = escapeHtml(
      submission.message || "No message provided."
    );
    const pageUrl = escapeHtml(
      submission.pageUrl
    );
    const productName = escapeHtml(
      submission.productName || "N/A"
    );
    const productSku = escapeHtml(
      submission.productSku || "N/A"
    );
    const productId = escapeHtml(
      submission.productId || "N/A"
    );

    const fromHeader =
      `"New Bharat Electricals" <${senderEmail}>`;

    // ==================================================
    // ADMIN EMAIL
    // ==================================================

    const adminMailOptions = {
      from: fromHeader,
      to: adminEmail,

      replyTo:
        submission.emailAddress &&
        submission.emailAddress !== "N/A"
          ? submission.emailAddress
          : undefined,

      subject:
        `📩 [New Website Enquiry] ${submission.subject}: ${submission.fullName}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          color: #1f2937;
        ">

          <div style="
            background:#047857;
            padding:28px;
            text-align:center;
            color:white;
          ">
            <h2 style="
              margin:0;
              font-size:24px;
            ">
              New Enquiry Received
            </h2>

            <p style="
              margin:6px 0 0;
              font-size:14px;
            ">
              Form submitted from ${pageUrl}
            </p>
          </div>

          <div style="
            padding:32px;
            background:#ffffff;
          ">

            <h3 style="
              margin-top:0;
              border-bottom:2px solid #f3f4f6;
              padding-bottom:10px;
            ">
              Submission Details
            </h3>

            <table style="
              width:100%;
              border-collapse:collapse;
            ">

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Full Name
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  ${fullName}
                </td>
              </tr>

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Email Address
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  ${
                    submission.emailAddress &&
                    submission.emailAddress !== "N/A"
                      ? `
                        <a
                          href="mailto:${emailAddress}"
                          style="color:#047857;"
                        >
                          ${emailAddress}
                        </a>
                      `
                      : "Not Provided"
                  }
                </td>
              </tr>

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Phone Number
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  <a
                    href="tel:${phoneNumber}"
                    style="color:#047857;"
                  >
                    ${phoneNumber}
                  </a>
                </td>
              </tr>

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Company Name
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  ${companyName}
                </td>
              </tr>

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Subject
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  <span style="
                    background:#047857;
                    color:white;
                    padding:5px 10px;
                    border-radius:6px;
                    font-size:12px;
                    font-weight:bold;
                  ">
                    ${subject}
                  </span>
                </td>
              </tr>

              ${
                submission.productName && submission.productName !== "N/A"
                  ? `
                    <tr>
                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                        font-weight:bold;
                      ">
                        Product
                      </td>

                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                      ">
                        <strong style="color:#047857;">
                          ${productName}
                        </strong>
                      </td>
                    </tr>

                    <tr>
                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                        font-weight:bold;
                      ">
                        Product SKU
                      </td>

                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                      ">
                        ${productSku}
                      </td>
                    </tr>

                    <tr>
                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                        font-weight:bold;
                      ">
                        Product ID
                      </td>

                      <td style="
                        padding:12px 0;
                        border-bottom:1px solid #f3f4f6;
                      ">
                        ${productId}
                      </td>
                    </tr>
                  `
                  : ""
              }

              <tr>
                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                  font-weight:bold;
                ">
                  Submission Time
                </td>

                <td style="
                  padding:12px 0;
                  border-bottom:1px solid #f3f4f6;
                ">
                  ${escapeHtml(dateTimeStr)}
                </td>
              </tr>

            </table>

            <div style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:12px;
              padding:20px;
              margin-top:24px;
            ">

              <h4 style="
                margin:0 0 10px;
                color:#374151;
              ">
                Message / Requirements
              </h4>

              <p style="
                margin:0;
                color:#4b5563;
                line-height:1.6;
                white-space:pre-wrap;
              ">
                ${message}
              </p>

            </div>

            <div style="
              text-align:center;
              margin-top:28px;
            ">
              <a
                href="tel:${phoneNumber}"
                style="
                  display:inline-block;
                  background:#047857;
                  color:white;
                  padding:12px 28px;
                  border-radius:8px;
                  font-weight:bold;
                  text-decoration:none;
                "
              >
                Call Customer Now
              </a>
            </div>

          </div>

          <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            font-size:12px;
            color:#9ca3af;
          ">
            New Bharat Electricals • Lead Management System
          </div>

        </div>
      `,
    };

    const infoAdmin =
      await transporter.sendMail(adminMailOptions);

    console.log(
      `[SMTP] Admin enquiry email sent. Message ID: ${infoAdmin.messageId}`
    );

    // ==================================================
    // CUSTOMER CONFIRMATION EMAIL
    // ==================================================

    if (
      submission.emailAddress &&
      submission.emailAddress !== "N/A" &&
      submission.emailAddress.includes("@")
    ) {
      const customerMailOptions = {
        from:
          `"New Bharat Electricals" <${senderEmail}>`,

        to: submission.emailAddress,

        subject:
          "We've received your enquiry - New Bharat Electricals",

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:0 auto;
            border:1px solid #e5e7eb;
            border-radius:16px;
            overflow:hidden;
          ">

            <div style="
              background:#047857;
              padding:28px;
              text-align:center;
              color:white;
            ">

              <h2 style="margin:0;">
                Enquiry Received!
              </h2>

              <p style="
                margin:6px 0 0;
                font-size:14px;
              ">
                We have received your enquiry successfully.
              </p>

            </div>

            <div style="
              padding:32px;
              line-height:1.6;
            ">

              <p>
                Dear ${fullName},
              </p>

              <p>
                Thank you for contacting
                <strong>New Bharat Electricals</strong>.
                We have received your enquiry and our
                team will contact you shortly.
              </p>

              <div style="
                background:#f9fafb;
                border-radius:12px;
                padding:20px;
                margin:24px 0;
                border:1px solid #f3f4f6;
              ">

                <h4 style="
                  margin:0 0 10px;
                  color:#047857;
                ">
                  Your Enquiry
                </h4>

                <p>
                  <b>Subject:</b> ${subject}
                </p>

                <p>
                  <b>Mobile:</b> ${phoneNumber}
                </p>

                ${
                  submission.companyName
                    ? `
                      <p>
                        <b>Company:</b> ${companyName}
                      </p>
                    `
                    : ""
                }

                <p>
                  <b>Message:</b> ${message}
                </p>

              </div>

              <p>
                If you have any urgent questions,
                please call us at
                <a
                  href="tel:+919457002000"
                  style="
                    color:#047857;
                    font-weight:bold;
                  "
                >
                  +91 94570 02000
                </a>.
              </p>

              <p style="
                margin-top:32px;
                border-top:1px solid #f3f4f6;
                padding-top:20px;
              ">
                Best regards,<br>
                <strong>
                  New Bharat Electricals
                </strong>
              </p>

            </div>

            <div style="
              background:#f9fafb;
              padding:20px;
              text-align:center;
              font-size:11px;
              color:#9ca3af;
            ">
              This is an automated confirmation email.
            </div>

          </div>
        `,
      };

      try {
        const infoCustomer =
          await transporter.sendMail(
            customerMailOptions
          );

        console.log(
          `[SMTP] Customer confirmation sent. Message ID: ${infoCustomer.messageId}`
        );
      } catch (customerEmailError: any) {
        // Customer confirmation failure must NOT make the admin enquiry fail.
        console.error(
          "[SMTP-CUSTOMER-ERROR]",
          customerEmailError?.message || customerEmailError
        );
      }
    }
  }

  // ====================================================
  // GOOGLE SHEETS SYNC
  // ====================================================

  async function syncRowToSheets(
    type: "inquiry" | "order",
    payload: any,
    accessToken?: string
  ) {
    const {
      data: settings,
      error: settingsError,
    } = await supabaseClient
      .from("settings")
      .select("*")
      .eq("id", "global")
      .single();

    if (settingsError) {
      console.error(
        "[SHEETS] Error fetching settings:",
        settingsError
      );

      throw new Error(
        "Could not fetch Google Sheets configuration from settings."
      );
    }

    const socialLinks =
      settings?.social_links || {};

    const appScriptUrl =
      socialLinks.google_sheets_app_script_url;

    const spreadsheetId =
      socialLinks.google_sheets_spreadsheet_id;

    const inquirySheetName =
      socialLinks.google_sheets_inquiry_sheet_name ||
      "Inquiries";

    const orderSheetName =
      socialLinks.google_sheets_order_sheet_name ||
      "Orders";

    let row: any[] = [];
    let headers: string[] = [];
    let targetSheetName = "";

    if (type === "inquiry") {
      targetSheetName = inquirySheetName;

      headers = [
        "Date & Time",
        "Full Name",
        "Phone Number",
        "Email",
        "Company Name",
        "Product Category",
        "Message",
        "Source (Popup/Contact Page)",
      ];

      row = [
        payload.dateTime ||
          new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        payload.fullName || "",
        payload.phoneNumber || "",
        payload.emailAddress || "N/A",
        payload.companyName || "N/A",
        payload.subject || "General Enquiry",
        payload.message || "",
        payload.source ||
          "Popup/Contact Page",
      ];
    } else {
      targetSheetName = orderSheetName;

      headers = [
        "Order ID",
        "Date & Time",
        "Customer Name",
        "Phone",
        "Email",
        "Shipping Address",
        "Products",
        "Quantity",
        "Total Amount",
        "Payment Method",
        "Order Status",
      ];

      const cart =
        payload.cartItems || [];

      const productsSummary = cart
        .map(
          (item: any) =>
            `${item.name} x ${item.quantity || 1}`
        )
        .join(", ");

      const totalQuantity = cart.reduce(
        (acc: number, item: any) =>
          acc + (item.quantity || 1),
        0
      );

      const shippingAddress =
        `${payload.address || ""}, ` +
        `${payload.city || ""}, ` +
        `${payload.state || ""} - ` +
        `${payload.pincode || ""}`;

      row = [
        payload.orderId || "",

        payload.dateTime ||
          new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),

        `${payload.firstName || ""} ${
          payload.lastName || ""
        }`.trim(),

        payload.phone || "",

        payload.email || "N/A",

        shippingAddress,

        productsSummary,

        totalQuantity,

        payload.totalAmount || 0,

        payload.paymentMethod || "N/A",

        payload.status || "Pending",
      ];
    }

    // Google Apps Script
    if (
      appScriptUrl &&
      appScriptUrl.startsWith("http")
    ) {
      console.log(
        "[SHEETS] Syncing through Apps Script..."
      );

      const response = await fetch(
        appScriptUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            spreadsheetId,
            sheetName: targetSheetName,
            row,
            headers,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Apps Script returned HTTP ${response.status}: ${errorText}`
        );
      }

      const result =
        await response.json();

      if (
        result &&
        result.success === false
      ) {
        throw new Error(
          result.error ||
            "Apps Script execution failed"
        );
      }

      console.log(
        "[SHEETS] Row successfully synced."
      );

      return {
        success: true,
        method: "apps_script",
      };
    }

    // Direct Google Sheets API
    if (
      spreadsheetId &&
      accessToken
    ) {
      const encodedRange =
        encodeURIComponent(
          `${targetSheetName}!A:K`
        );

      const response =
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              values: [row],
            }),
          }
        );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Sheets API returned HTTP ${response.status}: ${errorText}`
        );
      }

      console.log(
        "[SHEETS] Row successfully synced using Sheets API."
      );

      return {
        success: true,
        method: "sheets_api",
      };
    }

    throw new Error(
      "Google Sheets Integration is not configured."
    );
  }

  // ====================================================
  // UPDATE SHEETS SYNC STATUS
  // ====================================================

  async function updateSyncStatus(
    table: "inquiries" | "orders",
    id: string,
    status:
      | "synced"
      | "failed"
      | "pending",
    errorMsg?: string
  ) {
    if (!id) return;

    try {
      const updatePayload: any = {
        sheets_sync_status: status,

        sheets_synced_at:
          status === "synced"
            ? new Date().toISOString()
            : null,

        sheets_sync_error:
          errorMsg || null,
      };

      const { error } =
        await supabaseClient
          .from(table)
          .update(updatePayload)
          .eq("id", id);

      if (
        error &&
        (
          error.code === "42703" ||
          error.message?.includes("column")
        )
      ) {
        console.log(
          `[SHEETS-FALLBACK] Sync columns missing on ${table}.`
        );

        const { data: existingRow } =
          await supabaseClient
            .from(table)
            .select("*")
            .eq("id", id)
            .single();

        if (!existingRow) return;

        if (table === "inquiries") {
          let messageObj: any = {};

          try {
            messageObj =
              JSON.parse(
                existingRow.message || "{}"
              );
          } catch {
            messageObj = {
              raw_text:
                existingRow.message,
            };
          }

          messageObj.sheets_sync_status =
            status;

          messageObj.sheets_synced_at =
            status === "synced"
              ? new Date().toISOString()
              : null;

          messageObj.sheets_sync_error =
            errorMsg || null;

          await supabaseClient
            .from("inquiries")
            .update({
              message:
                JSON.stringify(messageObj),
            })
            .eq("id", id);
        } else {
          let cartItems =
            existingRow.cart_items;

          let updatedCartItems: any;

          if (
            Array.isArray(cartItems)
          ) {
            updatedCartItems = {
              items: cartItems,
              sheets_sync_status:
                status,
              sheets_synced_at:
                status === "synced"
                  ? new Date().toISOString()
                  : null,
              sheets_sync_error:
                errorMsg || null,
            };
          } else {
            updatedCartItems = {
              ...(cartItems || {}),
              sheets_sync_status:
                status,
              sheets_synced_at:
                status === "synced"
                  ? new Date().toISOString()
                  : null,
              sheets_sync_error:
                errorMsg || null,
            };
          }

          await supabaseClient
            .from("orders")
            .update({
              cart_items:
                updatedCartItems,
            })
            .eq("id", id);
        }
      }
    } catch (err) {
      console.error(
        `[SHEETS] Failed to update sync status for ${table} ${id}:`,
        err
      );
    }
  }

  // ====================================================
  // ORDER EMAIL
  // ====================================================

  async function sendOrderEmail(order: {
    orderId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
    totalAmount: number;
    cartItems: any[];
    dateTime?: string;
  }) {
    const transporter =
      await getEmailTransporter();

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      "Info@newbharatelectricals.com";

    const senderEmail =
      process.env.SMTP_USER ||
      "Info@newbharatelectricals.com";

    const dateTimeStr =
      order.dateTime ||
      new Date().toLocaleString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
        }
      );

    const productRowsHtml =
      order.cartItems
        .map((item: any) => {
          const name =
            escapeHtml(item.name);

          const brand =
            escapeHtml(
              item.brand || "N/A"
            );

          const sku =
            escapeHtml(
              item.sku || "N/A"
            );

          const quantity =
            item.quantity || 1;

          const price =
            item.sale_price ||
            item.regular_price ||
            0;

          const subtotal =
            price * quantity;

          return `
            <tr>
              <td style="
                padding:12px;
                border-bottom:1px solid #f3f4f6;
              ">
                <strong>${name}</strong>

                <p style="
                  margin:4px 0 0;
                  font-size:11px;
                  color:#6b7280;
                ">
                  Brand: ${brand} |
                  SKU: ${sku}
                </p>
              </td>

              <td style="
                padding:12px;
                text-align:center;
                border-bottom:1px solid #f3f4f6;
              ">
                ${quantity}
              </td>

              <td style="
                padding:12px;
                text-align:right;
                border-bottom:1px solid #f3f4f6;
              ">
                ₹${price.toLocaleString(
                  "en-IN"
                )}
              </td>

              <td style="
                padding:12px;
                text-align:right;
                font-weight:bold;
                border-bottom:1px solid #f3f4f6;
              ">
                ₹${subtotal.toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>
          `;
        })
        .join("");

    const adminMailOptions = {
      from:
        `"New Bharat Orders" <${senderEmail}>`,

      to: adminEmail,

      replyTo:
        order.email &&
        order.email !== "N/A"
          ? order.email
          : undefined,

      subject:
        `🛒 [NEW ORDER RECEIVED] Order ID: #${order.orderId} - ${order.firstName} ${order.lastName}`,

      html: `
        <div style="
          font-family:Arial,sans-serif;
          max-width:650px;
          margin:auto;
          border:1px solid #e5e7eb;
          border-radius:16px;
          overflow:hidden;
        ">

          <div style="
            background:#0284c7;
            padding:28px;
            text-align:center;
            color:white;
          ">

            <h2 style="margin:0;">
              New Order Received!
            </h2>

            <p>
              Order ID: #${escapeHtml(
                order.orderId
              )}
            </p>

            <p>
              Submitted on ${escapeHtml(
                dateTimeStr
              )}
            </p>

          </div>

          <div style="padding:32px;">

            <h3>
              Customer Details
            </h3>

            <table style="
              width:100%;
              border-collapse:collapse;
            ">

              <tr>
                <td style="
                  padding:10px;
                  font-weight:bold;
                ">
                  Customer Name
                </td>

                <td style="padding:10px;">
                  ${escapeHtml(
                    order.firstName
                  )}
                  ${escapeHtml(
                    order.lastName
                  )}
                </td>
              </tr>

              <tr>
                <td style="
                  padding:10px;
                  font-weight:bold;
                ">
                  Phone
                </td>

                <td style="padding:10px;">
                  <a
                    href="tel:${escapeHtml(
                      order.phone
                    )}"
                  >
                    ${escapeHtml(
                      order.phone
                    )}
                  </a>
                </td>
              </tr>

              <tr>
                <td style="
                  padding:10px;
                  font-weight:bold;
                ">
                  Email
                </td>

                <td style="padding:10px;">
                  ${
                    order.email &&
                    order.email !== "N/A"
                      ? escapeHtml(
                          order.email
                        )
                      : "Not Provided"
                  }
                </td>
              </tr>

              <tr>
                <td style="
                  padding:10px;
                  font-weight:bold;
                ">
                  Shipping Address
                </td>

                <td style="padding:10px;">
                  ${escapeHtml(
                    order.address
                  )}<br>
                  ${escapeHtml(
                    order.city
                  )},
                  ${escapeHtml(
                    order.state
                  )}
                  -
                  ${escapeHtml(
                    order.pincode
                  )}
                </td>
              </tr>

              <tr>
                <td style="
                  padding:10px;
                  font-weight:bold;
                ">
                  Payment Method
                </td>

                <td style="padding:10px;">
                  ${escapeHtml(
                    order.paymentMethod
                  )}
                </td>
              </tr>

            </table>

            <h3>
              Cart Summary
            </h3>

            <table style="
              width:100%;
              border-collapse:collapse;
              font-size:13px;
            ">

              <thead>
                <tr>
                  <th style="padding:10px;">
                    Product
                  </th>

                  <th style="padding:10px;">
                    Qty
                  </th>

                  <th style="padding:10px;">
                    Price
                  </th>

                  <th style="padding:10px;">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                ${productRowsHtml}

                <tr>
                  <td
                    colspan="3"
                    style="
                      padding:12px;
                      text-align:right;
                      font-weight:bold;
                    "
                  >
                    Grand Total:
                  </td>

                  <td style="
                    padding:12px;
                    text-align:right;
                    font-weight:bold;
                  ">
                    ₹${order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>

              </tbody>

            </table>

            <div style="
              text-align:center;
              margin-top:28px;
            ">

              <a
                href="tel:${escapeHtml(
                  order.phone
                )}"
                style="
                  display:inline-block;
                  background:#0284c7;
                  color:white;
                  padding:12px 28px;
                  border-radius:8px;
                  font-weight:bold;
                  text-decoration:none;
                "
              >
                Call Customer
              </a>

            </div>

          </div>

          <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            font-size:12px;
            color:#9ca3af;
          ">
            New Bharat Electricals • Order Management System
          </div>

        </div>
      `,
    };

    const infoAdmin =
      await transporter.sendMail(
        adminMailOptions
      );

    console.log(
      `[SMTP] Order notification sent: ${infoAdmin.messageId}`
    );

    // Customer confirmation
    if (
      order.email &&
      order.email !== "N/A" &&
      order.email.includes("@")
    ) {
      const customerMailOptions = {
        from:
          `"New Bharat Electricals" <${senderEmail}>`,

        to: order.email,

        subject:
          `Your Order #${order.orderId} is Received! - New Bharat Electricals`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:auto;
            border:1px solid #e5e7eb;
            border-radius:16px;
            overflow:hidden;
          ">

            <div style="
              background:#047857;
              padding:28px;
              text-align:center;
              color:white;
            ">

              <h2>
                Order Placed Successfully!
              </h2>

              <p>
                Order ID:
                #${escapeHtml(
                  order.orderId
                )}
              </p>

            </div>

            <div style="
              padding:32px;
              line-height:1.6;
            ">

              <p>
                Dear
                ${escapeHtml(
                  order.firstName
                )},
              </p>

              <p>
                We've received your order!
                Our team will verify your
                details and contact you
                shortly.
              </p>

              <div style="
                background:#f9fafb;
                padding:20px;
                border-radius:12px;
                margin:24px 0;
              ">

                <h4 style="
                  color:#047857;
                ">
                  Order Summary
                </h4>

                <p>
                  <b>Order ID:</b>
                  #${escapeHtml(
                    order.orderId
                  )}
                </p>

                <p>
                  <b>Total Amount:</b>
                  ₹${order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  <b>Payment:</b>
                  ${escapeHtml(
                    order.paymentMethod
                  )}
                </p>

                <p>
                  <b>Shipping Address:</b>
                  ${escapeHtml(
                    order.address
                  )},
                  ${escapeHtml(
                    order.city
                  )},
                  ${escapeHtml(
                    order.state
                  )}
                  -
                  ${escapeHtml(
                    order.pincode
                  )}
                </p>

              </div>

              <p>
                For any questions, call us at
                <a
                  href="tel:+919457002000"
                  style="
                    color:#047857;
                    font-weight:bold;
                  "
                >
                  +91 94570 02000
                </a>.
              </p>

              <p>
                Best regards,<br>
                <strong>
                  New Bharat Electricals
                </strong>
              </p>

            </div>

            <div style="
              background:#f9fafb;
              padding:20px;
              text-align:center;
              font-size:11px;
              color:#9ca3af;
            ">
              This is an automated order confirmation.
            </div>

          </div>
        `,
      };

      const infoCustomer =
        await transporter.sendMail(
          customerMailOptions
        );

      console.log(
        `[SMTP] Customer order confirmation sent: ${infoCustomer.messageId}`
      );
    }
  }

  // ====================================================
  // INQUIRY SUBMISSION
  // ====================================================

  app.post(
    "/api/inquiries/submit",
    async (req, res) => {
      const {
        id,
        fullName,
        emailAddress,
        phoneNumber,
        companyName,
        subject,
        message,
        pageUrl,
        dateTime,
        source,
        productName,
        productSku,
        productId,
      } = req.body;

      const validationError =
        validateFormFields(
          fullName,
          phoneNumber,
          emailAddress
        );

      if (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError,
        });
      }

      if (
        isDuplicateSubmission(
          phoneNumber,
          emailAddress,
          message || ""
        )
      ) {
        return res.status(429).json({
          success: false,
          error:
            "A duplicate submission was detected. Please wait 15 seconds.",
        });
      }

      try {
        await sendFormEmails({
          fullName:
            fullName.trim(),

          emailAddress:
            (emailAddress || "")
              .trim() || "N/A",

          phoneNumber:
            phoneNumber.trim(),

          companyName:
            (companyName || "").trim(),

          subject:
            (subject ||
              "General Enquiry").trim(),

          message:
            (message || "").trim(),

          pageUrl:
            pageUrl ||
            req.headers.referer ||
            "https://newbharatelectricals.com/",

          dateTime,

          productName:
            productName || undefined,

          productSku:
            productSku || undefined,

          productId:
            productId || undefined,
        });

        // Google Sheets sync
        if (id) {
          try {
            await syncRowToSheets(
              "inquiry",
              {
                fullName,
                phoneNumber,
                emailAddress,
                companyName,
                subject,
                message,
                dateTime,
                source:
                  source ||
                  (pageUrl?.includes(
                    "contact"
                  )
                    ? "Contact Page"
                    : "Popup"),
              }
            );

            await updateSyncStatus(
              "inquiries",
              id,
              "synced"
            );
          } catch (sheetsErr: any) {
            console.error(
              "[SHEETS-ERROR]",
              sheetsErr
            );

            await updateSyncStatus(
              "inquiries",
              id,
              "pending",
              sheetsErr.message ||
                String(sheetsErr)
            );
          }
        }

        return res.status(200).json({
          success: true,
          message:
            "Thank you for contacting New Bharat Electricals. We have received your enquiry.",
        });
      } catch (err: any) {
        console.error(
          "[SMTP-ERROR]",
          err
        );

        if (id) {
          await updateSyncStatus(
            "inquiries",
            id,
            "pending",
            "Email failed: " +
              (err.message ||
                String(err))
          );
        }

        return res.status(500).json({
          success: false,
          error:
            "Your enquiry could not be emailed right now. Please try again shortly.",
        });
      }
    }
  );

  // ====================================================
  // ORDER SUBMISSION
  // ====================================================

  app.post(
    "/api/orders/submit",
    async (req, res) => {
      const {
        id,
        orderId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod,
        totalAmount,
        cartItems,
        dateTime,
        status,
      } = req.body;

      if (
        !orderId ||
        !firstName ||
        !phone ||
        !cartItems ||
        cartItems.length === 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required order information.",
        });
      }

      try {
        await sendOrderEmail({
          orderId,
          firstName,
          lastName: lastName || "",
          email: email || "N/A",
          phone,
          address: address || "",
          city: city || "",
          state: state || "",
          pincode: pincode || "",
          paymentMethod:
            paymentMethod || "N/A",
          totalAmount:
            Number(totalAmount) || 0,
          cartItems,
          dateTime,
        });

        if (id) {
          try {
            await syncRowToSheets(
              "order",
              {
                orderId,
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                paymentMethod,
                totalAmount,
                cartItems,
                dateTime,
                status,
              }
            );

            await updateSyncStatus(
              "orders",
              id,
              "synced"
            );
          } catch (sheetsErr: any) {
            console.error(
              "[SHEETS-ERROR]",
              sheetsErr
            );

            await updateSyncStatus(
              "orders",
              id,
              "pending",
              sheetsErr.message ||
                String(sheetsErr)
            );
          }
        }

        return res.status(200).json({
          success: true,
          message:
            "Order processed successfully.",
        });
      } catch (err: any) {
        console.error(
          "[ORDER-SUBMIT-ERROR]",
          err
        );

        if (id) {
          await updateSyncStatus(
            "orders",
            id,
            "pending",
            "Email failed: " +
              (err.message ||
                String(err))
          );
        }

        return res.status(500).json({
          success: false,
          error:
            "Order saved but email dispatch failed.",
        });
      }
    }
  );

  // ====================================================
  // LEADS NOTIFICATION
  // ====================================================

  app.post(
    "/api/leads/notify",
    async (req, res) => {
      const {
        name,
        phone,
        email,
        city,
        interestedIn,
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required lead fields",
        });
      }

      try {
        const pageUrl =
          req.headers.referer ||
          "https://newbharatelectricals.com/";

        await sendFormEmails({
          fullName: name,
          emailAddress:
            email || "N/A",
          phoneNumber: phone,
          companyName: "",
          subject:
            `Consultation Request: ${
              interestedIn ||
              "General"
            }`,
          message:
            `Interested Product: ${
              interestedIn ||
              "N/A"
            }\nCity/Location: ${
              city || "N/A"
            }`,
          pageUrl,
        });

        return res.status(200).json({
          success: true,
          message:
            "Lead submitted successfully.",
        });
      } catch (err: any) {
        console.error(
          "[SMTP-ERROR]",
          err
        );

        return res.status(500).json({
          success: false,
          error:
            "Failed to send lead notification.",
        });
      }
    }
  );

  // ====================================================
  // INQUIRY NOTIFICATION
  // ====================================================

  app.post(
    "/api/inquiries/notify",
    async (req, res) => {
      const {
        name,
        phone,
        email,
        inquiryType,
        message,
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required inquiry fields",
        });
      }

      try {
        const pageUrl =
          req.headers.referer ||
          "https://newbharatelectricals.com/";

        await sendFormEmails({
          fullName: name,
          emailAddress:
            email || "N/A",
          phoneNumber: phone,
          companyName: "",
          subject:
            inquiryType ||
            "General Inquiry",
          message: message || "",
          pageUrl,
        });

        return res.status(200).json({
          success: true,
        });
      } catch (err: any) {
        console.error(
          "[SMTP-ERROR]",
          err
        );

        return res.status(500).json({
          success: false,
          error:
            "Failed to send inquiry email.",
        });
      }
    }
  );

  // ====================================================
  // VITE DEVELOPMENT / PRODUCTION
  // ====================================================

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    console.log(
      "Starting server in DEVELOPMENT mode with Vite middleware..."
    );

    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,

          hmr:
            process.env
              .DISABLE_HMR !==
            "true",

          watch:
            process.env
              .DISABLE_HMR ===
            "true"
              ? null
              : {},
        },

        appType: "spa",
      });

    app.use(vite.middlewares);
  } else {
    console.log(
      "Starting server in PRODUCTION mode..."
    );

    const distPath = path.join(
      process.cwd(),
      "dist"
    );

    app.use(
      express.static(
        distPath,
        {
          maxAge: "1d",
          etag: true,
        }
      )
    );

    app.get(
      /.*/,
      (req, res) => {
        res.sendFile(
          path.join(
            distPath,
            "index.html"
          )
        );
      }
    );
  }

  // ====================================================
  // START SERVER
  // ====================================================

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `Server running on http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer().catch(
  (err) => {
    console.error(
      "Failed to start server:",
      err
    );

    process.exit(1);
  }
);