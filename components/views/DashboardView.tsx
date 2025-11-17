import React, { useMemo } from 'react';
import type { Project, Employee, Invoice, Ticket, Product, ProductCategory } from '../../types.js';
import { FinancialStatCard } from '../common/FinancialStatCard';
import { RevenueProfitChart } from '../charts/RevenueProfitChart';
import { RevenueStreamChart } from '../charts/RevenueStreamChart';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { InvoicesIcon } from '../icons/InvoicesIcon';
import { ScaleIcon } from '../icons/ScaleIcon';

interface DashboardViewProps {
    projects: Project[];
    employees: Employee[];
    invoices: Invoice[];
    tickets: Ticket[];
    products: Product[];
    productCategories: ProductCategory[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ projects, employees, invoices, tickets, products, productCategories }) => {
    // Financial Metric Calculations
    const paidInvoices = useMemo(() => invoices.filter(i => i.status === 'Paid'), [invoices]);
    
    const grossRevenue = useMemo(() => paidInvoices.reduce((acc, i) => acc + i.amount, 0), [paidInvoices]);
    
    // For demonstration, simulating Net Profit as 65% of Gross Revenue
    const netProfit = useMemo(() => grossRevenue * 0.65, [grossRevenue]);
    
    const profitMargin = useMemo(() => (grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0), [grossRevenue, netProfit]);
    
    const avgInvoiceValue = useMemo(() => (paidInvoices.length > 0 ? grossRevenue / paidInvoices.length : 0), [grossRevenue, paidInvoices.length]);

    return (
        <div className="p-8 space-y-8">
            {/* Top Financial Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialStatCard
                    icon={<DollarSignIcon className="w-6 h-6 text-accent" />}
                    title="Gross Revenue"
                    value={`$${grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    trend="+12.5%"
                    trendDirection="up"
                />
                <FinancialStatCard
                    icon={<TrendingUpIcon className="w-6 h-6 text-success" />}
                    title="Net Profit (Simulated)"
                    value={`$${netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    trend="+8.2%"
                    trendDirection="up"
                />
                <FinancialStatCard
                    icon={<ScaleIcon className="w-6 h-6 text-info" />}
                    title="Profit Margin"
                    value={`${profitMargin.toFixed(1)}%`}
                    trend="-1.1%"
                    trendDirection="down"
                />
                 <FinancialStatCard
                    icon={<InvoicesIcon className="w-6 h-6 text-warning" />}
                    title="Average Invoice Value"
                    value={`$${avgInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    trend="+5.0%"
                    trendDirection="up"
                />
            </section>

            {/* Main Dashboard Grid for Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RevenueProfitChart invoices={invoices} />
                </div>
                
                <div className="lg:col-span-1">
                    <RevenueStreamChart invoices={invoices} products={products} categories={productCategories} />
                </div>
            </section>
        </div>
    );
};
