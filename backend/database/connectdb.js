const mysql = require("mysql");
require("dotenv").config({ path: "./database/.env" });

const db = mysql.createConnection({
  host: process.env.HOST_NAME || "192.168.12.224",
  port: process.env.PORT_NUMBER || 3306,
  user: process.env.USER_NAME || "root",
  password: process.env.PASSWORD || "1234",
  database: process.env.DATABASE_NAME || "polygon_board",

});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
