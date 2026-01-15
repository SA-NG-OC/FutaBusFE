"use client";
import React, { useState } from "react";
import styles from "./TicketLookup.module.css";
import { Search } from "lucide-react";

type SearchMethod = "email" | "phone" | "code";

interface TicketLookupProps {
  onSearch?: (searchData: { method: SearchMethod; value: string }) => void;
}

export default function TicketLookup({ onSearch }: TicketLookupProps) {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>("code");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let value = "";
    if (searchMethod === "email") value = email;
    else if (searchMethod === "phone") value = phone;
    else value = ticketCode;

    if (onSearch && value.trim()) {
      onSearch({ method: searchMethod, value: value.trim() });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tra Cứu Vé</h1>
        <p className={styles.subtitle}>
          Tra cứu thông tin vé xe của bạn bằng mã vé, số điện thoại hoặc email
        </p>
      </div>

      <div className={styles.searchBox}>
        <div className={styles.searchHeader}>
          <Search className={styles.searchIcon} size={20} />
          <h3 className={styles.searchTitle}>Tìm kiếm vé</h3>
        </div>
        <p className={styles.searchSubtitle}>
          Chọn phương thức tra cứu và nhập thông tin
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Nhập email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSearchMethod("email");
              }}
              onFocus={() => setSearchMethod("email")}
            />
          </div>

          {/* Phone Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Số điện thoại<span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              className={styles.input}
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSearchMethod("phone");
              }}
              onFocus={() => setSearchMethod("phone")}
            />
          </div>

          {/* Ticket Code Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Mã vé<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập mã vé (VD: TK-2024-001234)"
              value={ticketCode}
              onChange={(e) => {
                setTicketCode(e.target.value);
                setSearchMethod("code");
              }}
              onFocus={() => setSearchMethod("code")}
            />
          </div>

          <p className={styles.note}>
            Mã vé được gửi qua email sau khi đặt vé thành công
          </p>

          <button type="submit" className={styles.submitButton}>
            <Search size={20} />
            Tra cứu
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <div className={styles.instructionsHeader}>
          <div className={styles.iconCircle}>
            <span className={styles.infoIcon}>i</span>
          </div>
          <h3 className={styles.instructionsTitle}>Hướng dẫn tra cứu</h3>
        </div>

        <div className={styles.instructionsList}>
          <div className={styles.instructionItem}>
            <h4 className={styles.instructionTitle}>Tra cứu bằng mã vé:</h4>
            <p className={styles.instructionText}>
              Mã vé có dạng TK-2024-XXXXXX được gửi qua email sau khi đặt vé
              thành công.
            </p>
          </div>

          <div className={styles.instructionItem}>
            <h4 className={styles.instructionTitle}>
              Tra cứu bằng số điện thoại:
            </h4>
            <p className={styles.instructionText}>
              Nhập số điện thoại đã sử dụng khi đặt vé. Hệ thống sẽ hiển thị
              danh sách vé liên quan.
            </p>
          </div>

          <div className={styles.instructionItem}>
            <h4 className={styles.instructionTitle}>Tra cứu bằng email:</h4>
            <p className={styles.instructionText}>
              Nhập địa chỉ email đã sử dụng khi đặt vé để xem tất cả vé của bạn.
            </p>
          </div>
        </div>

        <div className={styles.demo}>
          <strong>Demo:</strong> Sử dụng mã vé{" "}
          <code className={styles.demoCode}>TK-2024-001234</code> để xem thông
          tin vé mẫu.
        </div>
      </div>
    </div>
  );
}
