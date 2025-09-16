const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./database/.env" });

exports.inviteUser = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Email is required" });

  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://192.168.12.224:3000" ;
    const inviteLink = `${FRONTEND_URL}/register?email=${encodeURIComponent(
      email
    )}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Task Master" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're invited to Task Master",
      html: `
        <p>Hello,</p>
        <p>You have been invited to join Task Master. Click the link below to register:</p>
        <a href="${inviteLink}" target="_blank">${inviteLink}</a>
        <p>If you did not expect this email, please ignore it.</p>
      `,
    });

    res.json({ message: "Invitation email sent successfully", inviteLink });
  } catch (err) {
    console.error("Invite Error:", err);
    res.status(500).json({ message: "Failed to send invitation" });
  }
};
