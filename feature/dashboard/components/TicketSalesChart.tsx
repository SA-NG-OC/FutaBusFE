'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChartDataDTO } from '../types';

interface TicketSalesProps {
    data: ChartDataDTO[];
}

const TicketSalesChart = ({ data }: TicketSalesProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                barSize={32}
            >
                {/* Grid: Dùng var(--border-gray) */}
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--border-gray)" />

                <XAxis
                    dataKey="label"
                    axisLine={true}
                    tickLine={false}
                    // Tick: Dùng var(--text-gray)
                    tick={{ fill: 'var(--text-gray)', fontSize: 12 }}
                    dy={10}
                    stroke="var(--border-gray)"
                />

                <YAxis
                    axisLine={true}
                    tickLine={false}
                    tick={{ fill: 'var(--text-gray)', fontSize: 12 }}
                    stroke="var(--border-gray)"
                />

                <Tooltip
                    // Cursor hover: Dùng var(--bg-hover)
                    cursor={{ fill: 'var(--bg-hover)' }}
                    contentStyle={{
                        backgroundColor: 'var(--background-paper)',
                        borderColor: 'var(--border-gray)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                />

                <Bar
                    dataKey="value"
                    // Bar Color: Dùng var(--primary)
                    fill="var(--primary)"
                    radius={[2, 2, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TicketSalesChart;