import React from "react";
import styles from "./BookingSuccess.module.css";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";

type Props = {
  isOpen?: boolean;
  reference?: string;
  onClose?: () => void;
  onViewTickets?: () => void;
};

export default function BookingSuccess({
  isOpen = true,
  reference = "BT-70981 954",
  onClose,
  onViewTickets,
}: Props) {
  const router = useRouter();
  if (!isOpen) return null;

  const parts = reference.split(" ");
  const first = parts[0] ?? reference;
  const rest = parts.slice(1).join(" ");

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <div className={styles.icon}>✓</div>
        </div>
        <div className={styles.title}>Payment Successful!</div>
        <div className={styles.message}>
          Your ticket has been booked successfully. A confirmation email has
          been sent to your email address.
        </div>

        <div className={styles.referenceBox}>
          <div className={styles.refLabel}>Booking Reference</div>
          <div className={styles.refCode}>
            <div>{first}</div>
            {rest && <div>{rest}</div>}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={() => {
              onViewTickets?.();
              onClose?.();
            }}
          >
            View My Tickets
          </button>

          <button
            className={styles.secondary}
            onClick={() => {
              router.push("/client/booking");
              onClose?.();
            }}
          >
            Book Another Trip
          </button>
        </div>
      </div>
    </div>
  );
}
