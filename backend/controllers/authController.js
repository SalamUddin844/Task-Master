const { generateUniqueToken } = require("../utils/generateToken");
const { verifyToken } = require("../middleware/verifyJWT");
const db = require("../database/connectdb");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { checkPasswordStrength } = require("../middleware/passwordChecker");
const { isValidEmail } = require("../middleware/emailChecker");

const salt_rounds = 12;

// ------------------ REGISTER ------------------
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    //----------------email formate checking----------------
    if(!isValidEmail(email)){
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }


    ///---------------password strength checking----------------
    const { valid, message } = checkPasswordStrength(password);
    if (!valid) {
        return res.status(400).json({ success: false, message });
    }

    ///---------------password hashing----------------
    const hashedPassword = await bcrypt.hash(password, salt_rounds);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"],
      (err, result) => {
        if (err) {
          console.error("MySQL Error (Register):", err.sqlMessage || err);
          if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ message: "Email already registered" });
          return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
        }

        const jwtToken = generateUniqueToken({ id: result.insertId, email, role: "user" });
        console.log("jwtToken:", jwtToken);

        res.status(201).json({
          message: "User registered successfully",
          token: jwtToken,
          user: { id: result.insertId, name, email, role: "user" }
        });
      }
    );
  } catch (error) {
    console.error("Server Error (Register):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
// exports.register = async (req, res) => {
//   try {
//     const [name, email, password] = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Information missing,Please check again." });
//     }
//     const hashedPassword = await bcrypt.hash(password, salt_rounds);
//     db.query(
//       "INSERT INTO users (name , email, password, role) VALUES(?,?,?,?)",
//       [name, email, hashedPassword, "user"],
//       (err, result) => {
//         if (err) {
//           console.error(err || err.sqlmessage);
//           if (err.code === "ER_DP_ENTRY")
//             return res.status(400).json({ message: "Email alreay registered!!" });
//           return res.status(500).json({ message: "Internal server error!!" });
//         }

//         const JWTUniqueToken = generateUniqueToken({ if: result.insertId, email, role: "user" });
//         console.log("JWT token is : ", JWTUniqueToken);

//         res.status(201).json({
//           massage: "Registration Successfull",
//           Token: JWTUniqueToken,
//           user: { id: result.insertId, email, role: "user" }

//         })
//       }
//     )
//   } catch {
//       console.log("server error");
//       res.status(500).json({message:"Internal server error" || err});
//   }
// }
// ------------------ LOGIN ------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("MySQL Error (Login):", err.sqlMessage || err);
        return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
      }

      if (results.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = generateUniqueToken({ id: user.id, email: user.email, role: user.role });
      console.log("Generated Token:", token);

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error("Server Error (Login):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
// exports.login = async(req, res)=>{
//   try{
//     const [email,password]=req.body;
//     if(!email || !password){
//       return res.status(400).json({message:"Missing information, please check again!!"});
//     }
    
//     db.query("SELECT*FROM users WHERE email =? ",[email],
//       async(err,result)=>{
//         if(err){
//           console.error("database error", err || err.sqlmessage);
//           return res.status(500).json({error:err||sqlmessage});
//         }

//         if(result.length===0)
//           res.status(400).json({message:"Invalid credential!!"});
        
//         const user=result[0];
//         const validatePassword= await bcrypt.compare(password, user.password);
//         if(!validatePassword)
//           return res.status(400).json({message:"Invalid Password!!"});

//         const JWTUniqueToken = generateUniqueToken({id: user.id, email: user.email, role: user.role});

//         res.status(201).json({
//           message: "login successfull",
//           JWTUniqueToken,
//           user:{
//             id: user,id,
//             name: user.name,
//             email: user.email,
//             role : user.role
//           }
//         })
//       }
//     )
//   }catch{
//     console.log("internal server error");
//     res.status(500).json({message:"internal server error"|| err});
//   }
// }
// ------------------ FORGOT PASSWORD ------------------
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const resetToken = generateUniqueToken({ email: user.email });
    const resetTokenExpires = new Date(Date.now() + 3600000);

    db.query(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [resetToken, resetTokenExpires, email],
      async (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });

        try {
          const transporter = nodemailer.createTransport({    /// transport that hits the gmail server
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const FRONTEND_URL = process.env.FRONTEND_URL;
          const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

          await transporter.sendMail({
            from: `"Task Master" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset",
            html: `<p>Hello ${user.name},</p>
                   <p>You requested a password reset. Click the link below:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>This link will expire in 1 hour.</p>`
          });

          res.json({ message: "Reset email sent" });
        } catch (err) {
          console.error("Email Error:", err);
          res.status(500).json({ message: "Failed to send email", error: err.message });
        }
      }
    );
  });
}

// ------------------ RESET PASSWORD ------------------
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: "Password is required" });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  db.query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
      if (results.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

      const hashedPassword = await bcrypt.hash(password, salt_rounds);

      db.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?",
        [hashedPassword, token],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
          res.json({ message: "Password has been reset successfully" });
        }
      );
    }
  );
}

module.exports = {register, login,forgotPassword, resetPassword };



