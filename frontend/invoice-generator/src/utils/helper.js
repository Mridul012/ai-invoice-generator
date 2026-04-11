export const formatDate = (date, format = "short") => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  if (format === "long") {
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (format === "input") {
    return d.toISOString().split("T")[0];
  }

  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const generateInvoiceNumber = () => {
  const now = new Date();
  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${random}`;
};

export const getStatusBadgeClasses = (status) => {
  if (status === "Paid") return "bg-green-50 text-green-700 border border-green-200";
  if (status === "Unpaid") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  return "bg-gray-50 text-gray-700 border border-gray-200";
};

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
