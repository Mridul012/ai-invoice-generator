import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";
import StatusBadge from "../../components/ui/StatusBadge";

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const TABLE_COLS = "grid-cols-[2fr_2fr_1.5fr_1.5fr_1.2fr_0.8fr]";

const SkeletonRows = () => (
  <>
    {[["55%", "30%", "20%", "18%"], ["70%", "28%", "22%", "16%"], ["45%", "32%", "18%", "20%"]].map(
      (widths, i) => (
        <div
          key={i}
          className="px-8 py-4 flex items-center gap-6 animate-pulse bg-[#FDFCF8]"
          style={{
            borderBottomWidth: "0.5px",
            borderBottomStyle: "solid",
            borderBottomColor: "#ECEAE0",
          }}
        >
          {widths.map((w, j) => (
            <div
              key={j}
              className="h-3 bg-[#EFECE3] rounded"
              style={{ width: w, flexShrink: 0 }}
            />
          ))}
        </div>
      )
    )}
  </>
);

const EmptyState = () => (
  <div className="py-16 flex flex-col items-center text-center px-8">
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
      <line
        x1="24"
        y1="17"
        x2="24"
        y2="31"
        stroke="#D8D4C8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="24"
        x2="31"
        y2="24"
        stroke="#D8D4C8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="36"
        x2="28"
        y2="36"
        stroke="#ECEAE0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
    <p className="text-sm font-medium text-[#5A5848] mb-1">
      Your first invoice is one prompt away
    </p>
    <p className="text-xs text-[#8A8778] max-w-xs leading-relaxed">
      Paste any email, note, or message and AI builds it instantly
    </p>
    <Link
      to="/workspace"
      className="mt-4 inline-block text-xs px-4 py-2 bg-[#4A7C59] text-white rounded-md hover:bg-[#3d6b4a] transition-colors duration-150"
    >
      Generate your first invoice →
    </Link>
  </div>
);

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const res = await axiosInstance.post(API_PATHS.AI.DASHBOARD_SUMMARY);
        setInsights(res.data.insights || []);
      } catch {
        // silent fail
      } finally {
        setInsightsLoading(false);
      }
    };

    const fetchInvoices = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL);
        setInvoices(res.data);
        if (res.data.length > 0) {
          fetchInsights();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const paid = invoices.filter((inv) => inv.status === "Paid");
  const pending = invoices.filter((inv) => inv.status === "Unpaid");
  const revenue = paid.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const recent = invoices.slice(0, 5);

  const stats = [
    { label: "INVOICES", value: String(invoices.length) },
    { label: "PAID", value: String(paid.length) },
    { label: "PENDING", value: String(pending.length) },
    { label: "REVENUE", value: formatCurrency(revenue) },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF]">

      {/* ── Stats bar ── */}
      <div
        className="bg-[#EFECE3] px-8 py-4 flex items-center"
        style={{
          borderBottomWidth: "0.5px",
          borderBottomStyle: "solid",
          borderBottomColor: "#D8D4C8",
        }}
      >
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            <div className="flex flex-col px-6">
              <span
                className="uppercase tracking-widest text-[#8A8778] mb-1"
                style={{ fontSize: "11px" }}
              >
                {stat.label}
              </span>
              <span className="text-xl font-medium text-[#0F0F0D]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {loading ? "—" : stat.value}
              </span>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: "0.5px" }} className="h-8 bg-[#D8D4C8]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── AI Insights ── */}
      {insightsLoading ? (
        <div
          className="bg-[#E8F0EB] px-8 py-3 flex items-center justify-between"
          style={{
            borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#B8D4C0",
            borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#B8D4C0",
          }}
        >
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-sm shrink-0" />
            <span className="uppercase tracking-widest text-[#2A5A38] ml-2" style={{ fontSize: "11px" }}>
              AI INSIGHTS
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {["w-48", "w-36", "w-52"].map((w, i) => (
              <div key={i} className={`${w} h-2.5 bg-[#B8D4C0] rounded animate-pulse`} />
            ))}
          </div>
        </div>
      ) : insights.length > 0 ? (
        <div
          className="bg-[#E8F0EB] px-8 py-3"
          style={{
            borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#B8D4C0",
            borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#B8D4C0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-sm shrink-0" />
              <span className="uppercase tracking-widest text-[#2A5A38]" style={{ fontSize: "11px" }}>
                AI INSIGHTS
              </span>
            </div>
            <span className="uppercase tracking-widest text-[#4A7C59]" style={{ fontSize: "11px" }}>
              POWERED BY GEMINI
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4A7C59] mt-[5px] shrink-0" />
                <span className="text-sm text-[#2A5A38] line-clamp-2 overflow-hidden">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && invoices.length === 0 ? (
        <div
          className="bg-[#E8F0EB] px-8 py-3 flex items-center justify-between"
          style={{
            borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#B8D4C0",
            borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#B8D4C0",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-sm shrink-0" />
            <span className="text-sm text-[#2A5A38]">
              Start generating invoices to unlock AI insights
            </span>
          </div>
          <span className="uppercase tracking-widest text-[#4A7C59]" style={{ fontSize: "11px" }}>
            AI POWERED
          </span>
        </div>
      ) : null}

      {/* ── Table header label ── */}
      <div className="px-8 pt-8 pb-3 flex items-center justify-between">
        <span
          className="uppercase tracking-widest text-[#8A8778] font-medium"
          style={{ fontSize: "11px" }}
        >
          RECENT INVOICES
        </span>
        <Link
          to="/invoices"
          className="uppercase tracking-widest text-[#4A7C59] font-medium hover:text-[#2A5A38] transition-colors duration-150"
          style={{ fontSize: "11px" }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* ── Column headers ── */}
      <div
        className={`bg-[#EFECE3] px-8 py-2 grid ${TABLE_COLS} items-center`}
        style={{
          borderTopWidth: "0.5px",
          borderTopStyle: "solid",
          borderTopColor: "#D8D4C8",
          borderBottomWidth: "0.5px",
          borderBottomStyle: "solid",
          borderBottomColor: "#D8D4C8",
        }}
      >
        {["CLIENT", "INVOICE #", "DATE", "AMOUNT", "STATUS", ""].map((col) => (
          <span
            key={col}
            className="uppercase tracking-widest text-[#9A9888]"
            style={{ fontSize: "11px" }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* ── Rows / loading / empty ── */}
      {loading ? (
        <SkeletonRows />
      ) : recent.length === 0 ? (
        <EmptyState />
      ) : (
        recent.map((inv) => (
          <div
            key={inv._id}
            className={`group px-8 py-3 grid ${TABLE_COLS} items-center bg-[#FDFCF8] hover:bg-[#EFECE3] transition-colors duration-150 cursor-pointer`}
            style={{
              borderBottomWidth: "0.5px",
              borderBottomStyle: "solid",
              borderBottomColor: "#ECEAE0",
            }}
          >
            <span className="text-sm font-medium text-[#0F0F0D] truncate pr-3">
              {inv.billTo?.clientName || "—"}
            </span>
            <span className="text-sm text-[#5A5848] truncate pr-3" style={MONO}>
              {inv.invoiceNumber}
            </span>
            <span className="text-sm text-[#5A5848]">
              {formatDate(inv.createdAt)}
            </span>
            <span className="text-sm text-[#0F0F0D]" style={MONO}>
              {formatCurrency(inv.total)}
            </span>
            <div className="flex items-center">
              <StatusBadge status={inv.status} />
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Link
                to={`/invoices/${inv._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-[#4A7C59] hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
