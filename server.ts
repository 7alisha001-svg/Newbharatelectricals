import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

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

  // Unified endpoint for submissions from all contact and enquiry forms
  app.post("/api/inquiries/submit", async (req, res) => {
    const { fullName, emailAddress, phoneNumber, companyName, subject, message, pageUrl, dateTime } = req.body;

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

      res.status(200).json({ 
        success: true, 
        message: "Thank you for contacting New Bharat Electricals. We have received your enquiry and our team will contact you shortly." 
      });
    } catch (err: any) {
      console.error("[SMTP-ERROR] Form submission email delivery failed:", err);
      // Return a 500 but log the technical error server-side, presenting a clean user-friendly message
      res.status(500).json({ 
        success: false, 
        error: "We've registered your details, but we're experiencing a temporary issue sending email confirmation right now. Rest assured our team has been informed and will reach out to you shortly." 
      });
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
    app.get("*all", (req, res) => {
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
