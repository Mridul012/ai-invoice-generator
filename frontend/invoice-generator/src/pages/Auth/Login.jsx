import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back!");
      navigate("/workspace");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F7F5EF" }}
    >
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#4A7C59] rounded-sm flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="1" width="4" height="4" fill="#F0EDE4" rx="0.5" />
                <rect x="6" y="1" width="4" height="4" fill="#F0EDE4" rx="0.5" opacity="0.6" />
                <rect x="1" y="6" width="4" height="4" fill="#F0EDE4" rx="0.5" opacity="0.6" />
                <rect x="6" y="6" width="4" height="4" fill="#F0EDE4" rx="0.5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#0F0F0D]">AI Invoice</span>
          </Link>

          <h1
            className="text-2xl text-[#0F0F0D] mb-1"
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-[#5A5848]">Sign in to your workspace</p>
        </div>

        {/* Form card */}
        <div
          className="bg-[#FDFCF8] rounded-lg p-6"
          style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#D8D4C8" }}
        >
          {/* Error banner */}
          {error && (
            <div
              className="mb-4 px-3 py-2 rounded text-sm text-[#7A2020]"
              style={{
                backgroundColor: "#F5E4E4",
                borderWidth: "0.5px",
                borderStyle: "solid",
                borderColor: "#D4A0A0",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="uppercase tracking-widest text-[#8A8778]"
                style={{ fontSize: "11px" }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2"
                style={{
                  backgroundColor: "#F7F5EF",
                  borderWidth: "0.5px",
                  borderStyle: "solid",
                  borderColor: "#D8D4C8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7C59")}
                onBlur={(e) => (e.target.style.borderColor = "#D8D4C8")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="uppercase tracking-widest text-[#8A8778]"
                style={{ fontSize: "11px" }}
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2"
                style={{
                  backgroundColor: "#F7F5EF",
                  borderWidth: "0.5px",
                  borderStyle: "solid",
                  borderColor: "#D8D4C8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7C59")}
                onBlur={(e) => (e.target.style.borderColor = "#D8D4C8")}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] text-white text-sm font-medium rounded-md py-2 mt-1 hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="text-sm text-[#5A5848] text-center mt-5">
          No account?{" "}
          <Link
            to="/signup"
            className="text-[#4A7C59] hover:underline transition-colors duration-150"
          >
            Create one free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
