import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success("Account created!");
      navigate("/workspace");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2";

  const inputStyle = {
    backgroundColor: "#F7F5EF",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#D8D4C8",
  };

  const handleFocus = (e) => (e.target.style.borderColor = "#4A7C59");
  const handleBlur = (e) => (e.target.style.borderColor = "#D8D4C8");

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
            Create your workspace
          </h1>
          <p className="text-sm text-[#5A5848]">Start generating invoices in seconds</p>
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
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="uppercase tracking-widest text-[#8A8778]"
                style={{ fontSize: "11px" }}
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className={inputClass}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="uppercase tracking-widest text-[#8A8778]"
                style={{ fontSize: "11px" }}
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="uppercase tracking-widest text-[#8A8778]"
                style={{ fontSize: "11px" }}
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={inputClass}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] text-white text-sm font-medium rounded-md py-2 mt-1 hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="text-sm text-[#5A5848] text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4A7C59] hover:underline transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;
