// /features/reports/components/ReportHeader.tsx
'use client';
import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ReportHeaderProps {
    month: number;
    year: number;
    onFilterChange: (key: 'month' | 'year', value: number) => void;
    onExport: () => void;
    isExporting: boolean;
}

const ReportHeader = ({
    month,
    year,
    onFilterChange,
    onExport,
    isExporting,
}: ReportHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">
                    Báo cáo & Phân tích
                </h1>
                <p className="text-[var(--text-gray)] mt-1">
                    Báo cáo tài chính và phân tích hoạt động kinh doanh
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Chọn tháng */}
                <select
                    value={month}
                    onChange={(e) =>
                        onFilterChange('month', Number(e.target.value))
                    }
                    disabled={isExporting}
                    className="px-4 py-2 rounded-lg bg-[var(--background-paper)] border border-[var(--border-gray)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                            Tháng {m}
                        </option>
                    ))}
                </select>

                {/* Chọn năm */}
                <select
                    value={year}
                    onChange={(e) =>
                        onFilterChange('year', Number(e.target.value))
                    }
                    disabled={isExporting}
                    className="px-4 py-2 rounded-lg bg-[var(--background-paper)] border border-[var(--border-gray)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                >
                    {[2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                {/* Nút xuất báo cáo */}
                <button
                    onClick={onExport}
                    disabled={isExporting}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-[var(--border-gray)]
                        ${isExporting
                            ? 'bg-[var(--bg-beige)] opacity-70 cursor-wait text-[var(--text-gray)]'
                            : 'bg-[var(--bg-beige)] hover:bg-[var(--btn-bg-hover)] text-[var(--primary)]'
                        }
                    `}
                >
                    {isExporting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Download size={18} />
                    )}
                    <span>
                        {isExporting ? 'Đang xuất báo cáo...' : 'Xuất báo cáo'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ReportHeader;
