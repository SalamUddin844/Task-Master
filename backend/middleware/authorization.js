const { verifyToken } = require("./verifyJWT");

function CheckAuthorization(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) return res.status(401).json({ error: "Token not found" });

  const [scheme, token] = authHeader.split(" ");
  if (!token || scheme !== "Bearer")
    return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = verifyToken(token); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function CheckAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied..!! Admins only" });
  }
  next();
}

module.exports = { CheckAuthorization, CheckAdmin };
