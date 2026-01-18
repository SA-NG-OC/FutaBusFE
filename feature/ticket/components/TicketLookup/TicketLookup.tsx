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
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    ticketCode: "",
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return true; // Empty is ok
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Empty is ok
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateTicketCode = (code: string): boolean => {
    if (!code.trim()) return true; // Empty is ok
    // Format: TK + 8 digits for date (YYYYMMDD) + 3 digits for sequence
    // Example: TK20260117024
    const ticketCodeRegex = /^TK\d{11}$/;
    return ticketCodeRegex.test(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", phone: "", ticketCode: "" });

    let value = "";
    let isValid = true;

    if (searchMethod === "email") {
      value = email;
      if (!validateEmail(email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email phải có dạng @gmail.com",
        }));
        isValid = false;
      }
    } else if (searchMethod === "phone") {
      value = phone;
      if (!validatePhone(phone)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Số điện thoại không hợp lệ (VD: 0912345678)",
        }));
        isValid = false;
      }
    } else {
      value = ticketCode;
      if (!validateTicketCode(ticketCode)) {
        setErrors((prev) => ({
          ...prev,
          ticketCode: "Mã vé phải có dạng TK + 11 chữ số (VD: TK20260117024)",
        }));
        isValid = false;
      }
    }

    if (isValid && onSearch && value.trim()) {
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
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="Nhập email (@gmail.com)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSearchMethod("email");
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onFocus={() => setSearchMethod("email")}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Phone Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại</label>
            <input
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              placeholder="Nhập số điện thoại (VD: 0912345678)"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSearchMethod("phone");
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              onFocus={() => setSearchMethod("phone")}
            />
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
          </div>

          {/* Ticket Code Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mã vé</label>
            <input
              type="text"
              className={`${styles.input} ${errors.ticketCode ? styles.inputError : ""}`}
              placeholder="Nhập mã vé (VD: TK20260117024)"
              value={ticketCode}
              onChange={(e) => {
                setTicketCode(e.target.value);
                setSearchMethod("code");
                if (errors.ticketCode)
                  setErrors((prev) => ({ ...prev, ticketCode: "" }));
              }}
              onFocus={() => setSearchMethod("code")}
            />
            {errors.ticketCode && (
              <p className={styles.errorText}>{errors.ticketCode}</p>
            )}
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
              Mã vé có dạng TK + 11 chữ số (VD: TK20260117024) được gửi qua
              email sau khi đặt vé thành công.
            </p>
          </div>

          <div className={styles.instructionItem}>
            <h4 className={styles.instructionTitle}>
              Tra cứu bằng số điện thoại:
            </h4>
            <p className={styles.instructionText}>
              Nhập số điện thoại Việt Nam hợp lệ (10 chữ số, bắt đầu bằng 0). Hệ
              thống sẽ hiển thị danh sách vé liên quan.
            </p>
          </div>

          <div className={styles.instructionItem}>
            <h4 className={styles.instructionTitle}>Tra cứu bằng email:</h4>
            <p className={styles.instructionText}>
              Nhập địa chỉ Gmail (@gmail.com) đã sử dụng khi đặt vé để xem tất
              cả vé của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
