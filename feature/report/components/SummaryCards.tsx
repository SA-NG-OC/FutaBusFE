// /features/reports/components/SummaryCards.tsx
import React from 'react';
import { DashboardSummaryRes } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, Wallet } from 'lucide-react';

// Hàm format tiền tệ VN
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const Card = ({ title, value, growth, icon: Icon, type }: any) => {
    const isPositive = growth >= 0;

    // Xác định màu sắc dựa trên type (dùng biến CSS variable đã define)
    let iconBg = 'bg-[var(--stat-green-bg)]';
    let iconColor = 'text-[var(--stat-green-text)]';

    if (type === 'cost') { iconBg = 'bg-[var(--stat-orange-bg)]'; iconColor = 'text-[var(--stat-orange-text)]'; }
    if (type === 'profit') { iconBg = 'bg-[var(--stat-blue-bg)]'; iconColor = 'text-[var(--stat-blue-text)]'; }
    if (type === 'rate') { iconBg = 'bg-[var(--stat-purple-bg)]'; iconColor = 'text-[var(--stat-purple-text)]'; }

    return (
        <div className="p-6 rounded-xl bg-[var(--background-paper)] border border-[var(--border-gray)] shadow-sm">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[var(--stat-green-text)]' : 'text-[var(--primary)]'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(growth)}%
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-[var(--text-gray)] text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
            </div>
        </div>
    );
};

const SummaryCards = ({ data }: { data: DashboardSummaryRes | null }) => {
    if (!data) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[var(--background-paper)] rounded-xl"></div>)}
    </div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
                title="Total Revenue"
                value={formatCurrency(data.revenue.value)}
                growth={data.revenue.growthPercent}
                icon={DollarSign}
                type="revenue"
            />
            <Card
                title="Total Costs"
                value={formatCurrency(data.costs.value)}
                growth={data.costs.growthPercent}
                icon={Wallet}
                type="cost"
            />
            <Card
                title="Net Profit"
                value={formatCurrency(data.netProfit.value)}
                growth={data.netProfit.growthPercent}
                icon={Activity}
                type="profit"
            />
            <Card
                title="Occupancy Rate"
                value={`${data.occupancyRate.value}%`}
                growth={data.occupancyRate.growthPercent}
                icon={PieChart}
                type="rate"
            />
        </div>
    );
};

export default SummaryCards;