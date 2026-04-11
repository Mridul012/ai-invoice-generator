import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { generateInvoiceNumber, formatCurrency } from "../../utils/helper";
import toast from "react-hot-toast";
import { Sparkles, FileText } from "lucide-react";

const AIParser = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      toast.error("Please enter some invoice text");
      return;
    }

    setLoading(true);
    setParsed(null);

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
      invoiceNumber: generateInvoiceNumber(),
      billFrom: {
        businessName: "",
        email: "",
        address: "",
        phone: "",
      },
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Invoice Generator</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
          Paste Invoice Text
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your invoice text here... For example:&#10;&#10;Client: Acme Corp&#10;Email: billing@acme.com&#10;Address: 123 Main St, Mumbai&#10;&#10;Items:&#10;- Web Development, 10 hours at ₹2000/hr&#10;- UI Design, 5 hours at ₹1500/hr"
          rows={8}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
        <button
          onClick={handleParse}
          disabled={loading || !text.trim()}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Generating..." : "Generate Invoice"}
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">AI is extracting invoice data...</p>
        </div>
      )}

      {parsed && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-700">Extracted Invoice Data</h2>
          </div>

          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Name</span>
                <p className="text-gray-800 font-medium">{parsed.clientName || "—"}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Email</span>
                <p className="text-gray-800 font-medium">{parsed.email || "—"}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Address</span>
                <p className="text-gray-800 font-medium">{parsed.address || "—"}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Items</h3>
            </div>
            {parsed.items && parsed.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Qty</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Unit Price</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-3 text-gray-800">{item.name}</td>
                        <td className="px-6 py-3 text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-3 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-6 py-3 text-gray-800 text-right font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-4 text-sm text-gray-400">No items extracted.</div>
            )}
          </div>

          <div className="px-6 py-5 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Total: </span>
              <span className="text-lg font-bold text-gray-800">
                {formatCurrency(
                  (parsed.items || []).reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  )
                )}
              </span>
            </div>

            <button
              onClick={handleCreateInvoice}
              disabled={creating}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {creating ? "Creating..." : "Create Invoice from this"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIParser;
