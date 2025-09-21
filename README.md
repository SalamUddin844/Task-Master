# 📘 Project Management App (Task Master)

## 🚀 Overview

This is a full-stack **Project Management Application** 

The app allows users to: - Register & Login securely (JWT
authentication)\
- Manage workspaces, projects, sprints, and tasks\
- Assign tasks to users\
- Search, filter, and update projects & tasks\
- Reset password via email (Nodemailer)\
- Use light mode toggle for better UX

------------------------------------------------------------------------

## 🛠 Tech Stack

### **Frontend**

-   React.js\
-   React Router v6\
-   Axios\
-   TailwindCSS\
-   shadcn/ui, lucide-react, FontAwesome

### **Backend**

-   Node.js + Express.js\
-   JWT (Authentication & Authorization)\
-   bcrypt (Password hashing)\
-   Nodemailer (Email service)

### **Database**

-   MySQL\
-   Tables: users, workspaces, projects, sprints, tasks, assignees

------------------------------------------------------------------------

## ⚙️ Architecture

    React Frontend (UI + Routing/Navigation + Axios) 
              │
              ▼
    Express.js Backend (API routes + Middleware + COntrollers)
              │
              ▼
           MySQL Database (Relational data storage)

------------------------------------------------------------------------

## 🗄 Database Schema

### `users`

  Field                 Type           Notes
  --------------------- -------------- ----------------------------
  id (PK, AI)           INT            
  name                  VARCHAR(255)   
  email                 VARCHAR(255)   Unique
  password              VARCHAR(255)   Hashed (bcrypt)
  role                  ENUM           Default: user
  reset_token           VARCHAR(255)   For password reset
  reset_token_expires   TIMESTAMP      Expiration time
  created_at            TIMESTAMP      Default: CURRENT_TIMESTAMP

### Other Tables

-   **workspaces** → id, name, created_at\
-   **projects** → id, workspace_id, name, description, created_at\
-   **sprints** → id, project_id, title, start_date, end_date\
-   **tasks** → id, sprint_id, title, description, status, priority,
    due_date\
-   **assignees** → id, task_id, user_id

------------------------------------------------------------------------

## 🌐 Backend API Routes

### **Auth**

-   `POST /api/auth/register` → Register user\
-   `POST /api/auth/login` → Login user\
-   `POST /api/auth/forgot-password` → Send reset email\
-   `POST /api/auth/reset-password/:token` → Reset password

### **Projects**

-   `GET /api/projects` → Get all projects\
-   `POST /api/projects` → Create project\
-   `PUT /api/projects/:id` → Update project\
-   `DELETE /api/projects/:id` → Delete project\
-   `GET /api/projects/:id` → Get project with sprints

### **Sprints**

-   `POST /api/sprints` → Create sprint\
-   `GET /api/projects/:id/sprints` → Get sprints of a project

### **Tasks**

-   `POST /api/tasks` → Create task\
-   `PUT /api/tasks/:id` → Update task\
-   `DELETE /api/tasks/:id` → Delete task\
-   `GET /api/sprints/:id/tasks` → Get tasks of a sprint

------------------------------------------------------------------------
## 🔑 Features

-   🔐 **Authentication** → JWT login/register, bcrypt password hashing,
    reset via email\
-   📂 **Project Management** → Create, edit, delete projects,
    search/filter projects, sprints & tasks\
-   🎨 **UI/UX** →modals, confirmation
    prompts
------------------------------------------------------------------------

## ▶️ Setup Instructions

### 1. Clone repo

``` bash
git clone <repo_url>
cd project-management-app
```

### 2. Backend Setup

``` bash
cd backend
npm install
cp .env.example .env   # configure DB, JWT_SECRET, SMTP
node createDatabase.js # create database & tables
npm start
```
### 3. Frontend Setup

``` bash
cd frontend
npm install
npm start
```
### 4. Open in browser

    http://localhost:3000