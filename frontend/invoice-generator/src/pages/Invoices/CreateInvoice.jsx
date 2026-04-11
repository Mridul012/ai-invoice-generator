import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { generateInvoiceNumber } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

const emptyItem = { name: "", quantity: 1, unitPrice: 0, taxpercent: 0 };

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

  // prefill Bill From with profile data
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

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Invoice</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-lg">

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
            <div className="p-6 md:border-r border-gray-200">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                Bill From
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={billFrom.businessName}
                    onChange={(e) => setBillFrom({ ...billFrom, businessName: e.target.value })}
                    placeholder="Your business name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={billFrom.email}
                    onChange={(e) => setBillFrom({ ...billFrom, email: e.target.value })}
                    placeholder="you@business.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Address</label>
                  <input
                    type="text"
                    value={billFrom.address}
                    onChange={(e) => setBillFrom({ ...billFrom, address: e.target.value })}
                    placeholder="Business address"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={billFrom.phone}
                    onChange={(e) => setBillFrom({ ...billFrom, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                Bill To
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={billTo.clientName}
                    onChange={(e) => setBillTo({ ...billTo, clientName: e.target.value })}
                    placeholder="Client's full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email *</label>
                  <input
                    type="email"
                    value={billTo.email}
                    onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
                    placeholder="client@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Address</label>
                  <input
                    type="text"
                    value={billTo.address}
                    onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                    placeholder="Client address"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={billTo.phone}
                    onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Due Date
              </label>
              <input
                type="date"
                value={duedate}
                onChange={(e) => setDuedate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 w-[35%]">Name</th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 w-[13%]">Qty</th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 w-[16%]">Price (₹)</th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 w-[13%]">Tax %</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 w-[16%]">Total</th>
                    <th className="w-[7%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          placeholder="Item name"
                          className={inputClass}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                          className={inputClass}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                          className={inputClass}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          value={item.taxpercent}
                          onChange={(e) => updateItem(index, "taxpercent", e.target.value)}
                          className={inputClass}
                        />
                      </td>
                      <td className="py-2 text-right text-sm font-medium text-gray-700">
                        ₹{getItemTotal(item).toFixed(2)}
                      </td>
                      <td className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          disabled={items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Item name"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Price</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Tax %</label>
                      <input
                        type="number"
                        min="0"
                        value={item.taxpercent}
                        onChange={(e) => updateItem(index, "taxpercent", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total: ₹{getItemTotal(item).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-gray-300 hover:text-red-500"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:border-r border-gray-200">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, thank you note, etc."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="p-6 flex flex-col justify-end">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>₹{taxTotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
