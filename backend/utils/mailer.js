const nodemailer = require("nodemailer");

async function sendMail({ to, subject, html, text }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
