import UserData from "../model/user_data";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await UserData.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists or not
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set token expiration (10 minutes from now)
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save reset token to user
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL

    const getBaseUrl = (req) => {
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    const protocol = req?.headers["x-forwarded-proto"] || "http";
    const host = req?.headers.host || "localhost:3000";
    return `${protocol}://${host}`;
    };

    // Inside your API route:
    const baseUrl = getBaseUrl(req);
    const resetURL = `${baseUrl}/reset-password?token=${resetToken}`;
    // const resetURL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Always log the reset URL to console for development
    console.log("=== PASSWORD RESET REQUEST ===");
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetURL}`);
    console.log(`Token expires in: 10 minutes`);
    console.log("==============================");

    // Try to send email using Mailgun
    try {
      // Check if Mailgun configuration is present
      if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
        console.log("🚀 Using Mailgun to send email...");

        const mailgunData = {
          from: process.env.EMAIL_FROM || 'noreply@employeems.com',
          to: email,
          subject: 'Password Reset Request - Employee Management System',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin-bottom: 10px;">Employee Management System</h1>
                <h2 style="color: #007bff; margin-top: 0;">Password Reset Request</h2>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0; font-size: 16px;">Hello,</p>
                <p style="margin: 0 0 15px 0;">You requested a password reset for your Employee Management System account.</p>
                <p style="margin: 0;">Click the button below to reset your password:</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetURL}" 
                   style="background-color: #007bff; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;
                          font-weight: bold; font-size: 16px;">
                  Reset My Password
                </a>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-weight: bold;">⏰ Important:</p>
                <p style="margin: 5px 0 0 0; color: #856404;">This link will expire in 10 minutes for security reasons.</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Or copy and paste this link:</p>
                <p style="word-break: break-all; color: #007bff; margin: 0; font-family: monospace; font-size: 14px;">${resetURL}</p>
              </div>
              
              <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; color: #6c757d;">If you didn't request this password reset, please ignore this email.</p>
                <p style="margin: 0; color: #6c757d; font-size: 12px;">
                  This is an automated message from Employee Management System. Please do not reply to this email.
                </p>
              </div>
            </div>
          `
        };

        // Send email using Mailgun API
        const formData = new URLSearchParams();
        Object.keys(mailgunData).forEach(key => {
          formData.append(key, mailgunData[key]);
        });

        const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Email sent successfully via Mailgun!");
          console.log("Message ID:", result.id);
          
          return res.status(200).json({ 
            message: "Password reset link sent to your email!" 
          });
        } else {
          const errorData = await response.json();
          console.error("Mailgun API error:", errorData);
          throw new Error(`Mailgun API error: ${errorData.message}`);
        }
        
      } else {
        console.log("Mailgun configuration incomplete - using console mode");
        return res.status(200).json({ 
          message: "Password reset link generated! Check the server console for the reset URL (Development Mode)" 
        });
      }
      
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      console.log("But don't worry - the reset URL is logged above for testing");

      // Don't clear the token - still allow console-based reset
      return res.status(200).json({ 
        message: "Password reset link generated! Check the server console for the reset URL (Email service temporarily unavailable)" 
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ 
      message: "Server error. Please try again later." 
    });
  }
};