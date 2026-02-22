import nodemailer from "nodemailer";

// ─── Transporter ──────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface OtpEmailOptions {
  to: string;
  name: string;
  otp: string;
}

interface ResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

// ─── OTP Email ────────────────────────────────────────────────────────────────

export async function sendOtpEmail({ to, name, otp }: OtpEmailOptions) {
  const digits = otp.split("");

  await transporter.sendMail({
    from: `"Belilar" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Belilar Verification Code",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Verify Your Email</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                  <!-- Header -->
                  <tr>
                    <td style="background:#16a34a;padding:32px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Belilar</h1>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:32px 40px;text-align:center;">
                      <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Verify Your Email</h2>
                      <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.6;">
                        Hi ${name}, enter the 6-digit code below to verify your Belilar account.
                      </p>

                      <!-- OTP digits -->
                      <div style="display:inline-flex;gap:8px;margin-bottom:28px;">
                        ${digits
                          .map(
                            (d) => `
                          <div style="width:44px;height:52px;background:#f0fdf4;border:2px solid #16a34a;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                            <span style="font-size:24px;font-weight:800;color:#15803d;line-height:52px;display:block;text-align:center;">${d}</span>
                          </div>`,
                          )
                          .join("")}
                      </div>

                      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">
                        This code expires in <strong>15 minutes</strong>.
                      </p>
                      <p style="margin:0;color:#d1d5db;font-size:12px;">
                        If you didn't create a Belilar account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:16px 40px 32px;border-top:1px solid #f3f4f6;">
                      <p style="margin:0;color:#d1d5db;font-size:11px;text-align:center;">
                        © ${new Date().getFullYear()} Belilar. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

// ─── Reset Password Email ─────────────────────────────────────────────────────

export async function sendResetEmail({
  to,
  name,
  resetUrl,
}: ResetEmailOptions) {
  await transporter.sendMail({
    from: `"Belilar" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Belilar Password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;">
                  <tr>
                    <td style="background:#16a34a;padding:32px;text-align:center;">
                      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">Belilar</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 40px;">
                      <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Reset Your Password</h2>
                      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                        Hi ${name}, click the button below to reset your password.
                      </p>
                      <a href="${resetUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
                        Reset Password
                      </a>
                      <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">
                        This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 40px 32px;border-top:1px solid #f3f4f6;">
                      <p style="margin:0;color:#d1d5db;font-size:11px;text-align:center;">© ${new Date().getFullYear()} Belilar.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
