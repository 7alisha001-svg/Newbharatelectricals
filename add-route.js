const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const routeCode = `
  // API Route: Send Email Notification for Inquiries (Contact & Quote Forms)
  app.post("/api/inquiries/notify", async (req, res) => {
    const { name, phone, email, inquiryType, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    try {
      const transporter = await getEmailTransporter();
      const adminEmail = process.env.ADMIN_EMAIL || "info@newbharatelectricals.com";
      const nowString = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      // 1. Email to website administrator
      const adminMailOptions = {
        from: '"New Bharat Inquiries" <info@newbharatelectricals.com>',
        to: adminEmail,
        subject: \`📩 [NEW INQUIRY] \${inquiryType || 'General'}: \${name}\`,
        html: \`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #059669; padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">New Inquiry Received!</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Via Contact/Quote Form</p>
            </div>
            <div style="padding: 24px; background-color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563; width: 150px;">Full Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold;">\${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Mobile Number</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="tel:\${phone}" style="color: #059669; font-weight: bold; text-decoration: none;">\${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Email Address</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">\${email && email !== "N/A" ? \`<a href="mailto:\${email}" style="color: #059669; text-decoration: none;">\${email}</a>\` : "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Inquiry Type</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #ffffff;"><span style="background-color: #059669; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">\${inquiryType || 'General'}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Message</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">\${message || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #4b5563;">Logged At</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">\${nowString}</td>
                </tr>
              </table>
              <div style="text-align: center; margin-top: 10px;">
                <a href="tel:\${phone}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; box-shadow: 0 2px 4px rgba(5,150,105,0.2);">Call Lead Now</a>
              </div>
            </div>
          </div>
        \`
      };

      const infoAdmin = await transporter.sendMail(adminMailOptions);
      if (transporter.isTest) {
        console.log(\`[SMTP-TEST] Admin Email Sent. Inspect here: \${nodemailer.getTestMessageUrl(infoAdmin)}\`);
      }

      // 2. Email confirmation to customer (if email is provided)
      if (email && email !== "N/A" && email.includes("@")) {
        const customerMailOptions = {
          from: '"New Bharat Electricals" <info@newbharatelectricals.com>',
          to: email,
          subject: "Thank You for Contacting New Bharat Electricals!",
          html: \`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #ea580c; padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Inquiry Received!</h2>
                <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">We have received your message successfully</p>
              </div>
              <div style="padding: 24px; background-color: #ffffff; color: #374151;">
                <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Dear \${name},</p>
                <p style="line-height: 1.6;">Thank you for contacting New Bharat Electricals. We have received your inquiry regarding <b>\${inquiryType || 'our products'}</b>.</p>
                <p style="line-height: 1.6;">One of our representatives will contact you shortly.</p>
                <p style="margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                  Best regards,<br>
                  <b>The Sales Team</b><br>
                  New Bharat Electricals
                </p>
              </div>
            </div>
          \`
        };
        const infoCustomer = await transporter.sendMail(customerMailOptions);
        if (transporter.isTest) {
          console.log(\`[SMTP-TEST] Customer Confirmation Sent. Inspect here: \${nodemailer.getTestMessageUrl(infoCustomer)}\`);
        }
      }

      res.status(200).json({ success: true, message: "Inquiry notification dispatched successfully" });
    } catch (err: any) {
      console.error("[SMTP-ERROR] Error sending inquiry notification emails:", err);
      res.status(200).json({ success: true, error: "Inquiry stored but notification email failed to send" });
    }
  });

`;

code = code.replace('// Vite middleware or static serving', routeCode + '\n  // Vite middleware or static serving');
fs.writeFileSync('server.ts', code);
