// /features/reports/components/ShiftChart.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ChartDataRes } from '../types';

const ShiftChart = ({ data }: { data: ChartDataRes[] }) => {
    return (
        <div className="bg-[var(--background-paper)] p-6 rounded-xl border border-[var(--border-gray)] shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Revenue by Shift (Peak Hours)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={40}>
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
                            cursor={{ fill: 'var(--bg-hover)' }}
                            contentStyle={{ backgroundColor: 'var(--background-paper)', borderColor: 'var(--border-gray)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            formatter={(value: number | undefined) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="var(--brand-dark-red)" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ShiftChart;