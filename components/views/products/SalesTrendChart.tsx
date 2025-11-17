
import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Invoice } from '../../../types';

interface SalesTrendChartProps {
    invoices: Invoice[];
    products: any[]; // not used, but passed in ProductsView
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ invoices }) => {
    const monthlyData = useMemo(() => {
        const revenueByMonth: { [key: string]: number } = {};
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthOrder.forEach(m => revenueByMonth[m] = 0);
        
        invoices.forEach(invoice => {
            if (invoice.status === 'Paid') {
                const monthIndex = new Date(invoice.dueDate).getMonth();
                const monthName = monthOrder[monthIndex];
                if (monthName) {
                    revenueByMonth[monthName] += invoice.amount;
                }
            }
        });

        // Add some mock data for demo purposes
        revenueByMonth['Jan'] += 3200;
        revenueByMonth['Feb'] += 1800;
        revenueByMonth['Mar'] += 4500;
        revenueByMonth['Apr'] += 4200;
        revenueByMonth['May'] += 2800;

        return Object.entries(revenueByMonth).map(([name, value]) => ({ name, value }));

    }, [invoices]);
    
    const dataForChart = monthlyData.slice(0, 7); // Display first 7 months for simplicity
    const maxValue = Math.max(...dataForChart.map(d => d.value), 1);

    const points = dataForChart.map((item, index) => {
        const x = (index / (dataForChart.length - 1)) * 360 + 20;
        const y = 170 - (item.value / maxValue) * 150;
        return `${x},${y}`;
    }).join(' ');

    return (
        <Card title="Product Sales Trend (YTD)">
            <div className="h-64 -mx-2 -mb-2">
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="20" y1="20" x2="20" y2="180" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="20" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Gradient for area chart */}
                    <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <polygon points={`20,180 ${points} 380,180`} fill="url(#salesGradient)" />
                    
                    {/* Line path */}
                    <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" />

                     {/* Data points and labels */}
                     {dataForChart.map((item, index) => {
                        const x = (index / (dataForChart.length - 1)) * 360 + 20;
                        const y = 170 - (item.value / maxValue) * 150;
                        return (
                            <g key={index}>
                                <circle cx={x} cy={y} r="3" fill="#6366f1" />
                                <text x={x} y="195" textAnchor="middle" fill="#6b7280" fontSize="12">{item.name}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </Card>
    );
};
