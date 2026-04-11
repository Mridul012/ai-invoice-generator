import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";
import { Plus, Mail, X, Copy, Search } from "lucide-react";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [emailText, setEmailText] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [generatingEmailId, setGeneratingEmailId] = useState(null);

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

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.billTo?.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleGenerateEmail = async (e, invoiceId) => {
    e.stopPropagation();
    setGeneratingEmailId(invoiceId);
    setEmailText("");

    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, {
        invoiceId,
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
      setGeneratingEmailId(null);
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <button
          onClick={() => navigate("/invoices/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-400 text-sm">
              {invoices.length === 0
                ? "No invoices found."
                : "No invoices match your search."}
            </p>
            {invoices.length === 0 && (
              <p className="text-gray-400 text-sm mt-1">
                Click "Create Invoice" to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Invoice #</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Client Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    onClick={() => navigate(`/invoices/${inv._id}`)}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {inv.billTo?.clientName || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                          inv.status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => handleGenerateEmail(e, inv._id)}
                        disabled={generatingEmailId === inv._id}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {generatingEmailId === inv._id ? "..." : "Email"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
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

export default AllInvoices;
