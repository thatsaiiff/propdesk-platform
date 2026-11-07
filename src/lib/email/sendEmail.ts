import nodemailer from "nodemailer";
import { Resend } from "resend";

export interface SendOtpEmailParams {
  toEmail: string;
  code: string;
  isNewUser: boolean;
}

export async function sendOtpEmail({
  toEmail,
  code,
  isNewUser,
}: SendOtpEmailParams): Promise<{ success: boolean; liveDispatched: boolean; error?: string }> {
  const fromEmail = process.env.EMAIL_FROM || "PropDesk <onboarding@resend.dev>";
  const subject = `Your PropDesk Verification Code: ${code}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060911; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #0c1220; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; }
          .logo { font-size: 20px; font-weight: 700; color: #fbbf24; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
          .headline { font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 12px; }
          .desc { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
          .code-box { background: rgba(30, 58, 138, 0.4); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 28px; }
          .code { font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #60a5fa; }
          .footer { font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">PropDesk Discovery</div>
          <div class="headline">${isNewUser ? "Welcome to PropDesk" : "Sign in to PropDesk"}</div>
          <div class="desc">
            Use the following 6-digit verification code to authenticate your session. This code will expire in <strong>10 minutes</strong>.
          </div>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <div class="footer">
            If you did not request this verification code, please ignore this email.<br/>
            PropDesk Real Estate Platform • Strict Discretion & Verified Opportunities
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `Your PropDesk Verification Code: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`;

  // 1. Try Resend if RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const resendResult = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject,
        html: htmlBody,
        text: textBody,
      });
      if (resendResult.error) {
        console.error("[RESEND ERROR] Failed to send email via Resend:", resendResult.error);
        return { success: false, liveDispatched: false, error: resendResult.error.message };
      }
      console.log(`[EMAIL DISPATCH] Sent OTP to ${toEmail} via Resend. ID: ${resendResult.data?.id}`);
      return { success: true, liveDispatched: true };
    } catch (err: any) {
      console.error("[RESEND ERROR] Failed to send email via Resend:", err?.message || err);
      return { success: false, liveDispatched: false, error: err?.message };
    }
  }

  // 2. Try SMTP if SMTP_HOST is available
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject,
        html: htmlBody,
        text: textBody,
      });

      console.log(`[EMAIL DISPATCH] Sent OTP to ${toEmail} via SMTP.`);
      return { success: true, liveDispatched: true };
    } catch (err: any) {
      console.error("[SMTP ERROR] Failed to send email via SMTP:", err?.message || err);
      return { success: false, liveDispatched: false, error: err?.message };
    }
  }

  // 3. Fallback: Log to server stdout (when credentials not yet supplied in env)
  console.log(`
============================================================
[EMAIL OTP DISPATCH]
To:       ${toEmail}
Subject:  ${subject}
Code:     ${code}
Mode:     Sandbox / Standalone Dispatch (Configure RESEND_API_KEY or SMTP_* for direct mail delivery)
============================================================
  `);

  return { success: true, liveDispatched: false };
}
