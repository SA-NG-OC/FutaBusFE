import { Driver } from "../api/driverApi";
import Image from "next/image";
import { FaEdit, FaTrash, FaRoute } from "react-icons/fa"; // Import thêm icons
import styles from "./DriverCard.module.css";

interface DriverCardProps {
  driver: Driver;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onAssignRoute?: (driverId: number, driverName: string) => void;
}

export default function DriverCard({
  driver,
  onEdit,
  onDelete,
  onAssignRoute,
}: DriverCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return styles.statusActive;
      case "inactive":
        return styles.statusInactive;
      case "on leave":
        return styles.statusLeave;
      default:
        return styles.statusDefault;
    }
  };

  const isLicenseExpiringSoon = () => {
    const expiryDate = new Date(driver.licenseExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isLicenseExpired = () => {
    const expiryDate = new Date(driver.licenseExpiry);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className={styles.card}>
      {/* Header with Avatar */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {driver.avatar ? (
            <Image
              src={driver.avatar}
              alt={driver.fullName}
              width={80}
              height={80}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {getInitials(driver.fullName)}
            </div>
          )}
        </div>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{driver.fullName}</h3>
          <span className={`${styles.status} ${getStatusColor(driver.status)}`}>
            {driver.status}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className={styles.section}>
        <div className={styles.infoRow}>
          <span className={styles.icon}>📞</span>
          <span>{driver.phoneNumber}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.icon}>📧</span>
          <span className={styles.email}>{driver.email}</span>
        </div>
      </div>

      {/* License Info */}
      <div className={styles.section}>
        <div className={styles.infoRow}>
          <span className={styles.icon}>🪪</span>
          <span>License: {driver.driverLicense}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.icon}>📅</span>
          <span>
            Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
            {isLicenseExpired() && (
              <span className={styles.expired}> (Expired)</span>
            )}
            {isLicenseExpiringSoon() && !isLicenseExpired() && (
              <span className={styles.expiringSoon}> (Soon)</span>
            )}
          </span>
        </div>
      </div>

      {/* Active Routes */}
      {driver.activeRoutes && driver.activeRoutes.length > 0 ? (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Active Routes</h4>
          <div className={styles.routes}>
            {driver.activeRoutes.map((route) => (
              <div key={route.assignmentId} className={styles.routeItem}>
                <div className={styles.routeHeader}>
                  <span className={styles.routeName}>{route.routeName}</span>
                  <span
                    className={`${styles.role} ${route.preferredRole === "Main" ? styles.roleMain : styles.roleBackup}`}
                  >
                    {route.preferredRole}
                  </span>
                </div>
                <div className={styles.routeDetails}>
                  <span className={styles.routePath}>
                    {route.origin} → {route.destination}
                  </span>
                  <span className={styles.priority}>
                    Prio: {route.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noRoutes}>
          <span className={styles.icon}>🚌</span>
          <span>Chưa được phân công tuyến</span>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {/* Nút Gán Tuyến - Đặt ở đây cho đẹp và dễ bấm */}
        {onAssignRoute && (
          <button
            onClick={() => onAssignRoute(driver.driverId, driver.fullName)}
            className={styles.btnAssign}
            title="Gắn tuyến mới"
          >
            <FaRoute /> Gắn tuyến
          </button>
        )}

        <button
          onClick={() => onEdit(driver)}
          className={styles.btnEdit}
          title="Sửa"
        >
          <FaEdit /> Sửa
        </button>

        <button
          onClick={() => onDelete(driver)}
          className={styles.btnDelete}
          title="Xóa"
        >
          <FaTrash /> Xóa
        </button>
      </div>
    </div>
  );
}
