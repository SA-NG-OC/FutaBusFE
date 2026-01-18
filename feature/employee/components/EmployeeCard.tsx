import { Employee } from '../api/employeeApi';
import styles from './EmployeeCard.module.css';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          {employee.avt ? (
            <img src={employee.avt} alt={employee.fullName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {employee.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className={styles.name}>{employee.fullName}</h3>
            <span className={`${styles.badge} ${styles[employee.status.toLowerCase()]}`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>📧 Email:</span>
            <span className={styles.value}>{employee.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>📱 Phone:</span>
            <span className={styles.value}>{employee.phoneNumber}</span>
          </div>
          {employee.address && (
            <div className={styles.infoItem}>
              <span className={styles.label}>📍 Address:</span>
              <span className={styles.value}>{employee.address}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.label}>👔 Role:</span>
            <span className={styles.value}>{employee.role.roleName}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onEdit(employee)}
          className={styles.btnEdit}
          title="Edit employee"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(employee)}
          className={styles.btnDelete}
          title="Delete employee"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
