const nodemailer = require("nodemailer");

const sendResetEmail = async ({ to, resetUrl }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Kionyx" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: "Password Reset Request",
    html: `
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 15min.</p>
  
    <p>Best regards,</p>
      <p>Support Team</p>
   <p><img src="https://res.cloudinary.com/dj0qzdrqv/image/upload/v1746068334/KIONYX_Logo_Design_Concept_2_c5mgni.jpg" alt="Company Logo" width="150" /></p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = sendResetEmail;
