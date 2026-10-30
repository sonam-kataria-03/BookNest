const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter dynamically based on environment variables.
 * Supports Gmail or any custom SMTP server.
 */
const createTransporter = async () => {
  const { EMAIL_SERVICE, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS } = process.env;

  const isConfigured =
    EMAIL_USER &&
    EMAIL_PASS &&
    !EMAIL_USER.includes('your-email') &&
    !EMAIL_PASS.includes('your-google');

  if (isConfigured) {
    if (EMAIL_SERVICE && EMAIL_SERVICE.toLowerCase() === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER.trim(),
          pass: EMAIL_PASS.trim(),
        },
      });
    }

    return nodemailer.createTransport({
      host: EMAIL_HOST || 'smtp.gmail.com',
      port: Number(EMAIL_PORT) || 587,
      secure: EMAIL_SECURE === 'true' || Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER.trim(),
        pass: EMAIL_PASS.trim(),
      },
    });
  }

  // Fallback for development if no SMTP credentials are provided
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('[BookNest Mailer] No SMTP credentials in .env. Using Ethereal test account.');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('[BookNest Mailer] Could not create test account:', err.message);
    return null;
  }
};

/**
 * Send Password Reset OTP email
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit numeric OTP
 * @param {string} [recipientName] - Optional name of recipient
 */
const sendPasswordResetOtpEmail = async (to, otp, recipientName = 'Reader') => {
  const isCustomUser = process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your-email');
  const from =
    process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('your-email')
      ? process.env.EMAIL_FROM
      : isCustomUser
      ? `"BookNest Sanctuary" <${process.env.EMAIL_USER.trim()}>`
      : '"BookNest Sanctuary" <noreply@booknest.com>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 24px; color: #12201D; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 18px; border: 1px solid #E3EAE7; overflow: hidden; box-shadow: 0 10px 25px -4px rgba(12, 36, 31, 0.08); }
          .header { background: linear-gradient(145deg, #071714 0%, #0F2D27 50%, #174238 100%); padding: 36px 32px; text-align: center; color: #ffffff; }
          .brand-title { font-size: 26px; font-weight: 700; letter-spacing: 0.5px; margin: 0; color: #FCE6AD; font-family: 'Playfair Display', Georgia, serif; }
          .brand-subtitle { font-size: 13px; color: #71BFAD; margin-top: 6px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
          .body { padding: 36px 32px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #0C241F; }
          .text { font-size: 15px; line-height: 1.6; color: #4E635E; margin-bottom: 24px; }
          .otp-box { background: #F2F8F6; border: 2px dashed #318371; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0; }
          .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #256758; margin-bottom: 8px; }
          .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0C241F; font-family: monospace; }
          .badge { display: inline-block; background: #FEF7E6; border: 1px solid #FAD277; color: #B87C17; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; margin-top: 10px; }
          .footer { background: #F6F8F7; padding: 20px 32px; text-align: center; font-size: 12px; color: #7E938E; border-top: 1px solid #EDF3F1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">BookNest</h1>
            <div class="brand-subtitle">Your Sanctuary for Stories</div>
          </div>
          <div class="body">
            <div class="greeting">Hello ${recipientName || 'Reader'},</div>
            <p class="text">
              We received a request to reset your password for your BookNest account. Use the one-time verification code (OTP) below to proceed with resetting your password:
            </p>
            <div class="otp-box">
              <div class="otp-label">Verification Code (OTP)</div>
              <div class="otp-code">${otp}</div>
              <div class="badge">⏳ Valid for 10 minutes</div>
            </div>
            <p class="text" style="font-size: 13px; color: #7E938E;">
              For security, please never share this verification code with anyone. BookNest staff will never ask for your code. If you did not initiate this request, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} BookNest Sanctuary. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  // Always log to server terminal for instant debugging
  console.log('\n======================================================');
  console.log(`[BookNest OTP Mailer]`);
  console.log(`Recipient: ${to}`);
  console.log(`From: ${from}`);
  console.log(`Verification Code (OTP): >>> ${otp} <<<`);
  console.log(`Valid for 10 minutes`);
  console.log('======================================================\n');

  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.warn('[BookNest Mailer] No email transporter available. OTP logged above.');
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject: `Your BookNest Password Reset Code: ${otp}`,
      text: `Your BookNest password reset code is: ${otp}. It expires in 10 minutes. If you did not request this, please ignore this email.`,
      html: htmlContent,
    });

    console.log('[BookNest Mailer] Email sent successfully to', to, '| Message ID:', info.messageId);

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('[BookNest Mailer] Ethereal Preview URL:', preview);
    }

    return { success: true, messageId: info.messageId, previewUrl: preview || null };
  } catch (err) {
    console.error('[BookNest Mailer] Error sending email via Nodemailer:', err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
};

module.exports = {
  sendPasswordResetOtpEmail,
};
