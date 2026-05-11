import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";
import StatusBadge from "../../components/ui/StatusBadge";

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const COL = "flex items-center";

const rowBorder = {
  borderBottomWidth: "0.5px",
  borderBottomStyle: "solid",
  borderBottomColor: "#ECEAE0",
};

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className="text-[#8A8778] shrink-0"
  >
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <line
      x1="9.5"
      y1="9.5"
      x2="12.5"
      y2="12.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className="text-[#8A8778] shrink-0"
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyDoc = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect
      x="6"
      y="3"
      width="28"
      height="34"
      rx="3"
      stroke="#D8D4C8"
      strokeWidth="1.5"
      fill="none"
    />
    <line
      x1="12"
      y1="14"
      x2="28"
      y2="14"
      stroke="#ECEAE0"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="20"
      x2="24"
      y2="20"
      stroke="#ECEAE0"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="26"
      x2="20"
      y2="26"
      stroke="#ECEAE0"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SkeletonRows = () => (
  <>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="px-8 py-3.5 flex items-center gap-6 animate-pulse bg-[#FDFCF8]"
        style={rowBorder}
      >
        <div className="h-3 bg-[#EFECE3] rounded flex-1 max-w-[128px]" />
        <div className="h-3 bg-[#EFECE3] rounded w-28" />
        <div className="h-3 bg-[#EFECE3] rounded w-20" />
        <div className="h-3 bg-[#EFECE3] rounded w-16" />
        <div className="h-3 bg-[#EFECE3] rounded w-14" />
        <div className="h-3 bg-[#EFECE3] rounded w-12" />
      </div>
    ))}
  </>
);

const selectStyle = {
  backgroundColor: "#FDFCF8",
  borderWidth: "0.5px",
  borderStyle: "solid",
  borderColor: "#D8D4C8",
};

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL);
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filtered = invoices
    .filter((inv) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.billTo?.clientName?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortOrder === "newest" ? db - da : da - db;
    });

  const hasAnyInvoices = invoices.length > 0;
  const isFiltering = searchTerm || statusFilter !== "All";

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF]">

      {/* ── Page header ── */}
      <div className="px-8 pt-8 pb-5 flex items-end justify-between">
        <div>
          <p
            className="uppercase tracking-widest text-[#8A8778] font-medium mb-1"
            style={{ fontSize: "11px" }}
          >
            INVOICES
          </p>
          <p className="text-2xl font-medium text-[#0F0F0D] leading-none">
            <span style={MONO}>{loading ? "—" : filtered.length}</span>
            <span className="text-lg ml-2 text-[#5A5848]">
              {filtered.length === 1 ? "invoice" : "invoices"}
            </span>
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="text-xs px-4 py-2 bg-[#4A7C59] text-white rounded-md hover:bg-[#3d6b4a] transition-colors duration-150 font-medium"
        >
          + New invoice
        </Link>
      </div>

      {/* ── Filter bar ── */}
      <div
        className="bg-[#EFECE3] px-8 py-3 flex items-center gap-4"
        style={{
          borderTopWidth: "0.5px",
          borderTopStyle: "solid",
          borderTopColor: "#D8D4C8",
          borderBottomWidth: "0.5px",
          borderBottomStyle: "solid",
          borderBottomColor: "#D8D4C8",
        }}
      >
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 rounded-md px-3 py-2" style={selectStyle}>
          <SearchIcon />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client or invoice #…"
            className="flex-1 text-sm text-[#0F0F0D] placeholder:text-[#9A9888] bg-transparent outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#9A9888] hover:text-[#5A5848] transition-colors duration-150 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="relative w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-md px-3 py-2 text-sm text-[#0F0F0D] pr-7 outline-none"
            style={selectStyle}
          >
            <option value="All">All status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <ChevronIcon />
          </div>
        </div>

        {/* Sort */}
        <div className="relative w-44">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full appearance-none rounded-md px-3 py-2 text-sm text-[#0F0F0D] pr-7 outline-none"
            style={selectStyle}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div
        className="bg-[#EFECE3] px-8 py-2 flex items-center"
        style={{
          borderBottomWidth: "0.5px",
          borderBottomStyle: "solid",
          borderBottomColor: "#D8D4C8",
        }}
      >
        {[
          { label: "CLIENT", cls: "flex-1" },
          { label: "INVOICE #", cls: "w-44" },
          { label: "DATE", cls: "w-36" },
          { label: "AMOUNT", cls: "w-36" },
          { label: "STATUS", cls: "w-28" },
          { label: "", cls: "w-24" },
        ].map(({ label, cls }) => (
          <span
            key={label}
            className={`${cls} uppercase tracking-widest text-[#9A9888] font-medium`}
            style={{ fontSize: "11px" }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* ── Rows / states ── */}
      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <EmptyDoc />
          <p className="text-sm font-medium text-[#5A5848]">No invoices found</p>
          <p className="text-xs text-[#8A8778] text-center max-w-xs leading-relaxed">
            {isFiltering
              ? "Try a different search term or clear filters"
              : "Generate your first invoice from the workspace"}
          </p>
          {!isFiltering && (
            <Link
              to="/workspace"
              className="mt-1 text-xs px-4 py-2 bg-[#4A7C59] text-white rounded-md hover:bg-[#3d6b4a] transition-colors duration-150"
            >
              Generate your first invoice →
            </Link>
          )}
          {isFiltering && (
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
              className="mt-1 text-xs px-4 py-2 text-[#4A7C59] hover:underline transition-colors duration-150"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        filtered.map((inv) => (
          <div
            key={inv._id}
            className="group px-8 py-3.5 flex items-center bg-[#FDFCF8] hover:bg-[#EFECE3] transition-colors duration-150 cursor-pointer"
            style={rowBorder}
            onClick={() => window.location.assign(`/invoices/${inv._id}`)}
          >
            {/* CLIENT */}
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-medium text-[#0F0F0D] truncate">
                {inv.billTo?.clientName || "—"}
              </p>
              {inv.billTo?.email && (
                <p className="text-xs text-[#8A8778] truncate">{inv.billTo.email}</p>
              )}
            </div>

            {/* INVOICE # */}
            <div className="w-44 pr-4">
              <span className="text-sm text-[#5A5848]" style={MONO}>
                {inv.invoiceNumber}
              </span>
            </div>

            {/* DATE */}
            <div className="w-36 pr-4">
              <span className="text-sm text-[#5A5848]">
                {formatDate(inv.createdAt)}
              </span>
            </div>

            {/* AMOUNT */}
            <div className="w-36 pr-4">
              <span className="text-sm font-medium text-[#0F0F0D]" style={MONO}>
                {formatCurrency(inv.total)}
              </span>
            </div>

            {/* STATUS */}
            <div className="w-28 pr-4">
              <StatusBadge status={inv.status} />
            </div>

            {/* ACTIONS — hover reveal */}
            <div className="w-24 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Link
                to={`/invoices/${inv._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-[#4A7C59] hover:underline"
              >
                View
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.print();
                }}
                className="text-xs text-[#8A8778] hover:text-[#4A7C59] transition-colors duration-150"
              >
                Print
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllInvoices;
