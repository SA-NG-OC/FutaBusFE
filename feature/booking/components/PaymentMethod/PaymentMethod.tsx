"use client";
import React, { useState } from "react";
import styles from "./PaymentMethod.module.css";

interface PaymentMethodProps {
  onMethodChange?: (method: string) => void;
}

export default function PaymentMethod({ onMethodChange }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState("credit");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    if (onMethodChange) {
      onMethodChange(method);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Payment Method</h3>

      <div className={styles.methods}>
        <label className={styles.methodOption}>
          <input
            type="radio"
            name="payment"
            value="credit"
            checked={selectedMethod === "credit"}
            onChange={(e) => handleMethodChange(e.target.value)}
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>💳</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>Credit/Debit Card</div>
              <div className={styles.methodDesc}>Visa, Mastercard, JCB</div>
            </div>
          </div>
        </label>

        <label className={styles.methodOption}>
          <input
            type="radio"
            name="payment"
            value="ewallet"
            checked={selectedMethod === "ewallet"}
            onChange={(e) => handleMethodChange(e.target.value)}
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>📱</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>E-Wallet</div>
              <div className={styles.methodDesc}>Momo, ZaloPay, VNPay</div>
            </div>
          </div>
        </label>

        <label className={styles.methodOption}>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={selectedMethod === "bank"}
            onChange={(e) => handleMethodChange(e.target.value)}
          />
          <div className={styles.methodContent}>
            <div className={styles.methodIcon}>🏦</div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>Bank Transfer</div>
              <div className={styles.methodDesc}>Direct bank transfer</div>
            </div>
          </div>
        </label>
      </div>

      {selectedMethod === "credit" && (
        <div className={styles.cardForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Card Number</label>
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
              <label className={styles.label}>Expiry Date</label>
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
    </div>
  );
}
