import { Employee } from "../api/employeeApi";
import styles from "./EmployeeCard.module.css";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  // Safe access helpers
  const roleName = employee.roleName || "N/A"; // Nếu role null thì hiện N/A
  const status = employee.status || "UNKNOWN"; // Nếu status null thì hiện UNKNOWN
  const statusClass = status.toLowerCase();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          {employee.avt ? (
            <img
              src={employee.avt}
              alt={employee.fullName}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {employee.fullName
                ? employee.fullName.charAt(0).toUpperCase()
                : "?"}
            </div>
          )}
          <div>
            <h3 className={styles.name}>{employee.fullName}</h3>
            {/* Sửa lỗi status có thể bị null */}
            <span className={`${styles.badge} ${styles[statusClass] || ""}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <FaEnvelope className={styles.icon} /> Email:
            </span>
            <span className={styles.value}>{employee.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <FaPhone className={styles.icon} /> Số điện thoại:
            </span>
            <span className={styles.value}>{employee.phoneNumber}</span>
          </div>
          {employee.address && (
            <div className={styles.infoItem}>
              <span className={styles.label}>
                <FaMapMarkerAlt className={styles.icon} /> Địa chỉ:
              </span>
              <span className={styles.value}>{employee.address}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <FaUserTag className={styles.icon} /> Vai trò:
            </span>
            <span className={styles.value}>{roleName}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onEdit(employee)}
          className={styles.btnEdit}
          title="Chỉnh sửa nhân viên"
        >
          <FaEdit /> Sửa
        </button>
        <button
          onClick={() => onDelete(employee)}
          className={styles.btnDelete}
          title="Xóa nhân viên"
        >
          <FaTrash /> Xóa
        </button>
      </div>
    </div>
  );
}
