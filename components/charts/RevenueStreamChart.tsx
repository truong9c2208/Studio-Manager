import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Invoice, Product, ProductCategory } from '../../types';

interface RevenueStreamChartProps {
    invoices: Invoice[];
    products: Product[];
    categories: ProductCategory[];
}

const colors = ['#4f46e5', '#3b82f6', '#f59e0b', '#10b981'];

export const RevenueStreamChart: React.FC<RevenueStreamChartProps> = ({ invoices, products, categories }) => {
    const revenueByStream = useMemo(() => {
        const streamData: { [categoryId: string]: { name: string; value: number } } = {};
        
        categories.forEach(cat => {
            streamData[cat.id] = { name: cat.name, value: 0 };
        });

        invoices.forEach(invoice => {
            if (invoice.status === 'Paid' && invoice.products) {
                invoice.products.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product && streamData[product.categoryId]) {
                        streamData[product.categoryId].value += item.price * item.quantity;
                    }
                });
            }
        });
        
        return Object.values(streamData)
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);

    }, [invoices, products, categories]);

    const totalRevenue = revenueByStream.reduce((acc, stream) => acc + stream.value, 0);
    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title="Revenue Streams">
            <div className="flex flex-col items-center justify-center min-h-[16rem] h-full">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalRevenue > 0 && revenueByStream.map((item, index) => {
                            const dasharray = (item.value / totalRevenue) * circumference;
                            const strokeDashoffset = offset;
                            offset += dasharray;
                            return (
                                <circle key={index} cx="60" cy="60" r="54" fill="none" stroke={colors[index % colors.length]} strokeWidth="12" strokeDasharray={`${dasharray} ${circumference}`} strokeDashoffset={-strokeDashoffset} strokeLinecap="round" />
                            );
                        })}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#F2F2F2]">${totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        <span className="text-[#FFFFFF] text-sm">Total Revenue</span>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm w-full max-w-[200px]">
                    {revenueByStream.map((item, index) => (
                         <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                <span className="text-[#F2F2F2] truncate">{item.name}</span>
                            </div>
                            <span className="font-semibold text-[#F2F2F2]">{((item.value / totalRevenue) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
