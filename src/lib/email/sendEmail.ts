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
  let fromEmail = (process.env.EMAIL_FROM || "PropDesk <onboarding@resend.dev>").trim();
  if (fromEmail === "[SENSITIVE]" || !fromEmail) {
    fromEmail = "PropDesk <onboarding@resend.dev>";
  }
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

  // 1. Try Gmail / Custom SMTP first (Primary: delivers to any email address globally)
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (smtpUser && smtpPass && smtpUser !== "[SENSITIVE]" && smtpPass !== "[SENSITIVE]") {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `PropDesk Discovery <${smtpUser}>`,
        to: toEmail,
        subject,
        html: htmlBody,
        text: textBody,
      });

      console.log(`[EMAIL DISPATCH] Sent OTP to ${toEmail} via Gmail SMTP. MessageId: ${info.messageId}`);
      return { success: true, liveDispatched: true };
    } catch (err: any) {
      console.error("[SMTP ERROR] Failed to send email via SMTP:", err?.message || err);
      // Fall through to Resend if SMTP fails
    }
  }

  // 2. Try Resend as secondary provider
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (resendApiKey && resendApiKey !== "[SENSITIVE]") {
    try {
      const resend = new Resend(resendApiKey);
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
      return { success: false, liveDispatched: false, error: err?.message || "Resend connection error" };
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
