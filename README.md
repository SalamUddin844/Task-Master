

# 📘 Task Master – Project Management App

## 🚀 Overview

Task Master is a **full-stack project management application** that helps teams manage projects, sprints, and tasks efficiently.

**Main Features:**

* ✅ User Authentication (Register, Login, Forgot, Reset Password) *(Json Web Token)*
* ✅ Projects, Sprint & Task Management
* ✅ Task Assignment with status tracking 
* ✅ Live Chat / Comments
* ✅ Email-based Password Recovery
* ✅ Role Management (user and admin)
* ✅ Invite member via email to register 

---

## 🛠 Tech Stack
<img width="1366" height="768" alt="sprintlist" src="https://github.com/user-attachments/assets/b23ba9db-7350-4e5c-aad1-cb7d728db63c" />
<img width="1366" height="768" alt="tasklist" src="https://github.com/user-attachments/assets/ef1d8895-f88b-4c7c-86c1-1af24ee56a59" />
<img width="1366" height="768" alt="total sprint of a company" src="https://github.com/user-attachments/assets/d268567f-d78e-4667-baf4-8369bfbf95a3" />
<img width="1366" height="768" alt="total task ofa company" src="https://github.com/user-attachments/assets/477dfc53-24c3-484d-b22e-cc1558c1cb44" />
<img width="1366" height="768" alt="admin " src="https://github.com/user-attachments/assets/7b62b766-3f19-4335-9443-b63e30329bc8" />
<img width="1366" height="768" alt="edit project" src="https://github.com/user-attachments/assets/f288a78d-7497-41f3-a3c8-6983d468eea3" />
<img width="1366" height="768" alt="forgot-password" src="https://github.com/user-attachments/assets/d3b57fda-1f16-46c3-b095-d51b50eb86b3" />
<img width="1366" height="768" alt="invite someone via email" src="https://github.com/user-attachments/assets/83013bd3-e1d7-4a0b-9261-ec5221de67d8" />
<img width="1366" height="768" alt="login" src="https://github.com/user-attachments/assets/d5d8de3c-aa79-45f1-976b-619c85e0e5e0" />
<img width="1366" height="768" alt="projects" src="https://github.com/user-attachments/assets/1bc06304-12fa-4318-80cc-2be3267e90fb" />
<img width="1366" height="768" alt="register" src="https://github.com/user-attachments/assets/ea1b0978-63c0-413b-ae4e-fb1d2fe91a45" />

### **Frontend**

* **React.js** → Build UI using JSX
* **React Router v6** → Page navigation (with ProtectedRoute)
* **Axios** → Modern API calls to backend
* **Tailwind CSS** → Responsive and modern UI
* **LocalStorage** → Store JWT token + user data

### **Backend**

* **Node.js + Express.js** → REST API server
* **MySQL** → Relational database (normalized schema)
* **JWT** → Authentication & Authorization
* **bcrypt** → Secure password hashing
* **Nodemailer** → Email system for password reset

### **Database**

* Tables: `users`, `projects`, `sprints`, `tasks`, `messages`, `assignees`
* Relational structure using Foreign Keys

---

## 🖥 Frontend Components (Detailed)

### **Auth Components**

**Register.js**

* Fields: `name`, `email`, `password`
* Validations: Email regex, password strength (length, uppercase, special char)
* API: `POST /api/auth/register` → JWT token stored → redirect to Dashboard

**Login.js**

* Fields: `email`, `password`
* API: `POST /api/auth/login` → store token + user info in localStorage → redirect to protected route

**ForgotPassword.js**

* Field: `email`
* API: `POST /api/auth/forgot-password` → backend sends reset email

**ResetPassword.js**

* Field: `new password`
* API: `POST /api/auth/reset-password/:token` → validate token → update password

---

### **Main Components**

**Dashboard.js**

* Active Projects count
* Tasks summary (ToDo, InProgress, Done)
* Quick links to projects & chat

**Projects**

* List of projects
* Project info & actions (edit, view sprints, delete)

**Sprints**

* List all sprints for a project
* Sprint info & actions (edit, view tasks, delete)

**Tasks**

* List all tasks for a sprint
* Task details: start/end date, due date, status, assignee, priority
* Actions: assign user, edit, delete

**Live Chat (Optional)**

* Sidebar: Team members list
* Chat window: messages with timestamps
* Input: type message + send
* API: `POST /api/messages`

**UX Enhancements:**

* Auto-scroll to bottom
* Selected user highlighted
* Error messages shown

---

## 🖥 Backend (Detailed)

### **Auth**

* `POST /api/auth/register` → validate input → bcrypt hash → save user → return `{ token, user }`
* `POST /api/auth/login` → validate → return `{ token, user }`
* `POST /api/auth/forgot-password` → generate reset token → send email
* `POST /api/auth/reset-password/:token` → validate token → update password

### **Projects**

* `GET /api/projects` → all projects
* `POST /api/projects` → create project
* `GET /api/projects/:id` → project details

### **Sprints**

* `GET /api/sprints/:projectId` → project’s sprints
* `POST /api/sprints` → create sprint

### **Tasks**

* `GET /api/tasks/:sprintId` → sprint’s tasks
* `POST /api/tasks` → create task
* `PUT /api/tasks/:id` → update task

### **Live Chat**

* `GET /api/messages/users` → all users except current
* `GET /api/messages/:userId` → conversation between two users
* `POST /api/messages` → save message

---

## 🗄 Database Schema (Detailed)

### **Users**

| Field             | Type             | Notes |
| ----------------- | ---------------- | ----- |
| id                | PK               |       |
| name              | VARCHAR(100)     |       |
| email             | UNIQUE           |       |
| password          | hashed           |       |
| role              | ENUM(user/admin) |       |
| reset\_token      | VARCHAR          |       |
| reset\_token\_exp | DATETIME         |       |

**Used in:** Auth, Task Assignee, Chat

### **Projects**

| Field       | Type      | Notes |
| ----------- | --------- | ----- |
| id          | PK        |       |
| name        | VARCHAR   |       |
| description | TEXT      |       |
| created\_at | TIMESTAMP |       |

**Used in:** Dashboard, Project List

### **Sprints**

| Field       | Type    | Notes |
| ----------- | ------- | ----- |
| id          | PK      |       |
| project\_id | FK      |       |
| title       | VARCHAR |       |
| start\_date | DATE    |       |
| end\_date   | DATE    |       |

**Used in:** Project Details → Sprint List

### **Tasks**

| Field        | Type      | Notes                |
| ------------ | --------- | -------------------- |
| id           | PK        |                      |
| sprint\_id   | FK        |                      |
| title        | VARCHAR   |                      |
| description  | TEXT      |                      |
| status       | ENUM      | ToDo/InProgress/Done |
| assignee\_id | FK        |                      |
| created\_at  | TIMESTAMP |                      |

**Used in:** Sprint Page → Task List

### **Messages**

| Field        | Type      | Notes |
| ------------ | --------- | ----- |
| id           | PK        |       |
| sender\_id   | FK        |       |
| receiver\_id | FK        |       |
| message      | TEXT      |       |
| created\_at  | TIMESTAMP |       |

**Used in:** LiveChat

---

## 🔄 Data Flow Example

**User Registration Flow:**
React → POST `/api/auth/register` → Express → validate → bcrypt hash → DB insert → return JWT → store in localStorage

**Chat Flow:**
User selects teammate → React calls `GET /api/messages/:userId` → Express fetches messages → return JSON → User sends → POST `/api/messages` → insert DB → refresh messages

---

## 🔐 Security

* Password hashing: bcrypt + salt=10
* JWT: stored in LocalStorage, sent in `Authorization: Bearer` header
* Email validation before DB entry
* Reset token expiry: 1 hour
* Role-based access ready for future

---

## 📈 Future Improvements

* Real-time WebSocket (Socket.IO) chat
* Group chat + file sharing
* Admin dashboard
* Notifications system
* Task comments

---

## ▶️ Setup Instructions

### 1. Clone repo

```bash
git clone <repo_url>
cd project-management-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # configure DataBase, JWT_SECRET, SMTP
node createDatabase.js # create database & tables
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Open in browser


http://localhost:3000



