import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Product, Invoice } from '../../../types';
import { ArrowUpIcon } from '../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../icons/ArrowDownIcon';

interface ProductPerformanceChartProps {
    invoices: Invoice[];
    products: Product[];
}

export const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({ invoices, products }) => {
    
    const productSales = useMemo(() => {
        const salesCount: { [productId: string]: number } = {};

        invoices.forEach(invoice => {
            if (invoice.status === 'Paid' && invoice.products) {
                invoice.products.forEach(item => {
                    salesCount[item.productId] = (salesCount[item.productId] || 0) + item.quantity;
                });
            }
        });
        
        return products.map(product => ({
            ...product,
            sales: salesCount[product.id] || 0,
        })).sort((a, b) => b.sales - a.sales);

    }, [invoices, products]);

    const topSellers = productSales.slice(0, 5);
    const bottomSellers = [...productSales].reverse().slice(0, 5);

    const maxSales = topSellers[0]?.sales || 1;

    const ProductRow: React.FC<{product: {name: string, sales: number, image: string}, isTop: boolean}> = ({ product, isTop }) => (
         <div className="flex items-center space-x-3 text-sm">
            <img src={product.image} alt={product.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold truncate">{product.name}</p>
                <div className="w-full bg-primary rounded-full h-1.5 mt-1">
                    <div 
                        className={`h-1.5 rounded-full ${isTop ? 'bg-success' : 'bg-danger'}`}
                        style={{ width: `${(product.sales / maxSales) * 100}%`}}
                    />
                </div>
            </div>
            <span className="font-bold w-10 text-right">{product.sales}</span>
        </div>
    );

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center mb-3 text-[#F2F2F2]">
                        <ArrowUpIcon className="w-5 h-5 mr-2 text-success" />
                        Top Selling Products
                    </h3>
                    <div className="space-y-3 text-[#F2F2F2]">
                        {topSellers.map(p => <ProductRow key={p.id} product={p} isTop={true} />)}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold flex items-center mb-3 text-[#F2F2F2]">
                        <ArrowDownIcon className="w-5 h-5 mr-2 text-danger" />
                        Bottom Selling Products
                    </h3>
                    <div className="space-y-3 text-[#F2F2F2]">
                        {bottomSellers.map(p => <ProductRow key={p.id} product={p} isTop={false} />)}
                    </div>
                </div>
            </div>
        </Card>
    );
};