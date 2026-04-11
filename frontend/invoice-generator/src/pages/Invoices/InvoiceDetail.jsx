import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Mail, X, Copy, Printer } from "lucide-react";

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleGenerateEmail}
            disabled={generatingEmail}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {generatingEmail ? "Generating..." : "Reminder Email"}
          </button>
          <button
            onClick={toggleStatus}
            className={`text-sm font-medium px-4 py-2 rounded-lg ${
              invoice.status === "Paid"
                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            Mark as {invoice.status === "Paid" ? "Unpaid" : "Paid"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="print-area bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Created: {formatDate(invoice.createdAt, "long")}
              </p>
              {invoice.duedate && (
                <p className="text-sm text-gray-500">
                  Due: {formatDate(invoice.duedate, "long")}
                </p>
              )}
            </div>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${
                invoice.status === "Paid"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
          <div className="p-6 md:border-r border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              From
            </h3>
            <p className="text-sm font-medium text-gray-800">
              {invoice.billFrom?.businessName || "—"}
            </p>
            {invoice.billFrom?.email && (
              <p className="text-sm text-gray-500">{invoice.billFrom.email}</p>
            )}
            {invoice.billFrom?.address && (
              <p className="text-sm text-gray-500">{invoice.billFrom.address}</p>
            )}
            {invoice.billFrom?.phone && (
              <p className="text-sm text-gray-500">{invoice.billFrom.phone}</p>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              To
            </h3>
            <p className="text-sm font-medium text-gray-800">
              {invoice.billTo?.clientName || "—"}
            </p>
            {invoice.billTo?.email && (
              <p className="text-sm text-gray-500">{invoice.billTo.email}</p>
            )}
            {invoice.billTo?.address && (
              <p className="text-sm text-gray-500">{invoice.billTo.address}</p>
            )}
            {invoice.billTo?.phone && (
              <p className="text-sm text-gray-500">{invoice.billTo.phone}</p>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Items
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Qty</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Tax %</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-3 text-gray-800">{item.name}</td>
                    <td className="px-6 py-3 text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-3 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-3 text-gray-600">{item.taxpercent || 0}%</td>
                    <td className="px-6 py-3 text-gray-800 text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:border-r border-gray-200">
            {invoice.notes && (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </>
            )}
          </div>

          <div className="p-6 flex flex-col justify-end">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>{formatCurrency(invoice.taxTotal)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">
                Payment Reminder Email
              </h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {emailText}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
