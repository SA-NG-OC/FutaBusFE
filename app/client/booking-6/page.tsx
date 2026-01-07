"use client";
import BookingFalse from "@/feature/booking/components/Result/False/BookingFail";
import BookingSuccess from "@/feature/booking/components/Result/Success/BookingSuccess";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function ClientBookingResultPage() {
  const [loading, setLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") ?? undefined; // use ?status=fail to test failure

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 50 50" aria-hidden>
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="#e14b45"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <div style={{ color: "#6b7280" }}>
            Processing payment, please wait...
          </div>
        </div>
      </div>
    );
  }

  const isFail = status === "fail";

  return (
    <div>
      {isFail ? (
        <BookingFalse isOpen reference="ERR-402" />
      ) : (
        <BookingSuccess isOpen reference="BT-70981 954" />
      )}
    </div>
  );
}
