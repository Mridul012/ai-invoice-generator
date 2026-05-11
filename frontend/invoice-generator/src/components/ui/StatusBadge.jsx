import React from "react";

const STATUS_MAP = {
  Paid:    { cls: "text-[#2A5A38] bg-[#D4EAD8]", border: "#A8D0B0", label: "Paid" },
  paid:    { cls: "text-[#2A5A38] bg-[#D4EAD8]", border: "#A8D0B0", label: "Paid" },
  Unpaid:  { cls: "text-[#7A4A10] bg-[#F5EDDA]", border: "#D4B880", label: "Pending" },
  unpaid:  { cls: "text-[#7A4A10] bg-[#F5EDDA]", border: "#D4B880", label: "Pending" },
  pending: { cls: "text-[#7A4A10] bg-[#F5EDDA]", border: "#D4B880", label: "Pending" },
  Pending: { cls: "text-[#7A4A10] bg-[#F5EDDA]", border: "#D4B880", label: "Pending" },
  overdue: { cls: "text-[#7A2020] bg-[#F5E4E4]", border: "#D4A0A0", label: "Overdue" },
  Overdue: { cls: "text-[#7A2020] bg-[#F5E4E4]", border: "#D4A0A0", label: "Overdue" },
  draft:   { cls: "text-[#5A5848] bg-[#EFECE3]", border: "#D8D4C8", label: "Draft" },
  Draft:   { cls: "text-[#5A5848] bg-[#EFECE3]", border: "#D8D4C8", label: "Draft" },
};

const FALLBACK = { cls: "text-[#5A5848] bg-[#EFECE3]", border: "#D8D4C8", label: "Draft" };

const StatusBadge = ({ status }) => {
  const { cls, border, label } = STATUS_MAP[status] || FALLBACK;
  return (
    <span
      className={`w-fit inline-block text-[9px] font-medium uppercase tracking-[0.07em] px-2 py-0.5 rounded-[4px] ${cls}`}
      style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: border }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
