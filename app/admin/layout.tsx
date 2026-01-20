import React from "react";
import AdminSidebar from "../../src/components/AdminSidebar/AdminSidebar";
import AdminHeader from "../../src/components/AdminHeader/AdminHeader";
import styles from "./admin.module.css";

import { WebSocketProvider } from "@/src/context/WebSocketContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // [FIX] Xóa prop userId, chỉ để lại children
    <WebSocketProvider>
      <div className={styles.container}>
        {/* 1. Sidebar */}
        <AdminSidebar role="admin" />

        {/* 2. Main Area */}
        <div className={styles["main-area"]}>
          {/* Header */}
          <AdminHeader />

          {/* Nội dung thay đổi */}
          <main className={styles["content-area"]}>{children}</main>
        </div>
      </div>
    </WebSocketProvider>
  );
}
