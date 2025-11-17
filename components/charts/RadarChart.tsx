import React from 'react';
import { Card } from '../common/Card';
import type { KPI } from '../../types';

interface RadarChartProps {
    kpi: KPI;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

export const RadarChart: React.FC<RadarChartProps> = ({ kpi }) => {
    const labels = ["Teamwork", "Problem Solving", "Communication", "Punctuality", "Quality of Work"];
    const data = [kpi.teamwork, kpi.problemSolving, kpi.communication, kpi.punctuality, kpi.qualityOfWork];

    const size = 200;
    const center = size / 2;
    const radius = size * 0.35; // Reduced radius slightly to give labels more space

    const points = data.map((value, i) => {
        const angle = (i / labels.length) * 360;
        const pointRadius = (value / 100) * radius;
        return polarToCartesian(center, center, pointRadius, angle);
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
    
    const getTextAnchor = (angle: number): 'start' | 'end' | 'middle' => {
        if (angle === 0 || angle === 180) return 'middle';
        if (angle > 0 && angle < 180) return 'start';
        return 'end';
    };
    
    return (
        <Card title="Key Performance Indicators">
            <div className="flex items-center justify-center h-64">
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    <g transform={`translate(0, 10)`}>
                        {/* Grid lines and labels */}
                        {labels.map((label, i) => {
                            const angle = (i / labels.length) * 360;
                            const p1 = polarToCartesian(center, center, radius, angle);
                            const p2 = polarToCartesian(center, center, radius * 1.3, angle);
                            
                            const textAnchor = getTextAnchor(angle);
                            const yOffset = label.includes(' ') ? -4 : 0; // Adjust for multi-line text

                            return (
                                <g key={label}>
                                    <line x1={center} y1={center} x2={p1.x} y2={p1.y} stroke="#e2e8f0" strokeWidth="1" />
                                    <text x={p2.x} y={p2.y + yOffset} fontSize="9" textAnchor={textAnchor} dominantBaseline="middle" fill="#6b7280">
                                       {label.split(' ').map((word, index) => (
                                          <tspan key={index} x={p2.x} dy={index > 0 ? '1.2em' : 0}>{word}</tspan>
                                       ))}
                                    </text>
                                </g>
                            );
                        })}
                        {/* Concentric polygons */}
                        {[0.25, 0.5, 0.75, 1].map(r => (
                             <polygon 
                                key={r}
                                points={labels.map((_, i) => {
                                    const angle = (i / labels.length) * 360;
                                    const p = polarToCartesian(center, center, radius * r, angle);
                                    return `${p.x},${p.y}`;
                                }).join(' ')} 
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="1"
                             />
                        ))}
                        {/* Data polygon */}
                        <path d={pathData} fill="rgba(79, 70, 229, 0.4)" stroke="#4f46e5" strokeWidth="2" />
                         {/* Data points */}
                         {points.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4f46e5" />
                        ))}
                    </g>
                </svg>
            </div>
        </Card>
    );
};