import React from "react";
import styles from "./BookingFail.module.css";
import { useRouter } from "next/navigation";

type Props = {
  isOpen?: boolean;
  error?: string;
  reference?: string;
  onClose?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

export default function BookingFalse({
  isOpen = true,
  error = "Payment could not be processed. Please try again or check your payment details.",
  reference = "ERR-402",
  onClose,
  onRetry,
  onBack,
}: Props) {
  if (!isOpen) return null;
  const router = useRouter();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <div className={styles.icon}>✕</div>
        </div>
        <div className={styles.title}>Payment Failed!</div>
        <div className={styles.message}>{error}</div>

        <div className={styles.errorBox}>
          <div className={styles.errLabel}>Error Reference</div>
          <div className={styles.errCode}>{reference}</div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.retry}
            onClick={() => {
              // booking hoac payment retry
              router.push("/client/booking-4");
              onClose?.();
            }}
          >
            Try Again
          </button>

          <button
            className={styles.back}
            onClick={() => {
              router.push("/client/booking");
              onClose?.();
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
