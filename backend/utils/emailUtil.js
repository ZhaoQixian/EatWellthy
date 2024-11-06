const SibApiV3Sdk = require("@sendinblue/client");
require("dotenv").config();

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Function to send a verification email
const sendVerificationEmail = async (email, verificationCode) => {
  const sender = {
    email: "zqx2467027771@gmail.com", // Replace with your verified sender email
    name: "EatWellthy",
  };

  const receivers = [{ email: email }];

  const emailContent = {
    sender,
    to: receivers,
    subject: "Your EatWellthy Verification Code",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2C3E50;">Welcome to EatWellthy!</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; color: #2C3E50;">
                ${verificationCode}
              </div>
            </div>
            <p>Enter this code on the verification page to complete your registration.</p>
            <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #2C3E50; margin: 20px 0;">
              <p style="margin: 0;"><strong>Important:</strong></p>
              <ul style="margin: 10px 0;">
                <li>This code will expire in 24 hours</li>
                <li>Never share this code with anyone</li>
                <li>Our team will never ask for this code</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't create an account with EatWellthy, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const data = await apiInstance.sendTransacEmail(emailContent);
    console.log("Verification code sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

// Function to send a forgot password email
const sendForgotPasswordEmail = async (email, temporaryPassword) => {
  const sender = {
    email: "zqx2467027771@gmail.com", // Replace with your verified sender email
    name: "EatWellthy",
  };

  const receivers = [{ email: email }];

  const emailContent = {
    sender,
    to: receivers,
    subject: "Your EatWellthy Temporary Password",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2C3E50;">Password Reset Request</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">Your temporary password is:</p>
              <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #2C3E50;">
                ${temporaryPassword}
              </div>
            </div>
            <p>Please use this temporary password to log in. Once logged in, make sure to change your password immediately from your Profile settings.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't request a password reset, please contact our support immediately.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const data = await apiInstance.sendTransacEmail(emailContent);
    console.log("Temporary password sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = { sendVerificationEmail, sendForgotPasswordEmail };
