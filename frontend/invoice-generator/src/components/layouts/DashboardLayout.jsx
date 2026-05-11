import React from "react";
import TopBar from "../ui/TopBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F7F5EF] overflow-hidden">
      <TopBar />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
