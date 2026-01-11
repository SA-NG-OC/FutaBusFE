// /features/reports/components/TopRoutesTable.tsx
import React from 'react';
import { RouteAnalyticsRes } from '../types';

const TopRoutesTable = ({ routes }: { routes: RouteAnalyticsRes[] }) => {
    return (
        <div className="bg-[var(--background-paper)] p-6 rounded-xl border border-[var(--border-gray)] shadow-sm h-full">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Top Routes by Revenue</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-[var(--text-gray)] border-b border-[var(--border-gray)]">
                            <th className="pb-3 font-medium">Rank</th>
                            <th className="pb-3 font-medium">Route</th>
                            <th className="pb-3 font-medium text-right">Revenue</th>
                            <th className="pb-3 font-medium text-right">Vehicles</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {routes.map((route, index) => (
                            <tr key={route.routeId} className="border-b border-[var(--border-gray)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                                <td className="py-4">
                                    <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold text-white
                    ${index === 0 ? 'bg-[#D83E3E]' :
                                            index === 1 ? 'bg-[#E16666]' :
                                                index === 2 ? 'bg-[#EA8C8C]' : 'bg-[var(--text-gray)]'}
                  `}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-4 font-medium text-[var(--foreground)]">
                                    {route.routeName}
                                    <div className="text-xs text-[var(--text-gray)] mt-0.5">Drivers: {route.driverCount}</div>
                                </td>
                                <td className="py-4 text-right font-bold text-[var(--primary)]">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(route.totalRevenue)}
                                </td>
                                <td className="py-4 text-right text-[var(--text-gray)]">
                                    {route.vehicleCount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {routes.length === 0 && (
                <div className="text-center py-10 text-[var(--text-gray)]">No route data available</div>
            )}
        </div>
    );
};

export default TopRoutesTable;