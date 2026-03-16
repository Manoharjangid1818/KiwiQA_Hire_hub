import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Force load from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Email configuration from environment variables
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "KiwiQA <noreply@kiwiqa.com>";

// Log SMTP configuration status (without exposing credentials)
console.log("=== Email Configuration ===");
console.log(`SMTP Host: ${smtpHost}`);
console.log(`SMTP Port: ${smtpPort}`);
console.log(`SMTP User: ${smtpUser ? "✓ Set" : "✗ Not Set"}`);
console.log(`SMTP Pass: ${smtpPass ? "✓ Set" : "✗ Not Set"}`);
console.log(`SMTP From: ${smtpFrom}`);
console.log("============================");

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    // Do not fail on invalid certificates
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    const errorCode = (error as any).code || 'UNKNOWN';
    console.error("=== SMTP Connection Error ===");
    console.error("Failed to connect to SMTP server:");
    console.error("  Host:", smtpHost);
    console.error("  Port:", smtpPort);
    console.error("  User:", smtpUser ? "✓ Set" : "✗ Not Set");
    console.error("  Error Message:", error.message);
    console.error("  Error Code:", errorCode);
    console.error("================================");
    
    // Provide helpful troubleshooting tips
    if (errorCode === 'EAUTH') {
      console.error("⚠️  Authentication failed! Possible causes:");
      console.error("   - Invalid username or password");
      console.error("   - For Gmail: Need an App Password, not your regular password");
      console.error("   - Go to: Google Account → Security → 2-Step Verification → App Passwords");
    } else if (errorCode === 'ECONNREFUSED') {
      console.error("⚠️  Connection refused! Possible causes:");
      console.error("   - Wrong SMTP host or port");
      console.error("   - Firewall blocking the connection");
    } else if (errorCode === 'ETIMEDOUT') {
      console.error("⚠️  Connection timed out! Possible causes:");
      console.error("   - Slow network connection");
      console.error("   - Wrong SMTP host");
    }
    console.error("================================");
  } else {
    console.log("=== SMTP Connected Successfully ===");
    console.log("Email service is ready to send messages");
    console.log("======================================");
  }
});

/**
 * Send OTP verification email
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @param fullName - User's full name (optional)
 */
export async function sendOtpEmail(
  email: string, 
  otp: string, 
  fullName?: string
): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!smtpUser || !smtpPass) {
      console.log("SMTP not configured. Email will not be sent.");
      console.log("Please configure SMTP environment variables:");
      console.log("  - SMTP_USER");
      console.log("  - SMTP_PASS");
      console.log("  - SMTP_HOST (optional, defaults to smtp.gmail.com)");
      console.log("  - SMTP_PORT (optional, defaults to 587)");
      console.log("  - SMTP_FROM (optional)");
      return false;
    }

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: "KiwiQA - Email Verification OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">KiwiQA</h1>
            <p style="color: #e0e0e0; text-align: center; margin-top: 10px;">Online Examination Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
            
            <p>Hello${fullName ? ` ${fullName}` : ""},</p>
            
            <p>Thank you for registering with KiwiQA. Please use the following verification code to verify your email address:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #667eea;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Note:</strong> This OTP is valid for 5 minutes. Please don't share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't create an account with KiwiQA, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} KiwiQA. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `Hello${fullName ? ` ${fullName}` : ""},\n\nYour KiwiQA verification code is: ${otp}\n\nThis code is valid for 5 minutes.\n\nIf you didn't create an account, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("❌ Error sending email:");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code);
    console.error("   Response:", error.response?.body?.error || error.response || "N/A");
    
    // Provide specific guidance based on error
    if (error.code === 'EAUTH' || error.message?.includes('Invalid login')) {
      console.error("   → Authentication failed! The App Password may be invalid.");
      console.error("   → Generate a new App Password at: Google Account → Security → 2-Step Verification → App Passwords");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("   → Connection refused. Check SMTP host and port.");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("   → Connection timed out. Check network/firewall.");
    }
    
    return false;
  }
}

/**
 * Check if SMTP is configured
 */
export function isEmailConfigured(): boolean {
  return !!(smtpUser && smtpPass);
}

/**
 * Send password reset OTP email
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @param fullName - User's full name (optional)
 */
export async function sendPasswordResetEmail(
  email: string, 
  otp: string, 
  fullName?: string
): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!smtpUser || !smtpPass) {
      console.log("SMTP not configured. Email will not be sent.");
      console.log("Please configure SMTP environment variables:");
      console.log("  - SMTP_USER");
      console.log("  - SMTP_PASS");
      console.log("  - SMTP_HOST (optional, defaults to smtp.gmail.com)");
      console.log("  - SMTP_PORT (optional, defaults to 587)");
      console.log("  - SMTP_FROM (optional)");
      return false;
    }

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: "KiwiQA - Password Reset OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">KiwiQA</h1>
            <p style="color: #e0e0e0; text-align: center; margin-top: 10px;">Online Examination Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hello${fullName ? ` ${fullName}` : ""},</p>
            
            <p>We received a request to reset your password. Please use the following OTP code to reset your password:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #667eea;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Note:</strong> This OTP is valid for 10 minutes. Please don't share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} KiwiQA. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `Hello${fullName ? ` ${fullName}` : ""},\n\nYour KiwiQA password reset OTP is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("❌ Error sending password reset email:");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code);
    console.error("   Response:", error.response?.body?.error || error.response || "N/A");
    return false;
  }
}
