const nodemailer = require("nodemailer");

async function sendVerificationMail(to, verificationLink, username) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL_ADDRESS,
      pass: process.env.NODEMAILER_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL_ADDRESS,
    to,
    subject: "Teapot - email verification",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #31c48d; text-align: center;">Welcome, ${username}!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${verificationLink}" style="background-color: #31c48d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #777;">
            If the button above doesn't work, you can also copy and paste the following link into your browser:
            <br>
            <a href="${verificationLink}">${verificationLink}</a>
          </p>
          <p style="font-size: 14px; color: #777;">
            If you did not register for an account, please disregard this email.
          </p>
        </div>
      `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendVerificationMail };
