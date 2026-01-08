import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    isLoading?: boolean;
}

const ChartCard = ({ title, children, action, isLoading = false }: ChartCardProps) => {
    return (
        // Responsive Height: h-[300px] mobile -> h-[400px] desktop
        <div className="bg-background-paper border border-border-gray rounded-[14px] w-full h-[300px] md:h-[400px] p-4 md:p-6 flex flex-col relative shadow-sm transition-colors duration-200">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-foreground text-sm md:text-base font-medium truncate">
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