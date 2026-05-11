import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/helper";

const TopBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[#0F0F0D] h-14 flex items-center justify-between px-8 shrink-0 border-b border-[#1A1A16]">
      {/* Logo */}
      <Link
        to={isAuthenticated ? "/dashboard" : "/"}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 bg-[#4A7C59] rounded-[7px] flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 11 11" fill="none">
            <rect x="1" y="1" width="4" height="4" fill="#F0EDE4" rx="0.5" />
            <rect
              x="6"
              y="1"
              width="4"
              height="4"
              fill="#F0EDE4"
              rx="0.5"
              opacity="0.6"
            />
            <rect
              x="1"
              y="6"
              width="4"
              height="4"
              fill="#F0EDE4"
              rx="0.5"
              opacity="0.6"
            />
            <rect x="6" y="6" width="4" height="4" fill="#F0EDE4" rx="0.5" />
          </svg>
        </div>
        <span className="text-[15px] font-medium text-white tracking-tight">
          AI Invoice
        </span>
      </Link>

      {/* Nav */}
      {isAuthenticated ? (
        <nav className="flex items-center gap-7">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#A8A498] hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/invoices"
            end
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#A8A498] hover:text-white"
              }`
            }
          >
            Invoices
          </NavLink>
          <NavLink
            to="/workspace"
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#A8A498] hover:text-white"
              }`
            }
          >
            Generate
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#A8A498] hover:text-white"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>
      ) : (
        <div />
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <button
              onClick={logout}
              className="text-[12px] text-[#C8C4B8] border border-[#4A4A42] rounded-[6px] px-4 py-2 hover:bg-[#1C1C18] hover:text-white transition-colors cursor-pointer"
            >
              sign out
            </button>
            <div className="w-8 h-8 rounded-full bg-[#252520] border border-[#4A4A42] flex items-center justify-center text-[11px] font-medium text-[#C8C4B8] shrink-0">
              {getInitials(user?.name)}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-[12px] text-[#C8C4B8] border border-[#4A4A42] rounded-[6px] px-4 py-2 hover:bg-[#1C1C18] hover:text-white transition-colors cursor-pointer"
            >
              sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#4A7C59] text-white text-[12px] font-medium rounded-[6px] px-4 py-2 hover:bg-[#3D6B4C] transition-colors cursor-pointer"
            >
              start free
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
