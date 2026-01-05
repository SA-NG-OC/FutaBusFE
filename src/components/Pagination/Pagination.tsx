'use client';
import React from 'react';
import styles from './Pagination.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    currentPage: number; // API thường trả về page 0 hoặc 1, ở đây ta giả sử 0-based index
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    // Helper để tạo mảng số trang
    const getPageNumbers = () => {
        const pages = [];
        // Logic đơn giản: hiện tất cả hoặc giới hạn (ở đây làm đơn giản trước)
        for (let i = 0; i < totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                className={styles['page-btn']}
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <FaChevronLeft />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    className={`${styles['page-btn']} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}

            <button
                className={styles['page-btn']}
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Pagination;