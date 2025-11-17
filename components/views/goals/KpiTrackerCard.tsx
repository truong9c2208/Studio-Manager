import React from 'react';
import type { Goal } from '../../../types';
import { TrendingUpIcon } from '../../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../../icons/TrendingDownIcon';

interface KpiTrackerCardProps {
    kpi: Goal;
}

export const KpiTrackerCard: React.FC<KpiTrackerCardProps> = ({ kpi }) => {
    const kr = kpi.keyResults[0];
    const isDecrease = kr.targetDirection === 'decrease';

    // Simplified progress logic for display
    const progress = kr.targetValue !== 0 
        ? isDecrease
            ? ((kr.targetValue - (kr.currentValue - kr.targetValue)) / kr.targetValue) * 100
            : (kr.currentValue / kr.targetValue) * 100
        : 0;
        
    const boundedProgress = Math.max(0, Math.min(100, progress));

    const onTrack = isDecrease ? kr.currentValue <= kr.targetValue : kr.currentValue >= kr.targetValue;

    const progressColor = onTrack ? 'bg-success' : (boundedProgress > 70 ? 'bg-warning' : 'bg-danger');

    return (
        <div className="bg-primary p-4 rounded-lg border border-secondary">
            <p className="text-sm font-semibold text-text-primary truncate">{kpi.title}</p>
            <div className="flex items-end justify-between mt-2">
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">{kr.currentValue}</span>
                    <span className="text-sm text-text-secondary">{kr.unit}</span>
                </div>
                <div className="text-right text-xs text-text-secondary">
                    <p>Target: {kr.targetValue} {kr.unit}</p>
                </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${boundedProgress}%` }}></div>
            </div>
        </div>
    );
}
