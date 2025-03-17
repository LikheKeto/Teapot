const nodemailer = require("nodemailer");

async function sendVerificationMail(to, verificationLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service
      auth: {
        user: process.env.NODEMAILER_EMAIL_ADDRESS, // Your Gmail email address
        pass: process.env.NODEMAILER_APP_PASSWORD, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL_ADDRESS, // Your Gmail email address
      to,
      subject: "Verify your email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = { sendVerificationMail };
