'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChartDataDTO } from '../types';

interface RevenueChartProps {
    data: ChartDataDTO[];
}

// ... imports giữ nguyên

const RevenueChart = ({ data }: RevenueChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }} // Giảm left margin để tiết kiệm chỗ
            >
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--border-gray)" />

                <XAxis
                    dataKey="label"
                    axisLine={true}
                    tickLine={false}
                    // Responsive font size: 11px cho gọn
                    tick={{ fill: 'var(--text-gray)', fontSize: 11 }}
                    dy={10}
                    stroke="var(--border-gray)"
                    // Giảm bớt label nếu quá dày đặc
                    interval="preserveStartEnd"
                />

                <YAxis
                    axisLine={true}
                    tickLine={false}
                    tick={{ fill: 'var(--text-gray)', fontSize: 11 }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                    stroke="var(--border-gray)"
                    width={35} // Cố định chiều rộng YAxis để không bị nhảy layout
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--background-paper)',
                        borderColor: 'var(--border-gray)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                        fontSize: '12px', // Tooltip nhỏ gọn
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: number | string | undefined) => {
                        if (typeof value === 'number') {
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
                        }
                        return value;
                    }}
                />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--background-paper)', stroke: 'var(--primary)', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: 'var(--primary)' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;