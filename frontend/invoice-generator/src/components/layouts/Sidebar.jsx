import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Sparkles, User } from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", path: "/invoices", icon: FileText },
  { label: "Generate with AI", path: "/ai-parser", icon: Sparkles },
  { label: "Profile", path: "/profile", icon: User },
];

const Sidebar = () => {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-800">AI Invoice</span>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
