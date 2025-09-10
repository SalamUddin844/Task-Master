// // function checkRole(requiredRole) {
// //   return (req, res, next) => {
// //     if (!req.user || req.user.role !== requiredRole) {
// //       return res.status(403).json({ error: "Access denied. Admins only." });
// //     }
// //     next();
// //   };
// // }

// function CheckAdmin(req, res, next) {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ error: "Access denied: Admins only" });
//   }
//   next();
// }

// module.exports = {CheckAdmin};