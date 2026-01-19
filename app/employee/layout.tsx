import React from "react";
// Đảm bảo đường dẫn import đúng đến component của bạn
import AdminSidebar from "../../src/components/AdminSidebar/AdminSidebar";
import EmployeeHeader from "../../src/components/EmployeeHeader/EmployeeHeader";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        backgroundColor: "var(--background)",
      }}
    >
      {/* 1. Sidebar: Quan trọng nhất là thêm role="employee" */}
      <AdminSidebar role="employee" />

      {/* 2. Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--background)",
        }}
      >
        <EmployeeHeader />

        {/* Nội dung chính */}
        <main
          style={{
            flex: 1,
            padding: "32px",
            overflowY: "auto",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
