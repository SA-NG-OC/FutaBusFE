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
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
                {/* Grid: Dùng var(--border-gray) trực tiếp */}
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    stroke="var(--border-gray)"
                />

                <XAxis
                    dataKey="label"
                    axisLine={true}
                    tickLine={false}
                    // Tick: Dùng var(--text-gray)
                    tick={{ fill: 'var(--text-gray)', fontSize: 11 }}
                    dy={10}
                    stroke="var(--border-gray)"
                    interval="preserveStartEnd"
                />

                <YAxis
                    axisLine={true}
                    tickLine={false}
                    tick={{ fill: 'var(--text-gray)', fontSize: 11 }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                    stroke="var(--border-gray)"
                    width={35}
                />

                <Tooltip
                    contentStyle={{
                        // Tooltip: Map trực tiếp biến CSS vào style object
                        backgroundColor: 'var(--background-paper)',
                        borderColor: 'var(--border-gray)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' // Shadow nhẹ
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    cursor={{ stroke: 'var(--border-gray)', strokeWidth: 1 }} // Thêm đường kẻ khi hover
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
                    // Line: Dùng màu var(--primary)
                    stroke="var(--primary)"
                    strokeWidth={2}
                    // Dot: Nền là background-paper, viền là primary
                    dot={{ fill: 'var(--background-paper)', stroke: 'var(--primary)', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: 'var(--primary)' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;