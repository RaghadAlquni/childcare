const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true", // false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html
  });
  return info;
}

module.exports = sendEmail;