import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency } from "../../utils/helper";
import toast from "react-hot-toast";
import { FileText, CheckCircle, Clock, IndianRupee, Sparkles } from "lucide-react";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL);
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const res = await axiosInstance.post(API_PATHS.AI.DASHBOARD_SUMMARY);
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error("Failed to load AI insights:", err);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
  const unpaidInvoices = invoices.filter((inv) => inv.status === "Unpaid");
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  const stats = [
    {
      label: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Paid",
      value: paidInvoices.length,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pending",
      value: unpaidInvoices.length,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">AI Insights</h2>
        </div>

        <div className="px-5 py-4">
          {insightsLoading ? (
            <p className="text-sm text-gray-400 animate-pulse">
              Generating insights...
            </p>
          ) : insights.length === 0 ? (
            <p className="text-sm text-gray-400">No insights available</p>
          ) : (
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
        </div>

        {invoices.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            No invoices yet. Create your first invoice to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Invoice #</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {inv.billTo?.clientName || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          inv.status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
