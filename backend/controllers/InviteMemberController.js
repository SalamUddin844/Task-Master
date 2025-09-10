const nodemailer = require("nodemailer");
const db = require("../database/connectdb");

exports.inviteMember = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  try {
    // Save member to database
    const insertQuery = "INSERT INTO team_members (name, email, role) VALUES (?, ?, ?)";
    const [result] = await db.promise().execute(insertQuery, [name, email, role]);

    // Send invitation email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Task Master" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're invited to join Task Master",
      html: `<p>Hello ${name},</p>
             <p>You have been invited to join our team on <b>Task Master</b>.</p>
             <p>Please <a href="http://192.168.12.224:3000/register">register here</a> to join.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to invite member" });
  }
};
