import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { generateInvoiceNumber } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const emptyItem = { name: "", quantity: 1, unitPrice: 0, taxpercent: 0 };

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
const border = (color = "#D8D4C8") => ({ borderWidth: "0.5px", borderStyle: "solid", borderColor: color });

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [billFrom, setBillFrom] = useState({
    businessName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [billTo, setBillTo] = useState({
    clientName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [items, setItems] = useState([{ ...emptyItem }]);
  const [duedate, setDuedate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      setBillFrom({
        businessName: user.businessName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const getItemTotal = (item) => {
    const base = item.quantity * item.unitPrice;
    return base + base * (item.taxpercent / 100);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.taxpercent / 100),
    0
  );
  const total = subtotal + taxTotal;

  const addItem = () => setItems([...items, { ...emptyItem }]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: field === "name" ? value : Number(value),
    };
    updated[index].total = getItemTotal(updated[index]);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billTo.clientName || !billTo.email) {
      toast.error("Client name and email are required");
      return;
    }

    if (items.some((item) => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("Please fill in all item fields properly");
      return;
    }

    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      billFrom,
      billTo,
      items: items.map((item) => ({ ...item, total: getItemTotal(item) })),
      duedate: duedate || undefined,
      notes,
      subtotal,
      taxTotal,
      total,
    };

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.INVOICES.CREATE, invoiceData);
      toast.success("Invoice created!");
      navigate("/invoices");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2";
  const inputStyle = { backgroundColor: "#F7F5EF", ...border() };
  const handleFocus = (e) => (e.target.style.borderColor = "#4A7C59");
  const handleBlur = (e) => (e.target.style.borderColor = "#D8D4C8");

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: "#F7F5EF" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="uppercase tracking-widest text-[#8A8778] mb-1" style={{ fontSize: "11px" }}>
              Invoices / New
            </p>
            <h1
              className="text-2xl text-[#0F0F0D]"
              style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              Create invoice
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="text-[13px] text-[#5A5848] hover:text-[#0F0F0D] transition-colors mt-1"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main form card */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#FDFCF8", ...border() }}>

            {/* Bill From / Bill To */}
            <div className="grid grid-cols-2">
              <div className="p-6" style={{ borderRight: "0.5px solid #D8D4C8" }}>
                <p className="uppercase tracking-widest text-[#8A8778] mb-4" style={{ fontSize: "11px" }}>
                  Bill From
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={billFrom.businessName}
                      onChange={(e) => setBillFrom({ ...billFrom, businessName: e.target.value })}
                      placeholder="Your business name"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={billFrom.email}
                      onChange={(e) => setBillFrom({ ...billFrom, email: e.target.value })}
                      placeholder="you@business.com"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={billFrom.address}
                      onChange={(e) => setBillFrom({ ...billFrom, address: e.target.value })}
                      placeholder="Business address"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      value={billFrom.phone}
                      onChange={(e) => setBillFrom({ ...billFrom, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="uppercase tracking-widest text-[#8A8778] mb-4" style={{ fontSize: "11px" }}>
                  Bill To
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={billTo.clientName}
                      onChange={(e) => setBillTo({ ...billTo, clientName: e.target.value })}
                      placeholder="Client's full name"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={billTo.email}
                      onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
                      placeholder="client@email.com"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={billTo.address}
                      onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                      placeholder="Client address"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-widest text-[#8A8778] mb-1.5" style={{ fontSize: "10px" }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      value={billTo.phone}
                      onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div
              className="px-6 py-4 flex items-center gap-6"
              style={{ borderTop: "0.5px solid #D8D4C8" }}
            >
              <label className="uppercase tracking-widest text-[#8A8778] shrink-0" style={{ fontSize: "11px" }}>
                Due Date
              </label>
              <input
                type="date"
                value={duedate}
                onChange={(e) => setDuedate(e.target.value)}
                className="rounded-md text-sm text-[#0F0F0D] outline-none transition-colors duration-150 px-3 py-2"
                style={{ backgroundColor: "#F7F5EF", ...border() }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Items */}
            <div className="p-6" style={{ borderTop: "0.5px solid #D8D4C8" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="uppercase tracking-widest text-[#8A8778]" style={{ fontSize: "11px" }}>
                  Items
                </p>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-[12px] text-[#4A7C59] hover:text-[#3d6b4a] font-medium transition-colors"
                >
                  + Add item
                </button>
              </div>

              {/* Column headers */}
              <div
                className="grid px-3 py-2 rounded mb-2"
                style={{
                  gridTemplateColumns: "3fr 1fr 1.3fr 1fr 1.3fr 28px",
                  backgroundColor: "#F0EDE4",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8A8778",
                }}
              >
                <span>Description</span>
                <span>Qty</span>
                <span>Price (₹)</span>
                <span>Tax %</span>
                <span className="text-right">Total</span>
                <span></span>
              </div>

              {/* Item rows */}
              <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid items-center gap-2"
                    style={{ gridTemplateColumns: "3fr 1fr 1.3fr 1fr 1.3fr 28px" }}
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      placeholder="Item description"
                      className={inputBase}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className={inputBase}
                      style={{ ...inputStyle, ...MONO }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                      className={inputBase}
                      style={{ ...inputStyle, ...MONO }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.taxpercent}
                      onChange={(e) => updateItem(index, "taxpercent", e.target.value)}
                      className={inputBase}
                      style={{ ...inputStyle, ...MONO }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <div className="text-right text-sm text-[#0F0F0D] px-2 py-2" style={MONO}>
                      ₹{getItemTotal(item).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="flex items-center justify-center text-[#C8C4B8] hover:text-[#7A2020] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      style={{ fontSize: "18px", lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes + Totals */}
            <div className="grid grid-cols-2" style={{ borderTop: "0.5px solid #D8D4C8" }}>
              <div className="p-6" style={{ borderRight: "0.5px solid #D8D4C8" }}>
                <label className="block uppercase tracking-widest text-[#8A8778] mb-2" style={{ fontSize: "11px" }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you note, etc."
                  rows={5}
                  className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 resize-none"
                  style={{ backgroundColor: "#F7F5EF", ...border() }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div className="p-6 flex flex-col justify-end">
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex justify-between items-center text-sm text-[#5A5848]">
                    <span>Subtotal</span>
                    <span style={MONO}>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#5A5848]">
                    <span>Tax</span>
                    <span style={MONO}>₹{taxTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div
                  className="flex justify-between items-center px-4 py-3 rounded-md"
                  style={{ backgroundColor: "#0F0F0D" }}
                >
                  <span className="text-sm font-medium text-white">Total</span>
                  <span className="text-base text-white" style={MONO}>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4A7C59] text-white text-sm font-medium rounded-md px-6 py-2.5 hover:bg-[#3d6b4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : "Create invoice →"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="text-sm text-[#5A5848] rounded-md px-6 py-2.5 hover:text-[#0F0F0D] transition-colors"
              style={{ ...border() }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
