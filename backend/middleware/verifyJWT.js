const jwt = require("jsonwebtoken");
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded;
  } catch (err) {
    console.error("Token verification error:", err.message);
    return null;
  }
}
module.exports = { verifyToken };

