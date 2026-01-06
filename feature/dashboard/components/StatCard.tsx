import React from 'react';
import { StatCardProps, StatVariant } from '../types';

const getVariantClasses = (variant: StatVariant) => {
    switch (variant) {
        case 'green': return 'bg-stat-green-bg text-stat-green-text';
        case 'blue': return 'bg-stat-blue-bg text-stat-blue-text';
        case 'orange': return 'bg-stat-orange-bg text-stat-orange-text';
        case 'purple': return 'bg-stat-purple-bg text-stat-purple-text';
        default: return 'bg-bg-hover text-text-gray';
    }
};

const StatCard = ({ label, value, trendValue, variant, icon, isIncrease }: StatCardProps) => {
    const colorClasses = getVariantClasses(variant);
    const trendColorClass = isIncrease ? 'text-green-500' : 'text-red-500';
    const trendBgClass = isIncrease ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

    return (
        <div className="bg-background-paper border border-border-gray rounded-[14px] w-full p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between h-12">
                <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                    <div className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-current">
                        {icon}
                    </div>
                </div>

                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendBgClass}`}>
                    <div className={`w-4 h-4 flex items-center justify-center ${trendColorClass}`}>
                        {isIncrease ? (
                            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full stroke-current stroke-2">
                                <path d="M12 10.6667L8 6.66667L4 10.6667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full stroke-current stroke-2 rotate-180">
                                <path d="M12 10.6667L8 6.66667L4 10.6667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    {/* ĐỔI: font-medium -> font-normal (để chữ nhạt hơn) */}
                    <span className={`text-sm font-normal ${trendColorClass}`}>
                        {trendValue}
                    </span>
                </div>
            </div>

            <div>
                {/* ĐỔI: font-semibold -> font-medium (để số liệu đỡ dày) */}
                <p className="text-foreground text-2xl leading-8 font-medium mb-1">
                    {value}
                </p>
                <p className="text-text-gray text-sm font-normal">
                    {label}
                </p>
            </div>
        </div>
    );
};

export default StatCard;