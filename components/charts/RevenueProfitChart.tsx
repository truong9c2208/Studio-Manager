import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Invoice } from '../../types';

interface RevenueProfitChartProps {
    invoices: Invoice[];
}

// Generate points for SVG polyline
const generatePoints = (data: number[], maxValue: number, width: number, height: number): string => {
    if (data.length < 2) return '';
    return data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / maxValue) * height;
        return `${x},${y}`;
    }).join(' ');
};

export const RevenueProfitChart: React.FC<RevenueProfitChartProps> = ({ invoices }) => {
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const revenue = [3200, 1800, 4500, 4200, 6800, 5500, 7200]; // Mock revenue
        // Simulate net profit as 65% of revenue with some variation
        const profit = revenue.map(r => r * 0.65 * (1 + (Math.random() - 0.5) * 0.1)); 

        return { months, revenue, profit };
    }, [invoices]);

    const maxValue = Math.max(...chartData.revenue) * 1.1; // Add 10% padding
    const width = 500;
    const height = 200;

    const revenuePoints = generatePoints(chartData.revenue, maxValue, width, height);
    const profitPoints = generatePoints(chartData.profit, maxValue, width, height);

    return (
        <Card title="Revenue vs. Profit Trend">
            <div className="h-64 relative">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines and labels */}
                    <g className="text-xs text-text-secondary">
                        {[0.25, 0.5, 0.75, 1].map(multiple => (
                            <line key={multiple} x1="0" y1={height - height * multiple} x2={width} y2={height - height * multiple} stroke="#e2e8f0" strokeWidth="1" />
                        ))}
                    </g>
                    
                    {/* Profit line */}
                    <polyline points={profitPoints} fill="none" stroke="#10b981" strokeWidth="2" />
                    {chartData.profit.map((val, i) => <circle key={`p-${i}`} cx={(i / (chartData.months.length - 1)) * width} cy={height - (val / maxValue) * height} r="3" fill="#10b981" />)}
                    
                    {/* Revenue line */}
                    <polyline points={revenuePoints} fill="none" stroke="#4f46e5" strokeWidth="2" />
                    {chartData.revenue.map((val, i) => <circle key={`r-${i}`} cx={(i / (chartData.months.length - 1)) * width} cy={height - (val / maxValue) * height} r="3" fill="#4f46e5" />)}

                </svg>
                 <div className="absolute bottom-0 w-full flex justify-between px-2 text-xs text-[#F2F2F2]">
                    {chartData.months.map(month => <span key={month}>{month}</span>)}
                </div>
            </div>
            <div className="flex justify-center space-x-4 text-sm mt-4">
                <div className="flex items-center text-[#F2F2F2]"><span className="w-3 h-3 rounded-full bg-accent mr-2"></span>Revenue</div>
                <div className="flex items-center text-[#F2F2F2]"><span className="w-3 h-3 rounded-full bg-success mr-2"></span>Profit</div>
            </div>
        </Card>
    );
};
