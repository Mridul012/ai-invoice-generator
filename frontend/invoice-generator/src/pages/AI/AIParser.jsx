import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { generateInvoiceNumber, formatCurrency } from "../../utils/helper";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const LOADING_TEXTS = [
  "Reading your text…",
  "Extracting line items…",
  "Building invoice…",
];

const SAMPLES = {
  freelance: `Client: Acme Corp
Email: billing@acme.com
Address: 123 Business Park, Mumbai

Items:
- Frontend Development, 40 hours at ₹2000/hr
- Code review and testing, 8 hours at ₹1500/hr
- Deployment & setup, 4 hours at ₹2000/hr

Payment terms: Net 14`,

  design: `Client: Studio Nine
Email: accounts@studionine.in
Address: 7 Creative Lane, Bengaluru

Design Retainer — March 2026
- UI Design, 5 screens, ₹12000 flat
- Icon set, 20 icons, ₹4000 flat
- Brand guidelines doc, ₹3500 flat

Due: 30 days`,

  consulting: `Client: GreenPath Ventures
Email: finance@greenpath.com

Consulting Invoice - Strategy & Product
- Product roadmap consultation, 3 sessions, ₹8000/session
- Competitive analysis report, ₹15000 flat
- Weekly advisory retainer, 4 weeks, ₹6000/week

GST: 18%
Net 30`,
};

const borderStyle = (color = "#D8D4C8") => ({
  borderWidth: "0.5px",
  borderStyle: "solid",
  borderColor: color,
});

const AIParser = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [invoiceNumber] = useState(() => generateInvoiceNumber());

  // Cycle loading hint text while parsing
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % LOADING_TEXTS.length;
      setLoadingText(LOADING_TEXTS[i]);
    }, 1200);
    return () => clearInterval(id);
  }, [loading]);

  // ── Existing logic — untouched ──────────────────────────────────────────────

  const handleParse = async () => {
    if (!text.trim()) {
      toast.error("Please enter some invoice text");
      return;
    }
    setLoading(true);
    setParsed(null);
    setLoadingText(LOADING_TEXTS[0]);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.PARSE_TEXT, { text });
      setParsed(res.data);
      toast.success("Invoice data extracted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse invoice text");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!parsed) return;
    const items = (parsed.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxpercent: 0,
      total: item.quantity * item.unitPrice,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const invoiceData = {
      invoiceNumber,
      billFrom: { businessName: "", email: "", address: "", phone: "" },
      billTo: {
        clientName: parsed.clientName || "",
        email: parsed.email || "",
        address: parsed.address || "",
        phone: "",
      },
      items,
      subtotal,
      taxTotal: 0,
      total: subtotal,
    };
    setCreating(true);
    try {
      await axiosInstance.post(API_PATHS.INVOICES.CREATE, invoiceData);
      toast.success("Invoice created from AI data!");
      navigate("/invoices");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  };

  // ── Derived values ──────────────────────────────────────────────────────────

  const total = (parsed?.items || []).reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const statusMsg = loading
    ? "AI is reading your text…"
    : parsed
    ? `Extracted ${parsed.items?.length || 0} items · Client: ${parsed.clientName || "Unknown"} · Total: ${formatCurrency(total)}`
    : "Paste text on the left to begin";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── WORKSPACE ROW ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── LEFT PANE ── */}
        <div
          className="w-1/2 flex flex-col bg-[#F7F5EF]"
          style={{
            borderRightWidth: "0.5px",
            borderRightStyle: "solid",
            borderRightColor: "#D8D4C8",
          }}
        >
          {/* File tab bar */}
          <div
            className="bg-[#EFECE3] px-4 py-2 flex items-center"
            style={{
              borderBottomWidth: "0.5px",
              borderBottomStyle: "solid",
              borderBottomColor: "#D8D4C8",
            }}
          >
            <div
              className="inline-flex items-center gap-2 bg-[#FDFCF8] px-3 py-1 rounded"
              style={borderStyle()}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#8A8778]" />
              <span className="text-xs text-[#5A5848]">input.txt</span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className="flex-1 w-full resize-none px-6 py-5 text-sm text-[#0F0F0D] placeholder:text-[#9A9888] outline-none border-0"
            style={{ ...MONO, background: "#F7F5EF" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "Paste any text here — email, WhatsApp message, or notes.\n\nExample:\nClient: Acme Corp\nEmail: billing@acme.com\n\nItems:\n- Web Development, 10 hours at ₹2000/hr\n- UI Design, 5 hours at ₹1500/hr"
            }
          />

          {/* Suggestion chips */}
          <div
            className="bg-[#EFECE3] px-4 py-2 flex items-center gap-2 flex-wrap"
            style={{
              borderTopWidth: "0.5px",
              borderTopStyle: "solid",
              borderTopColor: "#D8D4C8",
            }}
          >
            <span
              className="uppercase tracking-widest text-[#8A8778] mr-1 shrink-0"
              style={{ fontSize: "11px" }}
            >
              Try:
            </span>
            {[
              { label: "Freelance web project", key: "freelance" },
              { label: "Design retainer", key: "design" },
              { label: "Consulting invoice", key: "consulting" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setText(SAMPLES[key])}
                className="bg-[#FDFCF8] text-[#2A5A38] text-xs px-3 py-1 rounded-full hover:bg-[#E8F0EB] transition-colors duration-150"
                style={borderStyle("#B8D4C0")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <div
            className="bg-[#EFECE3] px-4 py-3"
            style={{
              borderTopWidth: "0.5px",
              borderTopStyle: "solid",
              borderTopColor: "#D8D4C8",
            }}
          >
            <button
              onClick={handleParse}
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#4A7C59] text-white text-sm rounded-md py-2 hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Extracting…" : "Extract & generate invoice"}
            </button>
          </div>
        </div>

        {/* ── RIGHT PANE ── */}
        <div className="w-1/2 flex flex-col bg-[#FDFCF8]">
          {/* File tab bar */}
          <div
            className="bg-[#EFECE3] px-4 py-2 flex items-center justify-between"
            style={{
              borderBottomWidth: "0.5px",
              borderBottomStyle: "solid",
              borderBottomColor: "#D8D4C8",
            }}
          >
            <div
              className="inline-flex items-center gap-2 bg-[#FDFCF8] px-3 py-1 rounded"
              style={borderStyle()}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  parsed ? "bg-[#4A7C59]" : "bg-[#8A8778]"
                }`}
              />
              <span className="text-xs text-[#5A5848]">invoice.pdf</span>
            </div>
            {parsed && (
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#E8F0EB]"
                style={borderStyle("#B8D4C0")}
              >
                <span className="text-[#4A7C59]" style={{ fontSize: "8px" }}>
                  ●
                </span>
                <span
                  className="text-[#2A5A38]"
                  style={{ fontSize: "11px" }}
                >
                  Live
                </span>
              </div>
            )}
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">

            {/* EMPTY STATE */}
            {!parsed && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center px-8">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="mb-4"
                >
                  <rect
                    x="8"
                    y="4"
                    width="32"
                    height="40"
                    rx="3"
                    stroke="#D8D4C8"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M32 4 L40 12 L32 12 Z"
                    stroke="#D8D4C8"
                    strokeWidth="1.5"
                    fill="#F7F5EF"
                  />
                  <line x1="14" y1="20" x2="34" y2="20" stroke="#ECEAE0" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="26" x2="30" y2="26" stroke="#ECEAE0" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="32" x2="24" y2="32" stroke="#ECEAE0" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-[#5A5848]">
                  Your invoice will appear here
                </p>
                <p className="text-xs text-[#8A8778] mt-1">
                  Paste text on the left and click extract
                </p>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="px-8 py-8">
                <p
                  className="uppercase tracking-widest text-[#4A7C59] font-medium mb-6"
                  style={{ fontSize: "11px" }}
                >
                  EXTRACTING INVOICE DATA
                </p>

                {/* Client skeleton */}
                <div className="mb-5">
                  <div className="h-2.5 w-20 bg-[#EFECE3] rounded mb-3" />
                  <div className="h-3 bg-[#EFECE3] rounded animate-pulse mb-2 w-48" />
                  <div className="h-3 bg-[#EFECE3] rounded animate-pulse mb-2 w-36" />
                  <div className="h-3 bg-[#EFECE3] rounded animate-pulse w-52" />
                </div>

                <div
                  className="my-5"
                  style={{
                    borderBottomWidth: "0.5px",
                    borderBottomStyle: "solid",
                    borderBottomColor: "#ECEAE0",
                  }}
                />

                {/* Items skeleton */}
                <div>
                  <div className="h-2.5 w-12 bg-[#EFECE3] rounded mb-3" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 mb-2">
                      <div className="h-3 flex-1 bg-[#EFECE3] rounded animate-pulse" />
                      <div className="h-3 w-8 bg-[#EFECE3] rounded animate-pulse" />
                      <div className="h-3 w-16 bg-[#EFECE3] rounded animate-pulse" />
                      <div className="h-3 w-16 bg-[#EFECE3] rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#8A8778] mt-8 animate-pulse">
                  {loadingText}
                </p>
              </div>
            )}

            {/* PARSED STATE — typeset invoice document */}
            {parsed && !loading && (
              <div>
                <div
                  className="mx-6 my-6 bg-[#FDFCF8] rounded-lg overflow-hidden"
                  style={borderStyle()}
                >
                  {/* Invoice header */}
                  <div className="px-8 pt-8 pb-6">
                    <div className="flex items-start justify-between">
                      <h1
                        className="text-3xl text-[#0F0F0D]"
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontWeight: 400,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Invoice
                      </h1>
                      <span className="text-sm text-[#5A5848]" style={MONO}>
                        {invoiceNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8778] mt-1">
                      Issued: {today}
                    </p>
                  </div>

                  {/* Bill To */}
                  <div
                    className="px-8 py-4"
                    style={{
                      borderTopWidth: "0.5px",
                      borderTopStyle: "solid",
                      borderTopColor: "#ECEAE0",
                    }}
                  >
                    <p
                      className="uppercase tracking-widest text-[#9A9888] mb-2"
                      style={{ fontSize: "11px" }}
                    >
                      BILL TO
                    </p>
                    <p className="text-sm font-medium text-[#0F0F0D]">
                      {parsed.clientName || "—"}
                    </p>
                    {parsed.email && (
                      <p className="text-xs text-[#5A5848] mt-0.5">
                        {parsed.email}
                      </p>
                    )}
                    {parsed.address && (
                      <p className="text-xs text-[#5A5848] mt-0.5">
                        {parsed.address}
                      </p>
                    )}
                  </div>

                  {/* Items table */}
                  <div
                    style={{
                      borderTopWidth: "0.5px",
                      borderTopStyle: "solid",
                      borderTopColor: "#ECEAE0",
                    }}
                  >
                    {/* Column headers */}
                    <div className="bg-[#EFECE3] px-8 py-2 grid grid-cols-[1fr_3rem_6rem_6rem] gap-4">
                      {["DESCRIPTION", "QTY", "RATE", "AMOUNT"].map(
                        (col, i) => (
                          <span
                            key={col}
                            className={`uppercase tracking-widest text-[#9A9888] ${
                              i > 0 ? "text-right" : ""
                            }`}
                            style={{ fontSize: "11px" }}
                          >
                            {col}
                          </span>
                        )
                      )}
                    </div>

                    {(parsed.items || []).length === 0 ? (
                      <p className="px-8 py-4 text-sm text-[#8A8778]">
                        No items extracted.
                      </p>
                    ) : (
                      (parsed.items || []).map((item, i) => (
                        <div
                          key={i}
                          className="px-8 py-3 grid grid-cols-[1fr_3rem_6rem_6rem] gap-4 items-center"
                          style={{
                            borderBottomWidth: "0.5px",
                            borderBottomStyle: "solid",
                            borderBottomColor: "#ECEAE0",
                          }}
                        >
                          <span className="text-sm text-[#0F0F0D]">
                            {item.name}
                          </span>
                          <span
                            className="text-sm text-[#5A5848] text-right"
                            style={MONO}
                          >
                            {item.quantity}
                          </span>
                          <span
                            className="text-sm text-[#5A5848] text-right"
                            style={MONO}
                          >
                            {formatCurrency(item.unitPrice)}
                          </span>
                          <span
                            className="text-sm font-medium text-[#0F0F0D] text-right"
                            style={MONO}
                          >
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Total bar */}
                  <div className="bg-[#0F0F0D] px-8 py-4 flex justify-between items-center">
                    <span
                      className="uppercase tracking-widest text-[#A8A498]"
                      style={{ fontSize: "11px" }}
                    >
                      TOTAL DUE
                    </span>
                    <span
                      className="text-lg font-medium text-[#F0EDE4]"
                      style={MONO}
                    >
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={creating}
                    className="bg-[#4A7C59] text-white text-xs px-4 py-2 rounded-md hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creating ? "Saving…" : "Save invoice →"}
                  </button>
                  <button
                    onClick={() => {
                      setParsed(null);
                      setText("");
                    }}
                    className="text-xs text-[#5A5848] px-4 py-2 rounded-md hover:bg-[#EFECE3] transition-colors duration-150"
                    style={borderStyle()}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div
        className="h-9 bg-[#0F0F0D] px-6 flex items-center justify-between shrink-0"
        style={{
          borderTopWidth: "0.5px",
          borderTopStyle: "solid",
          borderTopColor: "#4A4A42",
        }}
      >
        <span className="text-xs text-[#A8A498]">{statusMsg}</span>
        <span
          className="uppercase tracking-widest text-[#4A4A42]"
          style={{ fontSize: "11px" }}
        >
          AI WORKSPACE
        </span>
      </div>
    </>
  );
};

export default AIParser;
