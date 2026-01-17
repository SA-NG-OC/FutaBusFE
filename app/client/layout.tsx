import React from "react";
import ClientHeader from "@/src/components/ClientHeader/ClientHeader";
import { WebSocketProvider } from "@/src/context/WebSocketContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WebSocketProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "var(--background)",
        }}
      >
        {/* Header luôn nằm trên cùng */}
        <ClientHeader />

        {/* Phần nội dung chính sẽ thay đổi */}
        {/* <main
          style={{
            flex: 1 ,
            width: "100%",
            maxWidth:
              "1440px" ,
            margin: "0 auto" ,
            padding: "32px 64px" ,
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          {children}
          </main> */}
        <main>{children}</main>

        {/* Bạn có thể thêm <ClientFooter /> ở đây sau này */}
      </div>
    </WebSocketProvider>
  );
}
