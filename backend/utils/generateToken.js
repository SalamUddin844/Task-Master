const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./database/.env" });

function generateUniqueToken(payload, options = {}) {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
      ...options,
    });
    return token;
  } catch (err) {
    console.error("Token generation error:", err.message);
    return null;
  }
}

module.exports = { generateUniqueToken };
