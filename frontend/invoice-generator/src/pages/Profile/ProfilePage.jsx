import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gst, setGst] = useState(user?.gst || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name, businessName, address, phone, gst });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const firstLetter = name.trim()
    ? name.trim()[0].toUpperCase()
    : (user.email?.[0]?.toUpperCase() || "?");

  const inputBase =
    "w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2";
  const inputStyle = {
    backgroundColor: "#F7F5EF",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#D8D4C8",
  };
  const handleFocus = (e) => (e.target.style.borderColor = "#4A7C59");
  const handleBlur = (e) => (e.target.style.borderColor = "#D8D4C8");

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F7F5EF]">

      {/* Page header */}
      <div className="px-8 pt-8 pb-6">
        <p className="text-[11px] uppercase tracking-widest text-[#8A8778] mb-1">PROFILE</p>
        <h1 className="text-xl text-[#0F0F0D] font-medium">Business settings</h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="px-8 pb-8 grid grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── LEFT COL: Form card ── */}
          <div
            className="bg-[#FDFCF8] rounded-lg overflow-hidden"
            style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#D8D4C8" }}
          >
            {/* Section header: Account */}
            <div
              className="bg-[#EFECE3] px-6 py-3"
              style={{ borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#D8D4C8" }}
            >
              <span className="text-[11px] uppercase tracking-widest text-[#9A9888] font-medium">ACCOUNT</span>
            </div>

            <div className="px-6 py-5">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-sm text-white font-medium shrink-0">
                  {firstLetter}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F0F0D]">{name || user.name || "—"}</p>
                  <p className="text-xs text-[#8A8778]">{user.email}</p>
                </div>
              </div>

              {/* Full name */}
              <div className="mt-4">
                <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Email (readonly) */}
              <div className="mt-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className={inputBase}
                  style={{
                    borderWidth: "0.5px",
                    borderStyle: "solid",
                    borderColor: "#D8D4C8",
                    backgroundColor: "#EFECE3",
                    color: "#8A8778",
                    cursor: "not-allowed",
                  }}
                />
              </div>
            </div>

            {/* Section header: Business */}
            <div style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#ECEAE0" }}>
              <div
                className="bg-[#EFECE3] px-6 py-3"
                style={{ borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#D8D4C8" }}
              >
                <span className="text-[11px] uppercase tracking-widest text-[#9A9888] font-medium">BUSINESS</span>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Stark Industries"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#9A9888] mb-1.5">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder="22AAAAA0000A1Z5 (optional)"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex justify-between items-center"
              style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#ECEAE0" }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-[#8A8778] hover:text-[#7A2020] transition-colors duration-150 cursor-pointer"
              >
                Sign out
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#4A7C59] text-white text-xs px-4 py-2 rounded-md hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          {/* ── RIGHT COL: Invoice header preview ── */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#9A9888] mb-3">
              INVOICE HEADER PREVIEW
            </p>
            <p className="text-xs text-[#8A8778] mb-3">This appears on every invoice you send</p>

            <div
              className="bg-[#FDFCF8] rounded-lg p-6"
              style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#D8D4C8" }}
            >
              <p className="text-base font-medium text-[#0F0F0D]">
                {businessName.trim() || <span className="text-[#9A9888]">Your Business Name</span>}
              </p>
              <p className="text-xs text-[#5A5848] mt-0.5">
                {address.trim() || <span className="text-[#9A9888]">Your address</span>}
              </p>
              <p className="text-xs text-[#8A8778]">
                {phone.trim() || <span className="text-[#9A9888]">Your phone</span>}
              </p>
              {gst.trim() && (
                <p className="text-xs text-[#8A8778]">GST: {gst}</p>
              )}

              <div
                className="my-4"
                style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#ECEAE0" }}
              />

              <p className="text-[11px] uppercase tracking-widest text-[#9A9888] mb-2">FROM</p>
              <div className="flex flex-col gap-y-1.5">
                <div className="h-2 bg-[#EFECE3] rounded w-24" />
                <div className="h-2 bg-[#EFECE3] rounded w-32" />
                <div className="h-2 bg-[#EFECE3] rounded w-20" />
              </div>
            </div>

            <p className="text-xs text-[#8A8778] mt-3 leading-relaxed">
              Complete your business info to auto-fill the FROM section on all generated invoices.
            </p>
          </div>

        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
