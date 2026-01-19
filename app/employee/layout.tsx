import React from "react";
// Đảm bảo đường dẫn import đúng
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
        // QUAN TRỌNG: Đổi minHeight thành height và đệm overflow hidden
        // Để khóa chiều cao app bằng đúng màn hình thiết bị
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "var(--background)",
      }}
    >
      {/* 1. Sidebar: Sẽ đứng yên vì container cha đã fixed height */}
      <AdminSidebar role="employee" />

      {/* 2. Main Area Wrapper */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--background)",
          height: "100%", // Chiếm toàn bộ chiều cao còn lại
          overflow: "hidden", // Ngăn scroll ở wrapper này
        }}
      >
        <EmployeeHeader />

        {/* 3. Nội dung chính: Đây là nơi DUY NHẤT được cuộn */}
        <main
          style={{
            flex: 1,
            // Padding 32px sẽ tạo khoảng cách đều 4 phía (bao gồm 2 bên)
            padding: "32px",
            // Tạo thanh cuộn riêng cho nội dung
            overflowY: "auto",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
        >
          {/* Để nội dung không bị dính sát mép khi resize nhỏ, 
              có thể bọc children trong 1 div max-width nếu muốn (optional) */}
          <div style={{ minHeight: "100%" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}