import React from 'react';
import { Metadata } from 'next';
import DashboardView from '@/feature/dashboard/components/DashboardView';

export const metadata: Metadata = {
    title: 'Dashboard Overview | Fuba Bus Management',
    description: 'Monitor daily revenue, ticket sales, and active trips.',
};

export default function DashboardPage() {
    return (
        <main className="min-h-screen">
            <DashboardView />
        </main>
    );
}