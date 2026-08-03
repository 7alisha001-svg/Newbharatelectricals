import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ftxyuhwejcqxoyhmkczl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Lazy initialize nodemailer transporter
let emailTransporter: any = null;

async function getEmailTransporter() {
  if (emailTransporter) return emailTransporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log(`[SMTP] Initializing custom SMTP transporter: ${host}:${port}`);
    emailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    console.log("[SMTP] No custom credentials found. Provisioning a secure Ethereal test inbox...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[SMTP] Ethereal account created: ${testAccount.user}`);
      emailTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      emailTransporter.isTest = true;
    } catch (err) {
      console.error("[SMTP] Failed to configure Ethereal, falling back to clean CLI Logger:", err);
      emailTransporter = {
        sendMail: async (options: any) => {
          console.log("\n=================== SIMULATED SMTP EMAIL ===================");
          console.log(`From:    ${options.from}`);
          console.log(`To:      ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log("------------------ HTML BODY ------------------");
          console.log(options.html);
          console.log("============================================================\n");
          return { messageId: "cli-simulated-id", isSimulated: true };
        }
      };
    }
  }
  return emailTransporter;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // Health check API endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // In-memory cache to prevent spam/duplicate submissions (15 seconds window)
  const submissionCache = new Map<string, number>();

  function isDuplicateSubmission(phone: string, email: string, message: string): boolean {
    const now = Date.now();
    const key = `${phone.trim()}_${(email || "").trim()}_${(message || "").slice(0, 100)}`;
    const lastSubmissionTime = submissionCache.get(key);
    
    if (lastSubmissionTime && (now - lastSubmissionTime < 15000)) {
      return true;
    }
    submissionCache.set(key, now);
    
    // Clean up cache periodically if it gets too large
    if (submissionCache.size > 1000) {
      for (const [k, v] of submissionCache.entries()) {
        if (now - v > 60000) {
          submissionCache.delete(k);
        }
      }
    }
    
    return false;
  }

  // Validate fields before sending
  function validateFormFields(fullName: string, phoneNumber: string, emailAddress: string): string | null {
    if (!fullName || !fullName.trim()) {
      return "Full name is required.";
    }
    const cleanPhone = phoneNumber ? phoneNumber.trim() : "";
    if (!cleanPhone) {
      return "Phone number is required.";
    }
    // Simple, robust regex verifying phone has at least 10 digits
    const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(cleanPhone.replace(/[\s\-()]/g, ''))) {
      return "Please enter a valid phone number (at least 10 digits).";
    }
    const cleanEmail = emailAddress ? emailAddress.trim() : "";
    if (cleanEmail && cleanEmail !== "N/A") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return "Please enter a valid email address.";
      }
    }
    return null;
  }

  // Unified email dispatcher for all enquiry/contact forms
  async function sendFormEmails(submission: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    companyName?: string;
    subject: string;
    message: string;
    pageUrl: string;
    dateTime?: string;
  }) {
    const transporter = await getEmailTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || "Info@newbharatelectricals.com";
    const dateTimeStr = submission.dateTime || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const senderEmail = process.env.SMTP_USER || "Info@newbharatelectricals.com";

    // Set high-priority headers to avoid spam folders
    const fromHeader = `"New Bharat Enquiry" <${senderEmail}>`;

    // 1. Detailed Notification Email to Info@newbharatelectricals.com
    const adminMailOptions = {
      from: fromHeader,
      to: adminEmail,
      replyTo: submission.emailAddress && submission.emailAddress !== "N/A" ? submission.emailAddress : undefined,
      subject: `📩 [New Website Enquiry] ${submission.subject}: ${submission.fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #1f2937;">
          <div style="background-color: #047857; padding: 28px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Enquiry Received</h2>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Form submitted at ${submission.pageUrl}</p>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h3 style="margin-top: 0; margin-bottom: 20px; color: #111827; font-size: 18px; font-weight: 700; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Submission Details</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563; width: 180px;">Full Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold;">${submission.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Email Address</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">
                  ${submission.emailAddress && submission.emailAddress !== "N/A" ? `<a href="mailto:${submission.emailAddress}" style="color: #047857; text-decoration: none; font-weight: 600;">${submission.emailAddress}</a>` : "Not Provided"}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Phone Number</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: 600;">
                  <a href="tel:${submission.phoneNumber}" style="color: #047857; text-decoration: none;">${submission.phoneNumber}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Company Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${submission.companyName || "Not Provided"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Subject / Category</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #ffffff;"><span style="background-color: #047857; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">${submission.subject}</span></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Submission Time</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">${dateTimeStr}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Page URL</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563; font-size: 13px; word-break: break-all;">
                  <a href="${submission.pageUrl}" style="color: #047857; text-decoration: none;">${submission.pageUrl}</a>
                </td>
              </tr>
            </table>

            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin-top: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Message Requirements / Comments</h4>
              <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${submission.message || "No message provided."}</p>
            </div>
            
            <div style="text-align: center; margin-top: 28px;">
              <a href="tel:${submission.phoneNumber}" style="display: inline-block; background-color: #047857; color: white; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 2px 4px rgba(4,120,87,0.2);">Call Customer Now</a>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; font-weight: 500;">
            New Bharat Electricals • Lead Management System
          </div>
        </div>
      `
    };

    const infoAdmin = await transporter.sendMail(adminMailOptions);
    if (transporter.isTest) {
      console.log(`[SMTP-TEST] Detailed Notification Sent. Inspect: ${nodemailer.getTestMessageUrl(infoAdmin)}`);
    }

    // 2. Automatic Confirmation Email to Customer (if valid email is provided)
    if (submission.emailAddress && submission.emailAddress !== "N/A" && submission.emailAddress.includes("@")) {
      const customerMailOptions = {
        from: `"New Bharat Electricals" <${senderEmail}>`,
        to: submission.emailAddress,
        subject: `We've received your enquiry - New Bharat Electricals`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #374151;">
            <div style="background-color: #ea580c; padding: 28px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.025em;">Enquiry Received!</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">We have received your enquiry successfully</p>
            </div>
            <div style="padding: 32px; background-color: #ffffff; line-height: 1.6;">
              <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #111827;">Dear ${submission.fullName},</p>
              <p>Thank you for contacting New Bharat Electricals. We have received your enquiry and our team will contact you shortly.</p>
              
              <p>We are dedicated to providing the absolute best in high-performance solar energy solutions, inverters, batteries, and premium electrical products. Our power experts are currently reviewing your request details.</p>

              <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #f3f4f6;">
                <h4 style="margin: 0 0 10px 0; color: #ea580c; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Your Enquiry Overview</h4>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Subject:</b> ${submission.subject}</p>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Mobile Number:</b> ${submission.phoneNumber}</p>
                ${submission.companyName ? `<p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Company Name:</b> ${submission.companyName}</p>` : ''}
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Message:</b> ${submission.message || 'General Enquiry'}</p>
              </div>

              <p>If you have any urgent questions, please feel free to call our priority support line at <a href="tel:+919457002000" style="color: #ea580c; font-weight: bold; text-decoration: none;">+91 94570 02000</a>.</p>
              
              <p style="margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Best regards,<br>
                <b style="color: #111827;">The Solar & Power Team</b><br>
                New Bharat Electricals
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; font-weight: 500;">
              This is an automated confirmation email. Please do not reply directly to this address.
            </div>
          </div>
        `
      };

      const infoCustomer = await transporter.sendMail(customerMailOptions);
      if (transporter.isTest) {
        console.log(`[SMTP-TEST] Customer Confirmation Sent. Inspect: ${nodemailer.getTestMessageUrl(infoCustomer)}`);
      }
    }
  }

  // Helper to sync inquiries and orders to Google Sheets
  async function syncRowToSheets(type: 'inquiry' | 'order', payload: any, accessToken?: string) {
    // Fetch settings from Supabase to check configs
    const { data: settings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (settingsError) {
      console.error('[SHEETS] Error fetching settings:', settingsError);
      throw new Error('Could not fetch Google Sheets configuration from settings.');
    }

    const socialLinks = settings?.social_links || {};
    const appScriptUrl = socialLinks.google_sheets_app_script_url;
    const spreadsheetId = socialLinks.google_sheets_spreadsheet_id;
    const inquirySheetName = socialLinks.google_sheets_inquiry_sheet_name || 'Inquiries';
    const orderSheetName = socialLinks.google_sheets_order_sheet_name || 'Orders';

    let row: any[] = [];
    let headers: string[] = [];
    let targetSheetName = '';

    if (type === 'inquiry') {
      targetSheetName = inquirySheetName;
      headers = ['Date & Time', 'Full Name', 'Phone Number', 'Email', 'Company Name', 'Product Category', 'Message', 'Source (Popup/Contact Page)'];
      row = [
        payload.dateTime || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        payload.fullName || '',
        payload.phoneNumber || '',
        payload.emailAddress || 'N/A',
        payload.companyName || 'N/A',
        payload.subject || 'General Enquiry',
        payload.message || '',
        payload.source || 'Popup/Contact Page'
      ];
    } else {
      targetSheetName = orderSheetName;
      headers = ['Order ID', 'Date & Time', 'Customer Name', 'Phone', 'Email', 'Shipping Address', 'Products', 'Quantity', 'Total Amount', 'Payment Method', 'Order Status'];
      
      const cart = payload.cartItems || [];
      const productsSummary = cart.map((item: any) => `${item.name} x ${item.quantity || 1}`).join(', ');
      const totalQuantity = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      const shippingAddress = `${payload.address || ''}, ${payload.city || ''}, ${payload.state || ''} - ${payload.pincode || ''}`;

      row = [
        payload.orderId || '',
        payload.dateTime || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
        payload.phone || '',
        payload.email || 'N/A',
        shippingAddress,
        productsSummary,
        totalQuantity,
        payload.totalAmount || 0,
        payload.paymentMethod || 'N/A',
        payload.status || 'Pending'
      ];
    }

    // Try App Script Web App if available (most robust, runs as script owner)
    if (appScriptUrl && appScriptUrl.startsWith('http')) {
      console.log(`[SHEETS] Syncing via Google Apps Script: ${appScriptUrl}`);
      const response = await fetch(appScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId,
          sheetName: targetSheetName,
          row,
          headers
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Apps Script returned HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result && result.success === false) {
        throw new Error(result.error || 'Apps Script execution failed');
      }
      console.log('[SHEETS] Successfully synced row to sheet via Apps Script.');
      return { success: true, method: 'apps_script' };
    }

    // Try direct Google Sheets API if accessToken is provided
    if (spreadsheetId && accessToken) {
      console.log(`[SHEETS] Syncing via direct Sheets API. Spreadsheet ID: ${spreadsheetId}`);
      const encodedRange = encodeURIComponent(`${targetSheetName}!A:K`);
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [row],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets API append returned HTTP ${response.status}: ${errorText}`);
      }

      console.log('[SHEETS] Successfully synced row to sheet via direct Sheets API.');
      return { success: true, method: 'sheets_api' };
    }

    throw new Error('Google Sheets Integration is not fully configured (Apps Script Web App URL or Spreadsheet ID + Access Token is required).');
  }

  // Adaptive sync status updater
  async function updateSyncStatus(
    table: 'inquiries' | 'orders',
    id: string,
    status: 'synced' | 'failed' | 'pending',
    errorMsg?: string
  ) {
    if (!id) return;
    try {
      // 1. Try to update top-level columns first
      const updatePayload: any = {
        sheets_sync_status: status,
        sheets_synced_at: status === 'synced' ? new Date().toISOString() : null,
        sheets_sync_error: errorMsg || null
      };

      const { error } = await supabaseClient
        .from(table)
        .update(updatePayload)
        .eq('id', id);

      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        console.log(`[SHEETS-FALLBACK] Column missing on ${table}, falling back to JSON storage.`);
        // 2. Fallback: Update JSON field
        const { data: existingRow } = await supabaseClient
          .from(table)
          .select('*')
          .eq('id', id)
          .single();

        if (existingRow) {
          if (table === 'inquiries') {
            let messageObj: any = {};
            try {
              messageObj = JSON.parse(existingRow.message || '{}');
            } catch (e) {
              messageObj = { raw_text: existingRow.message };
            }
            messageObj.sheets_sync_status = status;
            messageObj.sheets_synced_at = status === 'synced' ? new Date().toISOString() : null;
            messageObj.sheets_sync_error = errorMsg || null;

            await supabaseClient
              .from('inquiries')
              .update({ message: JSON.stringify(messageObj) })
              .eq('id', id);
          } else {
            // Orders table: store inside cart_items JSON
            let cartItems = existingRow.cart_items;
            let updatedCartItems: any = {};
            if (Array.isArray(cartItems)) {
              updatedCartItems = {
                items: cartItems,
                sheets_sync_status: status,
                sheets_synced_at: status === 'synced' ? new Date().toISOString() : null,
                sheets_sync_error: errorMsg || null
              };
            } else {
              updatedCartItems = {
                ...(cartItems || {}),
                sheets_sync_status: status,
                sheets_synced_at: status === 'synced' ? new Date().toISOString() : null,
                sheets_sync_error: errorMsg || null
              };
            }

            await supabaseClient
              .from('orders')
              .update({ cart_items: updatedCartItems })
              .eq('id', id);
          }
        }
      }
    } catch (err) {
      console.error(`[SHEETS] Failed to update sync status for ${table} ${id}:`, err);
    }
  }

  // Unified email dispatcher for customer orders
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
    const transporter = await getEmailTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || "Info@newbharatelectricals.com";
    const dateTimeStr = order.dateTime || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const senderEmail = process.env.SMTP_USER || "Info@newbharatelectricals.com";

    const fromHeader = `"New Bharat Orders" <${senderEmail}>`;

    // format product rows for HTML email
    const productRowsHtml = order.cartItems.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: left;">
          <p style="margin: 0; font-weight: bold; color: #111827;">${item.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #6b7280;">Brand: ${item.brand || 'N/A'} | SKU: ${item.sku || 'N/A'}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #4b5563;">${item.quantity || 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #4b5563;">₹${(item.sale_price || item.regular_price || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold; color: #111827;">₹${((item.sale_price || item.regular_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    // 1. Detailed Notification Email to Info@newbharatelectricals.com
    const adminMailOptions = {
      from: fromHeader,
      to: adminEmail,
      replyTo: order.email && order.email !== "N/A" ? order.email : undefined,
      subject: `🛒 [NEW ORDER RECEIVED] Order ID: #${order.orderId} - ${order.firstName} ${order.lastName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #1f2937;">
          <div style="background-color: #0284c7; padding: 28px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Order Received!</h2>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Order ID: #${order.orderId} | Submitted on ${dateTimeStr}</p>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h3 style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: 18px; font-weight: 700; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Customer Details</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563; width: 150px;">Customer Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold;">${order.firstName} ${order.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Phone Number</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: 600;">
                  <a href="tel:${order.phone}" style="color: #0284c7; text-decoration: none;">${order.phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Email Address</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">
                  ${order.email && order.email !== "N/A" ? `<a href="mailto:${order.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${order.email}</a>` : "Not Provided"}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;" valign="top">Shipping Address</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; line-height: 1.5;">
                  ${order.address}<br>
                  ${order.city}, ${order.state} - <b>${order.pincode}</b>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Payment Method</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #ffffff;"><span style="background-color: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">${order.paymentMethod}</span></td>
              </tr>
            </table>

            <h3 style="margin-top: 24px; margin-bottom: 16px; color: #111827; font-size: 18px; font-weight: 700; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Cart Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
              <thead>
                <tr style="background-color: #f9fafb; text-align: left;">
                  <th style="padding: 12px; font-weight: bold; color: #4b5563;">Item Description</th>
                  <th style="padding: 12px; font-weight: bold; color: #4b5563; text-align: center;">Qty</th>
                  <th style="padding: 12px; font-weight: bold; color: #4b5563; text-align: right;">Unit Price</th>
                  <th style="padding: 12px; font-weight: bold; color: #4b5563; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productRowsHtml}
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;"></td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold; color: #4b5563;">Grand Total:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: 800; color: #111827; font-size: 16px;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 28px;">
              <a href="tel:${order.phone}" style="display: inline-block; background-color: #0284c7; color: white; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 2px 4px rgba(2,132,199,0.2);">Call Customer to Confirm</a>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; font-weight: 500;">
            New Bharat Electricals • Order Management System
          </div>
        </div>
      `
    };

    const infoAdmin = await transporter.sendMail(adminMailOptions);
    if (transporter.isTest) {
      console.log(`[SMTP-TEST] Detailed Order Notification Sent. Inspect: ${nodemailer.getTestMessageUrl(infoAdmin)}`);
    }

    // 2. Confirmation Email to Customer (if valid email is provided)
    if (order.email && order.email !== "N/A" && order.email.includes("@")) {
      const customerMailOptions = {
        from: `"New Bharat Electricals" <${senderEmail}>`,
        to: order.email,
        subject: `Your Order #${order.orderId} is Received! - New Bharat Electricals`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #374151;">
            <div style="background-color: #047857; padding: 28px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.025em;">Order Placed Successfully!</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for shopping with us. Order ID: #${order.orderId}</p>
            </div>
            <div style="padding: 32px; background-color: #ffffff; line-height: 1.6;">
              <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #111827;">Dear ${order.firstName},</p>
              <p>We've received your order! Our team will verify your details and get in touch with you shortly to coordinate dispatch and delivery.</p>

              <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #f3f4f6;">
                <h4 style="margin: 0 0 10px 0; color: #047857; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</h4>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Order ID:</b> #${order.orderId}</p>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Total Amount:</b> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Payment Method:</b> ${order.paymentMethod}</p>
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;"><b>Shipping Address:</b> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
              </div>

              <p>For any changes, cancellations, or delivery questions, please call our direct helpline at <a href="tel:+919457002000" style="color: #047857; font-weight: bold; text-decoration: none;">+91 94570 02000</a>.</p>
              
              <p style="margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Best regards,<br>
                <b style="color: #111827;">Support Team</b><br>
                New Bharat Electricals
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; font-weight: 500;">
              This is an automated order receipt confirmation. Please do not reply directly.
            </div>
          </div>
        `
      };

      const infoCustomer = await transporter.sendMail(customerMailOptions);
      if (transporter.isTest) {
        console.log(`[SMTP-TEST] Customer Order Confirmation Sent. Inspect: ${nodemailer.getTestMessageUrl(infoCustomer)}`);
      }
    }
  }

  // Unified endpoint for submissions from all contact and enquiry forms
  app.post("/api/inquiries/submit", async (req, res) => {
    const { id, fullName, emailAddress, phoneNumber, companyName, subject, message, pageUrl, dateTime, source } = req.body;

    // 1. Validate form fields
    const validationError = validateFormFields(fullName, phoneNumber, emailAddress);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // 2. Prevent spam and duplicate submissions
    if (isDuplicateSubmission(phoneNumber, emailAddress, message || "")) {
      return res.status(429).json({ 
        success: false, 
        error: "A duplicate submission was detected. If you need to send another enquiry, please wait 15 seconds." 
      });
    }

    try {
      // 3. Dispatch emails via SMTP
      await sendFormEmails({
        fullName: fullName.trim(),
        emailAddress: (emailAddress || "").trim() || "N/A",
        phoneNumber: phoneNumber.trim(),
        companyName: (companyName || "").trim(),
        subject: (subject || "General Enquiry").trim(),
        message: (message || "").trim(),
        pageUrl: pageUrl || req.headers.referer || "https://newbharatelectricals.com/",
        dateTime: dateTime
      });

      // 4. Try to sync to Google Sheets (if configured)
      if (id) {
        try {
          await syncRowToSheets('inquiry', {
            fullName,
            phoneNumber,
            emailAddress,
            companyName,
            subject,
            message,
            dateTime,
            source: source || (pageUrl?.includes('contact') ? 'Contact Page' : 'Popup')
          });
          await updateSyncStatus('inquiries', id, 'synced');
        } catch (sheetsErr: any) {
          console.error('[SHEETS-ERROR] Google Sheets sync failed during submission, marked as pending:', sheetsErr.message || sheetsErr);
          await updateSyncStatus('inquiries', id, 'pending', sheetsErr.message || String(sheetsErr));
        }
      }

      res.status(200).json({ 
        success: true, 
        message: "Thank you for contacting New Bharat Electricals. We have received your enquiry and our team will contact you shortly." 
      });
    } catch (err: any) {
      console.error("[SMTP-ERROR] Form submission email delivery failed:", err);
      // Even if email fails, we want the record synced if possible
      if (id) {
        await updateSyncStatus('inquiries', id, 'pending', 'Email failed: ' + (err.message || String(err)));
      }
      res.status(500).json({ 
        success: false, 
        error: "We've registered your details, but we're experiencing a temporary issue sending email confirmation right now. Rest assured our team has been informed and will reach out to you shortly." 
      });
    }
  });

  // API endpoint for Order checkout submissions
  app.post("/api/orders/submit", async (req, res) => {
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
      status
    } = req.body;

    if (!orderId || !firstName || !phone || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: "Missing required order information." });
    }

    try {
      // 1. Send Order Emails
      await sendOrderEmail({
        orderId,
        firstName,
        lastName: lastName || '',
        email: email || 'N/A',
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod,
        totalAmount,
        cartItems,
        dateTime
      });

      // 2. Try to sync to Google Sheets (if configured)
      if (id) {
        try {
          await syncRowToSheets('order', {
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
            status
          });
          await updateSyncStatus('orders', id, 'synced');
        } catch (sheetsErr: any) {
          console.error('[SHEETS-ERROR] Order Google Sheets sync failed, marked as pending:', sheetsErr.message || sheetsErr);
          await updateSyncStatus('orders', id, 'pending', sheetsErr.message || String(sheetsErr));
        }
      }

      res.status(200).json({ success: true, message: "Order processed successfully." });
    } catch (err: any) {
      console.error("[ORDER-SUBMIT-ERROR] Order submission processing failed:", err);
      if (id) {
        await updateSyncStatus('orders', id, 'pending', 'Email failed: ' + (err.message || String(err)));
      }
      res.status(500).json({ success: false, error: "Order saved but failed to complete dispatch processes." });
    }
  });

  // API endpoint to batch sync pending records to Google Sheets
  app.post("/api/sheets/sync-pending", async (req, res) => {
    const { accessToken } = req.body;
    
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    try {
      // Fetch pending inquiries (check both schemas)
      let pendingInquiries: any[] = [];
      const { data: inqData, error: inqErr } = await supabaseClient
        .from('inquiries')
        .select('*')
        .or('sheets_sync_status.eq.pending,sheets_sync_status.is.null');

      if (inqErr && (inqErr.code === '42703' || inqErr.message?.includes('column'))) {
        // Fallback filter
        const { data: allInq } = await supabaseClient
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        pendingInquiries = (allInq || []).filter(item => {
          try {
            const msgObj = JSON.parse(item.message || '{}');
            return !msgObj.sheets_sync_status || msgObj.sheets_sync_status === 'pending' || msgObj.sheets_sync_status === 'failed';
          } catch (e) {
            return true;
          }
        });
      } else {
        pendingInquiries = (inqData || []).filter(item => item.sheets_sync_status !== 'synced');
      }

      // Fetch pending orders
      let pendingOrders: any[] = [];
      const { data: ordData, error: ordErr } = await supabaseClient
        .from('orders')
        .select('*')
        .or('sheets_sync_status.eq.pending,sheets_sync_status.is.null');

      if (ordErr && (ordErr.code === '42703' || ordErr.message?.includes('column'))) {
        const { data: allOrd } = await supabaseClient
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        pendingOrders = (allOrd || []).filter(item => {
          try {
            const cart = item.cart_items || {};
            if (Array.isArray(cart)) return true;
            return !cart.sheets_sync_status || cart.sheets_sync_status === 'pending' || cart.sheets_sync_status === 'failed';
          } catch (e) {
            return true;
          }
        });
      } else {
        pendingOrders = (ordData || []).filter(item => item.sheets_sync_status !== 'synced');
      }

      // Sync inquiries
      for (const inq of pendingInquiries) {
        let msgObj: any = {};
        try {
          msgObj = JSON.parse(inq.message || '{}');
        } catch (e) {}

        try {
          await syncRowToSheets('inquiry', {
            fullName: inq.name,
            phoneNumber: inq.phone,
            emailAddress: msgObj.email || 'N/A',
            companyName: msgObj.company || 'N/A',
            subject: inq.inquiry_type,
            message: msgObj.message || inq.message,
            dateTime: inq.created_at ? new Date(inq.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : undefined,
            source: msgObj.is_contact ? 'Contact Page' : 'Popup'
          }, accessToken);

          await updateSyncStatus('inquiries', inq.id, 'synced');
          successCount++;
        } catch (err: any) {
          console.error(`[SHEETS-RETRY] Inquiry sync failed for ${inq.id}:`, err);
          await updateSyncStatus('inquiries', inq.id, 'failed', err.message || String(err));
          failCount++;
          errors.push(`Inquiry from ${inq.name}: ${err.message || String(err)}`);
        }
      }

      // Sync orders
      for (const ord of pendingOrders) {
        let cartItems = ord.cart_items;
        if (cartItems && !Array.isArray(cartItems) && cartItems.items) {
          cartItems = cartItems.items;
        }

        try {
          await syncRowToSheets('order', {
            orderId: ord.order_id,
            firstName: ord.first_name,
            lastName: ord.last_name,
            email: ord.email,
            phone: ord.phone,
            address: ord.address,
            city: ord.city,
            state: ord.state,
            pincode: ord.pincode,
            paymentMethod: ord.payment_method,
            totalAmount: ord.total_amount,
            cartItems: cartItems || [],
            status: ord.status,
            dateTime: ord.created_at ? new Date(ord.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : undefined
          }, accessToken);

          await updateSyncStatus('orders', ord.id, 'synced');
          successCount++;
        } catch (err: any) {
          console.error(`[SHEETS-RETRY] Order sync failed for ${ord.id}:`, err);
          await updateSyncStatus('orders', ord.id, 'failed', err.message || String(err));
          failCount++;
          errors.push(`Order ID ${ord.order_id}: ${err.message || String(err)}`);
        }
      }

      res.status(200).json({
        success: true,
        successCount,
        failCount,
        errors
      });
    } catch (err: any) {
      console.error('[SHEETS-RETRY] Bulk retry endpoint error:', err);
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  // API Route: Send Email Notification for New Lead Capture (Backwards compatibility helper)
  app.post("/api/leads/notify", async (req, res) => {
    const { name, phone, email, city, interestedIn } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required lead fields" });
    }

    try {
      const pageUrl = req.headers.referer || "https://newbharatelectricals.com/";
      await sendFormEmails({
        fullName: name,
        emailAddress: email || "N/A",
        phoneNumber: phone,
        companyName: "",
        subject: `Consultation Request: ${interestedIn || "General"}`,
        message: `Interested Product: ${interestedIn || "N/A"}\nCity/Location: ${city || "N/A"}`,
        pageUrl: pageUrl
      });
      res.status(200).json({ success: true, message: "Lead submitted and notifications dispatched successfully" });
    } catch (err: any) {
      console.error("[SMTP-ERROR] Error sending lead notification emails:", err);
      res.status(200).json({ success: true, error: "Lead stored but notification email failed to send" });
    }
  });

  // API Route: Send Email Notification for Inquiries (Backwards compatibility helper)
  app.post("/api/inquiries/notify", async (req, res) => {
    const { name, phone, email, inquiryType, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    try {
      const pageUrl = req.headers.referer || "https://newbharatelectricals.com/";
      await sendFormEmails({
        fullName: name,
        emailAddress: email || "N/A",
        phoneNumber: phone,
        companyName: "",
        subject: inquiryType || "General Inquiry",
        message: message || "",
        pageUrl: pageUrl
      });
      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("[SMTP-ERROR] Error sending inquiry emails:", err);
      res.status(200).json({ success: true, error: "Email failed" });
    }
  });

  // Vite middleware or static serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        watch: process.env.DISABLE_HMR === "true" ? null : {},
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files
    app.use(express.static(distPath, {
      maxAge: "1d",
      etag: true,
    }));
    
    // Fallback all other requests to index.html for React Router to handle SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
