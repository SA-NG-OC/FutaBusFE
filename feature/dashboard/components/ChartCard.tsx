import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    isLoading?: boolean;
}

const ChartCard = ({ title, children, action, isLoading = false }: ChartCardProps) => {
    return (
        // SỬ DỤNG: bg-background-paper, border-border-gray
        <div className="bg-background-paper border border-border-gray rounded-[14px] w-full h-[400px] p-6 flex flex-col relative shadow-sm transition-colors duration-200">
            {/* Header: Title + Action */}
            <div className="flex justify-between items-center mb-6">
                {/* SỬ DỤNG: text-foreground */}
                <h2 className="text-foreground text-base font-medium">
                    {title}
                </h2>
                {!isLoading && action && <div>{action}</div>}
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-h-0 relative">
                {isLoading ? (
                    // --- Loading Skeleton UI ---
                    <div className="w-full h-full animate-pulse flex flex-col justify-end">
                        <div className="flex items-end justify-between h-full w-full px-2 gap-2">
                            {[40, 70, 50, 80, 60, 30, 90].map((h, i) => (
                                <div
                                    key={i}
                                    // Skeleton dùng bg-bg-hover hoặc 1 màu xám nhẹ mặc định
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-md"
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