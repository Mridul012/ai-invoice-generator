import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
const border = (color = "#D8D4C8") => ({ borderWidth: "0.5px", borderStyle: "solid", borderColor: color });

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [emailText, setEmailText] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.INVOICES.GET_BY_ID(id));
        setInvoice(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load invoice");
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  const toggleStatus = async () => {
    const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    try {
      const res = await axiosInstance.put(API_PATHS.INVOICES.UPDATE(id), {
        status: newStatus,
      });
      setInvoice(res.data);
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;

    try {
      await axiosInstance.delete(API_PATHS.INVOICES.DELETE(id));
      toast.success("Invoice deleted");
      navigate("/invoices");
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    setEmailText("");

    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, {
        invoiceId: invoice._id,
      });

      const generated = res.data?.email;
      if (!generated) {
        toast.error("No email content returned");
        return;
      }

      setEmailText(generated);
      setShowEmailModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate reminder email");
    } finally {
      setGeneratingEmail(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: "#F7F5EF" }}>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="rounded-lg overflow-hidden animate-pulse" style={{ backgroundColor: "#FDFCF8", ...border() }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6" style={{ borderBottom: "0.5px solid #D8D4C8" }}>
                <div className="h-3 rounded w-1/4 mb-3" style={{ backgroundColor: "#EFECE3" }} />
                <div className="h-4 rounded w-2/3" style={{ backgroundColor: "#E8E4DA" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const isPaid = invoice.status === "Paid";
  const statusStyle = isPaid
    ? { backgroundColor: "#E8F0EB", color: "#2A5A38", borderColor: "#B8D4C0" }
    : { backgroundColor: "#F5E4E4", color: "#7A2020", borderColor: "#D4A0A0" };
  const toggleStyle = isPaid
    ? { backgroundColor: "#F5EDDA", color: "#7A4A10", borderColor: "#D4B880" }
    : { backgroundColor: "#E8F0EB", color: "#2A5A38", borderColor: "#B8D4C0" };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: "#F7F5EF" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <p className="uppercase tracking-widest text-[#8A8778]" style={{ fontSize: "11px" }}>
            Invoices / Detail
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => window.print()}
              className="text-[12px] text-[#5A5848] rounded-md px-4 py-2 hover:text-[#0F0F0D] transition-colors"
              style={{ ...border() }}
            >
              Print
            </button>
            <button
              onClick={handleGenerateEmail}
              disabled={generatingEmail}
              className="text-[12px] text-[#5A5848] rounded-md px-4 py-2 hover:text-[#0F0F0D] transition-colors disabled:opacity-40"
              style={{ ...border() }}
            >
              {generatingEmail ? "Generating…" : "Reminder email"}
            </button>
            <button
              onClick={toggleStatus}
              className="text-[12px] font-medium rounded-md px-4 py-2 transition-colors"
              style={{
                borderWidth: "0.5px",
                borderStyle: "solid",
                borderColor: toggleStyle.borderColor,
                backgroundColor: toggleStyle.backgroundColor,
                color: toggleStyle.color,
              }}
            >
              Mark as {isPaid ? "Unpaid" : "Paid"}
            </button>
            <button
              onClick={handleDelete}
              className="text-[12px] text-[#8A8778] hover:text-[#7A2020] transition-colors px-3 py-2"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Invoice document */}
        <div className="print-area rounded-lg overflow-hidden" style={{ backgroundColor: "#FDFCF8", ...border() }}>

          {/* Invoice header */}
          <div className="p-6" style={{ borderBottom: "0.5px solid #D8D4C8" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="uppercase tracking-widest text-[#8A8778] mb-1" style={{ fontSize: "10px" }}>
                  Invoice
                </p>
                <p className="text-lg text-[#0F0F0D] font-medium" style={MONO}>
                  {invoice.invoiceNumber}
                </p>
                <p className="text-sm text-[#5A5848] mt-2">
                  Issued {formatDate(invoice.createdAt, "long")}
                </p>
                {invoice.duedate && (
                  <p className="text-sm text-[#5A5848]">
                    Due {formatDate(invoice.duedate, "long")}
                  </p>
                )}
              </div>
              <span
                className="text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded"
                style={{
                  ...border(statusStyle.borderColor),
                  backgroundColor: statusStyle.backgroundColor,
                  color: statusStyle.color,
                }}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2" style={{ borderBottom: "0.5px solid #D8D4C8" }}>
            <div className="p-6" style={{ borderRight: "0.5px solid #D8D4C8" }}>
              <p className="uppercase tracking-widest text-[#8A8778] mb-3" style={{ fontSize: "11px" }}>
                From
              </p>
              <p className="text-sm font-medium text-[#0F0F0D]">
                {invoice.billFrom?.businessName || "—"}
              </p>
              {invoice.billFrom?.email && (
                <p className="text-sm text-[#5A5848]">{invoice.billFrom.email}</p>
              )}
              {invoice.billFrom?.address && (
                <p className="text-sm text-[#5A5848]">{invoice.billFrom.address}</p>
              )}
              {invoice.billFrom?.phone && (
                <p className="text-sm text-[#5A5848]">{invoice.billFrom.phone}</p>
              )}
            </div>
            <div className="p-6">
              <p className="uppercase tracking-widest text-[#8A8778] mb-3" style={{ fontSize: "11px" }}>
                To
              </p>
              <p className="text-sm font-medium text-[#0F0F0D]">
                {invoice.billTo?.clientName || "—"}
              </p>
              {invoice.billTo?.email && (
                <p className="text-sm text-[#5A5848]">{invoice.billTo.email}</p>
              )}
              {invoice.billTo?.address && (
                <p className="text-sm text-[#5A5848]">{invoice.billTo.address}</p>
              )}
              {invoice.billTo?.phone && (
                <p className="text-sm text-[#5A5848]">{invoice.billTo.phone}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div style={{ borderBottom: "0.5px solid #D8D4C8" }}>
            <div className="px-6 pt-5 pb-3">
              <p className="uppercase tracking-widest text-[#8A8778]" style={{ fontSize: "11px" }}>
                Items
              </p>
            </div>

            <div
              className="grid px-6 py-2"
              style={{
                gridTemplateColumns: "3fr 1fr 1.3fr 1fr 1.3fr",
                backgroundColor: "#F0EDE4",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8A8778",
              }}
            >
              <span>Description</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Tax</span>
              <span className="text-right">Total</span>
            </div>

            {invoice.items?.map((item, index) => (
              <div
                key={index}
                className="grid px-6 py-3"
                style={{
                  gridTemplateColumns: "3fr 1fr 1.3fr 1fr 1.3fr",
                  borderTop: "0.5px solid #EFECE3",
                }}
              >
                <span className="text-sm text-[#0F0F0D]">{item.name}</span>
                <span className="text-sm text-[#5A5848]" style={MONO}>{item.quantity}</span>
                <span className="text-sm text-[#5A5848]" style={MONO}>{formatCurrency(item.unitPrice)}</span>
                <span className="text-sm text-[#5A5848]" style={MONO}>{item.taxpercent || 0}%</span>
                <span className="text-sm text-right font-medium text-[#0F0F0D]" style={MONO}>
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>

          {/* Notes + Subtotals */}
          <div className="grid grid-cols-2" style={{ borderBottom: "0.5px solid #D8D4C8" }}>
            <div className="p-6" style={{ borderRight: "0.5px solid #D8D4C8" }}>
              {invoice.notes && (
                <>
                  <p className="uppercase tracking-widest text-[#8A8778] mb-2" style={{ fontSize: "11px" }}>
                    Notes
                  </p>
                  <p className="text-sm text-[#5A5848] leading-relaxed">{invoice.notes}</p>
                </>
              )}
            </div>

            <div className="p-6 flex flex-col justify-end">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-[#5A5848]">
                  <span>Subtotal</span>
                  <span style={MONO}>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A5848]">
                  <span>Tax</span>
                  <span style={MONO}>{formatCurrency(invoice.taxTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width total bar */}
          <div className="bg-[#0F0F0D] px-8 py-4 flex justify-between items-center">
            <span className="uppercase tracking-widest text-[#A8A498]" style={{ fontSize: "11px" }}>
              TOTAL DUE
            </span>
            <span className="text-xl font-medium text-[#F0EDE4]" style={MONO}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>

        <div className="pb-8" />
      </div>

      {/* Reminder email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
          <div
            className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-lg overflow-hidden"
            style={{ backgroundColor: "#FDFCF8", ...border() }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "0.5px solid #D8D4C8" }}
            >
              <p className="uppercase tracking-widest text-[#8A8778]" style={{ fontSize: "11px" }}>
                Reminder Email
              </p>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-[#8A8778] hover:text-[#0F0F0D] transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              <pre className="text-sm text-[#0F0F0D] whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "inherit" }}>
                {emailText}
              </pre>
            </div>

            <div
              className="flex items-center justify-end gap-3 px-6 py-4"
              style={{ borderTop: "0.5px solid #D8D4C8" }}
            >
              <button
                onClick={handleCopyEmail}
                className="bg-[#4A7C59] text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-[#3d6b4a] transition-colors"
              >
                Copy to clipboard
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-sm text-[#5A5848] rounded-md px-4 py-2 hover:text-[#0F0F0D] transition-colors"
                style={{ ...border() }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
