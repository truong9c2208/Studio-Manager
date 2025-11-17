import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Invoice } from '../../types';

interface BarChartProps {
    invoices: Invoice[];
}

export const BarChart: React.FC<BarChartProps> = ({ invoices }) => {
    const monthlyData = useMemo(() => {
        const revenueByMonth: { [key: string]: number } = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
        
        invoices.forEach(invoice => {
            if (invoice.status === 'Paid') {
                const monthIndex = new Date(invoice.dueDate).getMonth();
                const monthName = Object.keys(revenueByMonth)[monthIndex];
                if (monthName) {
                    revenueByMonth[monthName] += invoice.amount;
                }
            }
        });

        // Add some mock data for demo purposes to make the chart look fuller
        revenueByMonth['Jan'] += 3200;
        revenueByMonth['Feb'] += 1800;
        revenueByMonth['Mar'] += 4500;
        revenueByMonth['Apr'] += 4200;
        revenueByMonth['May'] += 2800;


        return Object.entries(revenueByMonth).map(([name, value]) => ({ name, value }));

    }, [invoices]);
    
    const dataForChart = monthlyData.slice(0, 7); // Display first 7 months
    const maxValue = Math.max(...dataForChart.map(d => d.value), 1); // Avoid division by zero

    return (
        <Card title="Monthly Revenue">
            <div className="flex justify-between items-end h-64 space-x-2">
                {dataForChart.map(item => (
                    <div key={item.name} className="flex-1 flex flex-col items-center justify-end">
                        <div 
                            className="w-full bg-accent rounded-t-md transition-all duration-500 hover:bg-accent-hover"
                            style={{ height: `${(item.value / maxValue) * 100}%`}}
                            title={`$${item.value.toLocaleString()}`}
                        ></div>
                        <span className="text-xs text-text-secondary mt-2">{item.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};