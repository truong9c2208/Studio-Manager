import React from 'react';
import { Card } from '../common/Card';

interface CustomerSatisfactionGaugeProps {
    score: number; // A score from 0 to 100
}

export const CustomerSatisfactionGauge: React.FC<CustomerSatisfactionGaugeProps> = ({ score }) => {
    const percentage = Math.min(Math.max(score, 0), 100);
    const circumference = 54 * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage < 50) return '#ef4444'; // red
        if (percentage < 80) return '#f59e0b'; // yellow
        return '#10b981'; // green
    };

    return (
        <Card title="Customer Satisfaction">
            <div className="flex items-center justify-center relative h-64">
                <svg className="transform -rotate-90" width="80%" height="80%" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={getColor()}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{percentage}%</span>
                    <span className="text-text-secondary text-sm">Satisfied</span>
                </div>
            </div>
        </Card>
    );
};
