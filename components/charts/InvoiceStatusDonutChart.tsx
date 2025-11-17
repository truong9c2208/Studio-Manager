import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Invoice } from '../../types';

interface InvoiceStatusDonutChartProps {
    invoices: Invoice[];
}

export const InvoiceStatusDonutChart: React.FC<InvoiceStatusDonutChartProps> = ({ invoices }) => {
    const statusCounts = useMemo(() => {
        const counts: { [key in Invoice['status']]: number } = {
            'Paid': 0,
            'Pending': 0,
            'Overdue': 0,
        };
        invoices.forEach(invoice => {
            if (invoice.status in counts) {
                counts[invoice.status]++;
            }
        });
        return counts;
    }, [invoices]);

    const totalInvoices = invoices.length;
    const data = [
        { label: 'Paid', value: statusCounts['Paid'], color: '#10b981' }, // success
        { label: 'Pending', value: statusCounts['Pending'], color: '#f59e0b' }, // warning
        { label: 'Overdue', value: statusCounts['Overdue'], color: '#ef4444' }, // danger
    ];

    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title="Invoice Status">
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalInvoices > 0 && data.map((item, index) => {
                            if (item.value === 0) return null;
                            const dasharray = (item.value / totalInvoices) * circumference;
                            const strokeDashoffset = offset;
                            offset += dasharray;
                            return (
                                <circle key={index} cx="60" cy="60" r="54" fill="none" stroke={item.color} strokeWidth="12" strokeDasharray={`${dasharray} ${circumference}`} strokeDashoffset={-strokeDashoffset} strokeLinecap="round" />
                            );
                        })}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{totalInvoices}</span>
                        <span className="text-text-secondary">Invoices</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 space-y-2 text-sm w-full max-w-[200px]">
                    {data.map(item => (
                         <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-text-secondary">{item.label}</span>
                            </div>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
