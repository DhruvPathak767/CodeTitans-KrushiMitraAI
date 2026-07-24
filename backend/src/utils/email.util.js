import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

/**
 * Generate a random 6-digit numeric OTP string
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create Nodemailer transporter with robust Gmail / SMTP support
 */
const createTransporter = () => {
  const rawUser = process.env.SMTP_USERNAME || process.env.EMAIL_USER || '';
  const rawPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || '';

  // Clean quotes and whitespace
  const emailUser = rawUser.trim().replace(/^["']|["']$/g, '');
  const emailPass = rawPass.trim().replace(/^["']|["']$/g, '');

  if (!emailUser || !emailPass) {
    return null;
  }

  // Use Nodemailer gmail service for reliable delivery
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Send OTP Verification Email
 */
export const sendOtpEmail = async (toEmail, otp, purpose = 'Verification Code') => {
  const transporter = createTransporter();

  const rawFrom = process.env.FROM_EMAIL || process.env.SMTP_USERNAME || process.env.EMAIL_USER || 'aicodelens@gmail.com';
  const fromAddress = rawFrom.trim().replace(/^["']|["']$/g, '');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>KrishiMitra AI</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); color: #ffffff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 30px; color: #2d3748; line-height: 1.6; }
        .otp-box { background-color: #e8f5e9; border: 2px dashed #4caf50; border-radius: 10px; text-align: center; padding: 20px; margin: 25px 0; }
        .otp-code { font-size: 38px; font-weight: 800; color: #1b4332; letter-spacing: 8px; margin: 0; }
        .expiry { font-size: 13px; color: #e53935; margin-top: 10px; font-weight: 600; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 KrishiMitra AI</h1>
        </div>
        <div class="content">
          <h2>Your ${purpose}</h2>
          <p>Hello,</p>
          <p>Thank you for using KrishiMitra AI. Please use the verification code below to proceed with your request:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry">⏰ Code expires in 10 minutes</div>
          </div>
          <p>If you did not request this code, please ignore this message.</p>
          <p>Best regards,<br><strong>KrishiMitra AI Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} KrishiMitra AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    logger.warn(`SMTP credentials not configured in .env. OTP for ${toEmail} is: [ ${otp} ]`);
    return { success: true, mocked: true, otp };
  }

  try {
    const info = await transporter.sendMail({
      from: `"KrishiMitra AI" <${fromAddress}>`,
      to: toEmail,
      subject: `KrishiMitra AI ${purpose}`,
      html: htmlContent,
    });
    logger.info(`OTP Email sent successfully to ${toEmail} [MessageId: ${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Error sending email to ${toEmail}: ${error.message}`);
    logger.warn(`Fallback OTP for ${toEmail} is: [ ${otp} ]`);
    return { success: false, error: error.message, fallbackOtp: otp };
  }
};
