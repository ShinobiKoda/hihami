import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function baseEmailHtml({
  title,
  preheader,
  contentHtml,
}: {
  title: string;
  preheader?: string;
  contentHtml: string;
}) {
  const safePreheader = preheader || "";
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        /* Tailored inline-safe styles for email clients */
        .container { max-width: 560px; margin: 0 auto; background: #0f0c12; color: #eae0ef; border-radius: 12px; border: 1px solid #2a1630; }
        .header { padding: 28px 28px 8px 28px; text-align: center; }
        .brand { font-family: Arial, Helvetica, sans-serif; font-size: 22px; letter-spacing: 0.5px; font-weight: 800; color: #ffffff; }
        .divider { height: 1px; background: linear-gradient(90deg, #3b0a40, #ad1aaf, #3b0a40); border: none; margin: 0; }
        .section { padding: 24px 28px; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; }
        .title { font-size: 20px; margin: 0 0 8px 0; color: #ffffff; }
        .muted { color: #bfa8c7; font-size: 14px; margin: 0 0 16px 0; }
        .code { font-size: 28px; letter-spacing: 6px; font-weight: 700; font-family: "Courier New", Courier, monospace; background: #1b1320; color: #ffffff; padding: 14px 18px; border: 1px solid #3d1a44; border-radius: 10px; text-align: center; display: block; }
        .button { display: inline-block; background: #ad1aaf; color: #ffffff !important; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }
        .foot { font-size: 12px; color: #a48ea9; }
        .space { height: 8px; }
      </style>
    </head>
    <body style="margin:0; padding:24px; background:#0b0810;">
      <span style="display:none; color:transparent; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden;">${safePreheader}</span>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
        <tr>
          <td>
            <div class="container">
              <div class="header">
                <div class="brand">HIHAMI</div>
              </div>
              <hr class="divider" />
              <div class="section">
                ${contentHtml}
                <div class="space"></div>
                <p class="foot">If you didn’t request this, you can safely ignore this email.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export async function sendOtpEmail(to: string, otp: string) {
  const subject = "Your HIHAMI verification code";
  const html = baseEmailHtml({
    title: subject,
    preheader: `Use this code to verify your email. It expires in 10 minutes`,
    contentHtml: `
      <h1 class="title">Verify your email</h1>
      <p class="muted">Use the code below to complete your sign in. This code expires in 10 minutes.</p>
      <span class="code">${otp}</span>
      <div class="space"></div>
      <p class="muted">For your security, never share this code with anyone.</p>
    `,
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: `Your HIHAMI verification code is ${otp}. It expires in 10 minutes.`,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}

export async function sendNewsletterWelcomeEmail(to: string) {
  const subject = "Welcome to HIHAMI — You’re subscribed";
  const html = baseEmailHtml({
    title: subject,
    preheader:
      "Thanks for joining the HIHAMI newsletter. Here’s what to expect.",
    contentHtml: `
      <h1 class="title">Thank you for subscribing</h1>
      <p class="muted">You’re now part of the HIHAMI community. You’ll receive occasional updates on new drops, product improvements, and curated insights from the NFT space. No spam — unsubscribe anytime.</p>
      <div class="space"></div>
      <a class="button" href="https://hihami.vercel.app" target="_blank" rel="noreferrer">Visit HIHAMI</a>
    `,
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: "Thanks for subscribing to HIHAMI. You’ll receive updates on new drops and product news.",
      html,
    });
    console.log("✅ Newsletter welcome sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Newsletter welcome send failed:", err);
    throw err;
  }
}
