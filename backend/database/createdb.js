require("dotenv").config({ path: "./.env" });
const mysql = require("mysql2/promise");

async function initDB() {
  try {
    // Connect without selecting database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true, // optional, if needed
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database "${process.env.DB_NAME}" created or already exists`);

    // Switch to the new database
    await connection.changeUser({ database: process.env.DB_NAME });
    console.log(`Using database "${process.env.DB_NAME}"`);

    // Create tables
    const createTables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(100)
      )`,
      `CREATE TABLE IF NOT EXISTS sprints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        due_date DATE,
        status ENUM('planned','In_Progress','Active','Completed') DEFAULT 'planned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sprint_id INT NOT NULL,
        project_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        due_date DATE,
        time_estimation INT DEFAULT 0,
        priority ENUM('urgent','high','normal','low') DEFAULT 'normal',
        status ENUM('todo','in_progress','done') DEFAULT 'todo',
        assignee_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY sprint_id (sprint_id),
        KEY project_id (project_id),
        CONSTRAINT tasks_ibfk_1 FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE CASCADE,
        CONSTRAINT tasks_ibfk_2 FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
    ];

    for (let i = 0; i < createTables.length; i++) {
      await connection.query(createTables[i]);
      console.log(`Table ${i + 1} created/verified`);
    }

    console.log("All tables created successfully.");
    await connection.end();
  } catch (err) {
    console.error("Database initialization failed:", err.message);
  }
}

initDB();
