import React from 'react';
import { Card } from '../common/Card';

export const LineChart: React.FC = () => {
    // This is a simplified static SVG representation of a line chart.
    // A real implementation would use a charting library like Chart.js or D3.
    return (
        <Card title="Customer Growth">
            <div className="h-64">
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="40" y1="10" x2="40" y2="170" stroke="#374151" strokeWidth="1" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#374151" strokeWidth="1" />
                    
                    {/* Y-axis labels */}
                    <text x="35" y="15" textAnchor="end" fill="#9ca3af" fontSize="12">100</text>
                    <text x="35" y="90" textAnchor="end" fill="#9ca3af" fontSize="12">50</text>
                    <text x="35" y="165" textAnchor="end" fill="#9ca3af" fontSize="12">0</text>

                    {/* X-axis labels */}
                    <text x="60" y="185" textAnchor="middle" fill="#9ca3af" fontSize="12">Q1</text>
                    <text x="140" y="185" textAnchor="middle" fill="#9ca3af" fontSize="12">Q2</text>
                    <text x="220" y="185" textAnchor="middle" fill="#9ca3af" fontSize="12">Q3</text>
                    <text x="300" y="185" textAnchor="middle" fill="#9ca3af" fontSize="12">Q4</text>
                    
                    {/* Line path */}
                    <path d="M 60 140 C 100 100, 100 40, 140 50 S 180 80, 220 70 S 260 40, 300 20" stroke="#6366f1" fill="none" strokeWidth="2" />

                    {/* Data points */}
                    <circle cx="60" cy="140" r="3" fill="#6366f1" />
                    <circle cx="140" cy="50" r="3" fill="#6366f1" />
                    <circle cx="220" cy="70" r="3" fill="#6366f1" />
                    <circle cx="300" cy="20" r="3" fill="#6366f1" />
                </svg>
            </div>
        </Card>
    );
};
