'use client';
import React from 'react';
import styles from './ConfirmDeleteModal.module.css';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string; // Tên item cần xóa (biển số xe / tên tuyến...)
}

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
}: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button
                    className={styles['close-button']}
                    onClick={onClose}
                >
                    <svg fill="none" viewBox="0 0 16 16">
                        <path
                            d="M12 4L4 12"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.33"
                        />
                        <path
                            d="M4 4L12 12"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.33"
                        />
                    </svg>
                </button>

                <div className={styles['modal-header']}>
                    <div className={styles['icon-warning']}>
                        <svg fill="none" viewBox="0 0 24 24">
                            <path
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className={styles['modal-title']}>
                        Xác nhận xóa
                    </h2>
                </div>

                <div className={styles['modal-content']}>
                    <p className={styles['message-text']}>
                        Bạn có chắc chắn muốn xóa{' '}
                        <span className={styles['plate-number']}>
                            {itemName}
                        </span>
                        ?
                    </p>

                    <div className={styles['warning-box']}>
                        <p className={styles['warning-text']}>
                            <strong>Cảnh báo:</strong> Hành động này
                            không thể hoàn tác. Tất cả dữ liệu liên
                            quan sẽ bị xóa vĩnh viễn.
                        </p>
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    <button
                        className={`${styles.btn} ${styles['btn-cancel']}`}
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className={`${styles.btn} ${styles['btn-delete']}`}
                        onClick={onConfirm}
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
