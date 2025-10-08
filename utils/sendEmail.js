const nodemailer = require("nodemailer");

// create transporter once (reused)
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendMail(options = {}) {
  if (!options) throw new Error("No mail options provided");

  let mailOptions = {
    from: options.from || `"Kionyx" <${process.env.EMAIL_USERNAME}>`,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject || "",
    text: options.text,
    html: options.html,
    attachments: options.attachments,
    replyTo: options.replyTo,
  };

  // Remove undefined keys so nodemailer doesn't receive undefined values
  Object.keys(mailOptions).forEach((k) => {
    if (mailOptions[k] === undefined) delete mailOptions[k];
  });

  // Validate required fields: at minimum we need a recipient and body
  if (!mailOptions.to || (!mailOptions.html && !mailOptions.text)) {
    console.error("sendMail: missing required mail fields", {
      to: mailOptions.to,
      hasHtml: !!mailOptions.html,
      hasText: !!mailOptions.text,
      providedOptions: options,
    });
    throw new Error(
      "Missing required mail fields: 'to' and ('html' or 'text')"
    );
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Failed to send email");
  }
}

module.exports = sendMail;
