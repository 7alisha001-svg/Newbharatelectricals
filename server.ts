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

  // API Route: Send Email Notification for New Lead Capture
  app.post("/api/leads/notify", async (req, res) => {
    const { name, phone, email, city, interestedIn } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({ error: "Missing required lead fields" });
    }

    try {
      const transporter = await getEmailTransporter();
      const adminEmail = process.env.ADMIN_EMAIL || "info@newbharatelectricals.com";
      const nowString = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      // 1. Email to website administrator
      const adminMailOptions = {
        from: '"New Bharat Lead Capture" <info@newbharatelectricals.com>',
        to: adminEmail,
        subject: `⚡ [NEW LEAD] Consultation Request: ${name} (${interestedIn})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #059669; padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">New Lead Captured!</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">First-Time Visitor Consultation Request</p>
            </div>
            <div style="padding: 24px; background-color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563; width: 150px;">Full Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Mobile Number</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="tel:${phone}" style="color: #059669; font-weight: bold; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Email Address</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${email !== "N/A" ? `<a href="mailto:${email}" style="color: #059669; text-decoration: none;">${email}</a>` : "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">City / Location</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: 500;">${city}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Product Segment</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #ffffff;"><span style="background-color: #059669; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${interestedIn}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Logged At</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">${nowString}</td>
                </tr>
              </table>
              
              <div style="text-align: center; margin-top: 10px;">
                <a href="tel:${phone}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; box-shadow: 0 2px 4px rgba(5,150,105,0.2);">Call Lead Now</a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
              New Bharat Electricals Lead Management System
            </div>
          </div>
        `
      };

      const infoAdmin = await transporter.sendMail(adminMailOptions);
      if (transporter.isTest) {
        console.log(`[SMTP-TEST] Admin Email Sent. Inspect here: ${nodemailer.getTestMessageUrl(infoAdmin)}`);
      }

      // 2. Email confirmation to customer (if email is provided)
      if (email && email !== "N/A" && email.includes("@")) {
        const customerMailOptions = {
          from: '"New Bharat Electricals" <info@newbharatelectricals.com>',
          to: email,
          subject: "Thank You for Contacting New Bharat Electricals!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #ea580c; padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Consultation Confirmed!</h2>
                <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">We have received your request successfully</p>
              </div>
              <div style="padding: 24px; background-color: #ffffff; color: #374151;">
                <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Dear ${name},</p>
                <p style="line-height: 1.6;">Thank you for requesting a free expert consultation with New Bharat Electricals. We are excited to help you find the absolute best solar, inverter, or battery setup matching your power requirements.</p>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #f3f4f6;">
                  <h4 style="margin: 0 0 8px 0; color: #ea580c; font-size: 14px; font-weight: bold; uppercase;">Your Request Details</h4>
                  <p style="margin: 4px 0; font-size: 13px;"><b>Interested In:</b> ${interestedIn}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><b>Contact Phone:</b> ${phone}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><b>Preferred City:</b> ${city}</p>
                </div>

                <p style="line-height: 1.6;">One of our dedicated power engineers will call you shortly on <b>${phone}</b> to discuss custom options and special project discounts.</p>
                
                <p style="margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                  Best regards,<br>
                  <b>The Solar & Power Team</b><br>
                  New Bharat Electricals
                </p>
              </div>
              <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                This is an automated confirmation email. Please do not reply directly to this address.
              </div>
            </div>
          `
        };

        const infoCustomer = await transporter.sendMail(customerMailOptions);
        if (transporter.isTest) {
          console.log(`[SMTP-TEST] Customer Confirmation Sent. Inspect here: ${nodemailer.getTestMessageUrl(infoCustomer)}`);
        }
      }

      res.status(200).json({ success: true, message: "Lead submitted and notifications dispatched successfully" });

    } catch (err: any) {
      console.error("[SMTP-ERROR] Error sending lead notification emails:", err);
      // Still return 200/success to the client because the database entry is already saved
      res.status(200).json({ success: true, error: "Lead stored but notification email failed to send" });
    }
  });

  // API Route: Send Email Notification for Inquiries
  app.post("/api/inquiries/notify", async (req, res) => {
    const { name, phone, email, inquiryType, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    try {
      const transporter = await getEmailTransporter();
      const adminEmail = process.env.ADMIN_EMAIL || "info@newbharatelectricals.com";
      const nowString = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      const adminMailOptions = {
        from: '"New Bharat Inquiries" <info@newbharatelectricals.com>',
        to: adminEmail,
        subject: `📩 [NEW INQUIRY] ${inquiryType || 'General'}: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #059669; padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">New Inquiry Received!</h2>
            </div>
            <div style="padding: 24px; background-color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; width: 150px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${name}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${phone}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${email || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Type</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${inquiryType || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Message</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${message || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Logged At</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${nowString}</td></tr>
              </table>
            </div>
          </div>
        `
      };

      await transporter.sendMail(adminMailOptions);

      if (email && email !== "N/A" && email.includes("@")) {
        const customerMailOptions = {
          from: '"New Bharat Electricals" <info@newbharatelectricals.com>',
          to: email,
          subject: "Thank You for Contacting New Bharat Electricals!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #ea580c; padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Inquiry Received!</h2>
              </div>
              <div style="padding: 24px; background-color: #ffffff; color: #374151;">
                <p>Dear ${name},</p>
                <p>Thank you for contacting New Bharat Electricals. We have received your inquiry.</p>
                <p>One of our representatives will contact you shortly.</p>
                <p>Best regards,<br><b>New Bharat Electricals</b></p>
              </div>
            </div>
          `
        };
        await transporter.sendMail(customerMailOptions);
      }

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
