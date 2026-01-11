// /features/reports/components/RevenueChart.tsx
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartDataRes } from '../types';

const RevenueChart = ({ data }: { data: ChartDataRes[] }) => {
    return (
        <div className="bg-[var(--background-paper)] p-6 rounded-xl border border-[var(--border-gray)] shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Revenue Trend (Day of Month)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="label"
                            stroke="var(--text-gray)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--text-gray)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--background-paper)', borderColor: 'var(--border-gray)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            formatter={(value: number | undefined) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--background-paper)' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;