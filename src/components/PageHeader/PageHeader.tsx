'use client';

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './PageHeader.module.css';
import ButtonAdd from '../Button/ButtonAdd';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    // Thêm props cho Search
    showSearch?: boolean;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
}

const PageHeader = ({
    title,
    subtitle,
    actionLabel,
    onAction,
    showSearch = false,
    onSearch,
    searchPlaceholder = "Search..."
}: PageHeaderProps) => {
    return (
        <div className={styles.container}>
            {/* Phần Text bên trái */}
            <div className={styles['text-section']}>
                <h1 className={styles.heading}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            {/* Phần Actions bên phải (Search + Button) */}
            <div className={styles['actions-wrapper']}>

                {/* Search Bar - Chỉ hiện khi showSearch = true */}
                {showSearch && (
                    <div className={styles['search-container']}>
                        <div className={styles['search-icon']}>
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            className={styles['search-input']}
                            placeholder={searchPlaceholder}
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                        />
                    </div>
                )}

                {/* Nút Action */}
                {actionLabel && (
                    <div className={styles['button-wrapper']}>
                        <ButtonAdd onClick={onAction}>
                            {actionLabel}
                        </ButtonAdd>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;