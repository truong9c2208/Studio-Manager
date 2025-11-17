import React, { useMemo } from 'react';
import { BarChart } from './charts/BarChart';
import { Card } from './common/Card';
import type { Project, Employee, Invoice, Ticket } from '../types';
import { ActivityFeed, type ActivityItem } from './common/ActivityFeed';
import { InvoiceStatusDonutChart } from './charts/InvoiceStatusDonutChart';
import { TaskPriorityDonutChart } from './charts/TaskPriorityDonutChart';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PlusIcon } from './icons/PlusIcon';
import { InvoicesIcon } from './icons/InvoicesIcon';
import { ClockIcon } from './icons/ClockIcon';

interface DashboardViewProps {
    projects: Project[];
    employees: Employee[];
    invoices: Invoice[];
    tickets: Ticket[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ projects, employees, invoices, tickets }) => {
    // Metric Calculations
    const totalRevenue = useMemo(() => invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0), [invoices]);
    const openTickets = useMemo(() => tickets.filter(t => t.status !== 'Closed').length, [tickets]);
    const overdueTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return projects.flatMap(p => p.tasks).filter(t => t.deadline && new Date(t.deadline) < today && t.status !== 'Done').length;
    }, [projects]);
    const activeProjects = useMemo(() => projects.filter(p => p.status !== 'Completed').length, [projects]);

    // Mock Activity Feed Data
    const activityItems: ActivityItem[] = useMemo(() => [
        { icon: <PlusIcon className="w-4 h-4 text-white" />, color: 'bg-accent', text: <p>New task <strong>"Develop login"</strong> added to Project Alpha.</p>, time: '2h ago' },
        { icon: <CheckCircleIcon className="w-4 h-4 text-white" />, color: 'bg-success', text: <p><strong>Project Delta</strong> has been marked as completed.</p>, time: '1 day ago' },
        { icon: <InvoicesIcon className="w-4 h-4 text-white" />, color: 'bg-info', text: <p>Invoice <strong>INV-005</strong> for $500 was sent to QuantumLeap.</p>, time: '2 days ago' },
        { icon: <ClockIcon className="w-4 h-4 text-white" />, color: 'bg-danger', text: <p><strong>Project Beta</strong> is now At Risk due to timeline changes.</p>, time: '3 days ago' },
    ], []);

    return (
        <div className="p-8 space-y-8">
            {/* Top Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.5%" />
                <Card title="Active Projects" value={activeProjects.toString()} change="+1 new" />
                <Card title="Open Tickets" value={openTickets.toString()} change="-2.1%" />
                <Card title="Overdue Tasks" value={overdueTasks.toString()} change={overdueTasks > 0 ? 'Needs attention' : 'All clear'} />
            </section>

            {/* Main Dashboard Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <BarChart invoices={invoices} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InvoiceStatusDonutChart invoices={invoices} />
                        <TaskPriorityDonutChart projects={projects} />
                    </div>
                </div>
                
                {/* Right Column (Activity Feed) */}
                <div className="lg:col-span-1">
                    <ActivityFeed title="Recent Activity" items={activityItems} />
                </div>
            </section>
        </div>
    );
};
