import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`max-w-[1440px] mx-auto py-8 px-16 ${className || ""}`}>
      {children}
    </main>
  );
}
