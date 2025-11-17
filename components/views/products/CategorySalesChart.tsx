
import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Product, ProductCategory, Invoice } from '../../../types';

interface CategorySalesChartProps {
    invoices: Invoice[];
    products: Product[];
    categories: ProductCategory[];
}

const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export const CategorySalesChart: React.FC<CategorySalesChartProps> = ({ invoices, products, categories }) => {
    
    const categoryRevenue = useMemo(() => {
        const revenueMap: { [categoryId: string]: number } = {};

        invoices.forEach(invoice => {
            if (invoice.status === 'Paid' && invoice.products) {
                invoice.products.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        revenueMap[product.categoryId] = (revenueMap[product.categoryId] || 0) + item.price * item.quantity;
                    }
                });
            }
        });

        return categories.map((cat, index) => ({
            name: cat.name,
            revenue: revenueMap[cat.id] || 0,
            color: colors[index % colors.length],
        })).sort((a,b) => b.revenue - a.revenue);
    }, [invoices, products, categories]);

    const totalRevenue = categoryRevenue.reduce((sum, cat) => sum + cat.revenue, 0);

    return (
        <Card title="Revenue by Category">
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalRevenue > 0 && categoryRevenue.map((item, index) => {
                             if (item.revenue === 0) return null;
                             const circumference = 54 * 2 * Math.PI;
                             const dasharray = (item.revenue / totalRevenue) * circumference;
                             const offset = categoryRevenue.slice(0, index).reduce((acc, curr) => acc + (curr.revenue / totalRevenue) * circumference, 0);

                             return (
                                 <circle
                                     key={index}
                                     cx="60" cy="60" r="54"
                                     fill="none"
                                     stroke={item.color}
                                     strokeWidth="12"
                                     strokeDasharray={`${dasharray} ${circumference}`}
                                     strokeDashoffset={-offset}
                                     strokeLinecap="round"
                                 />
                             );
                        })}
                    </svg>
                     <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-[#FFFFFF]">${totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        <span className="text-[#F2F2F2] text-sm">Total Revenue</span>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-8 space-y-2 text-sm w-full max-w-[200px]">
                    {categoryRevenue.map(item => (
                         <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-[#F2F2F2] truncate">{item.name}</span>
                            </div>
                            <span className="font-semibold text-[#FFFFFF]">${item.revenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
