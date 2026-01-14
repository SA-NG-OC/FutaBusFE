import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    isLoading?: boolean;
}

const ChartCard = ({ title, children, action, isLoading = false }: ChartCardProps) => {
    return (
        // SỬA: Dùng trực tiếp bg-[var(--background-paper)] và border-[var(--border-gray)]
        <div className="bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-[14px] w-full h-[300px] md:h-[400px] p-4 md:p-6 flex flex-col relative shadow-sm transition-colors duration-200">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                {/* SỬA: Dùng text-[var(--foreground)] */}
                <h2 className="text-[var(--foreground)] text-sm md:text-base font-medium truncate">
                    {title}
                </h2>
                {!isLoading && action && <div>{action}</div>}
            </div>

            <div className="flex-1 w-full min-h-0 relative">
                {isLoading ? (
                    <div className="w-full h-full animate-pulse flex flex-col justify-end">
                        <div className="flex items-end justify-between h-full w-full px-2 gap-2">
                            {[40, 70, 50, 80, 60, 30, 90].map((h, i) => (
                                <div
                                    key={i}
                                    // SỬA: Thay bg-gray-200... bằng bg-[var(--bg-hover)]
                                    // Nó sẽ lấy màu #f3f4f6 (Light) hoặc #334155 (Dark) từ CSS của bạn
                                    className="w-full bg-[var(--bg-hover)] rounded-t-md"
                                    style={{ height: `${h}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default ChartCard;