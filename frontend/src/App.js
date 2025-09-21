import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PolygonBoard from "./components/PolygonBoard";
import Login from "./components/pages/Login-Registration/Login";
import Register from "./components/pages/Login-Registration/Register";
import ForgotPassword from "./components/pages/Login-Registration/ForgotPassword";
import ResetPassword from "./components/pages/Login-Registration/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./components/pages/Dashboard/Dashboard"; 
import Projects from "./components/pages/Project-With-Details/Projects";
import ProjectDetails from "./components/pages/Project-With-Details/ProjectDetails";
import TaskOffice from "./components/pages/Task-Manager/TaskOffice";
import SprintOffice from "./components/pages/Sprint-Manager/SprintOffice";
import SprintTasks from "./components/pages/Task-Manager/SprintTasks"; 
import Team from "./components/pages/Team-Manager/Team";
import Reports from "./components/pages/Reports-Stats/Reports";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PolygonBoard />
            </ProtectedRoute>
          }
        >
          {/* Redirect default "/" to login */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* User-accessible routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="task-office" element={<TaskOffice />} />
          <Route path="sprint-office" element={<SprintOffice />} />

          <Route path="projects/:projectId/sprints/:sprintId" element={<SprintTasks />} />
          

          {/* Admin-only routes */}
          <Route
            path="team"
            element={
              <ProtectedRoute requiredRole="admin">
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
