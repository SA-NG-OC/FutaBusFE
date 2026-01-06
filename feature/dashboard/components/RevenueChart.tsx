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

const RevenueChart = ({ data }: RevenueChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
                {/* Grid: Dùng var(--border-gray) */}
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--border-gray)" />

                {/* XAxis: Tick dùng var(--text-gray) */}
                <XAxis
                    dataKey="label"
                    axisLine={true}
                    tickLine={false}
                    tick={{ fill: 'var(--text-gray)', fontSize: 12 }}
                    dy={10}
                    stroke="var(--border-gray)"
                />

                {/* YAxis */}
                <YAxis
                    axisLine={true}
                    tickLine={false}
                    tick={{ fill: 'var(--text-gray)', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                    stroke="var(--border-gray)"
                />

                {/* Tooltip: Cần style background/border bằng CSS var */}
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--background-paper)', // Nền theo theme
                        borderColor: 'var(--border-gray)',          // Viền theo theme
                        color: 'var(--foreground)',                 // Chữ theo theme
                        borderRadius: '8px',
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
                    dot={{ fill: 'var(--background-paper)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--primary)' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;