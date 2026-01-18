"use client";
import React, { useState } from "react";
import styles from "./PaymentMethod.module.css";

export type PaymentMethodType = "credit" | "momo" | "zalopay" | "vnpay" | "bank" | "bypass";

interface PaymentMethodProps {
  onMethodChange?: (method: PaymentMethodType) => void;
  selectedMethod?: PaymentMethodType;
}

export default function PaymentMethod({ 
  onMethodChange,
  selectedMethod: controlledMethod 
}: PaymentMethodProps) {
  const [internalMethod, setInternalMethod] = useState<PaymentMethodType>("momo");
  const selectedMethod = controlledMethod ?? internalMethod;
  
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleMethodChange = (method: PaymentMethodType) => {
    setInternalMethod(method);
    if (onMethodChange) {
      onMethodChange(method);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Phương thức thanh toán</h3>

      <div className={styles.methods}>
        {/* Bypass Payment - For Testing/Demo */}
        <label className={`${styles.methodOption} ${selectedMethod === "bypass" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="bypass"
            checked={selectedMethod === "bypass"}
            onChange={() => handleMethodChange("bypass")}
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>⚡</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                Thanh toán nhanh (Demo)
                <span className={styles.recommended}>Thử nghiệm</span>
              </div>
              <div className={styles.methodDesc}>Bỏ qua thanh toán, xác nhận vé ngay</div>
            </div>
          </div>
        </label>

        {/* MoMo - Highlighted as recommended */}
        <label className={`${styles.methodOption} ${selectedMethod === "momo" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="momo"
            checked={selectedMethod === "momo"}
            onChange={() => handleMethodChange("momo")}
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                alt="MoMo" 
                width={32} 
                height={32}
                style={{ borderRadius: 6 }}
              />
            </div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                Ví MoMo
                <span className={styles.recommended}>Khuyên dùng</span>
              </div>
              <div className={styles.methodDesc}>Thanh toán nhanh chóng qua ví MoMo</div>
            </div>
          </div>
        </label>

        {/* ZaloPay */}
        <label className={`${styles.methodOption} ${selectedMethod === "zalopay" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="zalopay"
            checked={selectedMethod === "zalopay"}
            onChange={() => handleMethodChange("zalopay")}
            disabled
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>
              <img 
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" 
                alt="ZaloPay" 
                width={32} 
                height={32}
                style={{ borderRadius: 6 }}
              />
            </div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                ZaloPay
                <span className={styles.comingSoon}>Sắp ra mắt</span>
              </div>
              <div className={styles.methodDesc}>Thanh toán qua ví ZaloPay</div>
            </div>
          </div>
        </label>

        {/* VNPay */}
        <label className={`${styles.methodOption} ${selectedMethod === "vnpay" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={selectedMethod === "vnpay"}
            onChange={() => handleMethodChange("vnpay")}
            disabled
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>
              <img 
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" 
                alt="VNPay" 
                width={32} 
                height={32}
                style={{ borderRadius: 6 }}
              />
            </div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                VNPay
                <span className={styles.comingSoon}>Sắp ra mắt</span>
              </div>
              <div className={styles.methodDesc}>Thanh toán qua VNPay QR</div>
            </div>
          </div>
        </label>

        {/* Credit Card */}
        <label className={`${styles.methodOption} ${selectedMethod === "credit" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="credit"
            checked={selectedMethod === "credit"}
            onChange={() => handleMethodChange("credit")}
            disabled
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>💳</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                Thẻ tín dụng/ghi nợ
                <span className={styles.comingSoon}>Sắp ra mắt</span>
              </div>
              <div className={styles.methodDesc}>Visa, Mastercard, JCB</div>
            </div>
          </div>
        </label>

        {/* Bank Transfer */}
        <label className={`${styles.methodOption} ${selectedMethod === "bank" ? styles.selected : ""}`}>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={selectedMethod === "bank"}
            onChange={() => handleMethodChange("bank")}
            disabled
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>🏦</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>
                Chuyển khoản ngân hàng
                <span className={styles.comingSoon}>Sắp ra mắt</span>
              </div>
              <div className={styles.methodDesc}>Chuyển khoản trực tiếp</div>
            </div>
          </div>
        </label>
      </div>

      {selectedMethod === "credit" && (
        <div className={styles.cardForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Số thẻ</label>
            <input
              type="text"
              className={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) =>
                setCardData({ ...cardData, number: e.target.value })
              }
              maxLength={19}
            />
          </div>

          <div className={styles.cardRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày hết hạn</label>
              <input
                type="text"
                className={styles.input}
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry: e.target.value })
                }
                maxLength={5}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>CVV</label>
              <input
                type="text"
                className={styles.input}
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData({ ...cardData, cvv: e.target.value })
                }
                maxLength={4}
              />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "momo" && (
        <div className={styles.momoInfo}>
          <div className={styles.momoNote}>
            <span className={styles.infoIcon}>ℹ️</span>
            <p>
              Sau khi nhấn <strong>Xác nhận thanh toán</strong>, bạn sẽ được chuyển đến 
              trang thanh toán MoMo để hoàn tất giao dịch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
