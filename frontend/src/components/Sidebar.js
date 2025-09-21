import React, { useState } from "react";
import {
  Home,
  Users,
  FolderOpen,
  CheckSquare,
  Calendar,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu definitions
  const baseMenu = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard" },
    { id: "projects", label: "Projects", icon: FolderOpen, route: "/projects" },
    { id: "sprint-office", label: "Sprint Office", icon: Calendar, route: "/sprint-office" },
    { id: "task-office", label: "Task Office", icon: CheckSquare, route: "/task-office" },
  ];

  const adminMenu = [
    { id: "team", label: "Team", icon: Users, route: "/team" },
    { id: "reports", label: "Reports", icon: BarChart3, route: "/reports" },
  ];

  const menuItems = user?.role === "admin" ? [...baseMenu, ...adminMenu] : baseMenu;
  const currentPathSegment = location.pathname.split("/")[1];

  return (
    <>
      {/* Sidebar Toggle (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md md:hidden shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white text-gray-800 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static shadow-md
        `}
      >
        {/* Logo */}
        <div className="p-6 h-20 flex items-center gap-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-600"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-blue-600">TaskMaster</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 text-base overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = currentPathSegment === item.route.split("/")[1];
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? "text-white" : "text-blue-600"}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500">{user?.role || "Role"}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
