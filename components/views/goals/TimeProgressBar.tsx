import React, { useMemo } from 'react';
import { CalendarDaysIcon } from '../../icons/CalendarDaysIcon';

interface TimeProgressBarProps {
  period: string;
  goalProgress: number;
}

const getPeriodDateRange = (period: string): { start: Date, end: Date } => {
    const year = parseInt(period.split(' ')[1], 10);
    if (period.startsWith('Annual')) {
        return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
    }
    const quarter = parseInt(period.substring(1), 10);
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, endMonth + 1, 0); // Day 0 of next month is last day of current month
    return { start, end };
};

export const TimeProgressBar: React.FC<TimeProgressBarProps> = ({ period, goalProgress }) => {
    const { timeElapsedPercent, daysLeft, statusText, statusColor, timeBarColor, goalBarColor } = useMemo(() => {
        const { start, end } = getPeriodDateRange(period);
        const today = new Date();
        
        if (today > end) { // Period is over
            return {
                timeElapsedPercent: 100,
                daysLeft: 0,
                statusText: 'Period Ended',
                statusColor: 'text-text-secondary',
                timeBarColor: 'bg-slate-300', // Gray for time elapsed
                goalBarColor: 'bg-success' // Green for final progress
            };
        }

        const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        const elapsedDays = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
        const timeElapsedPercent = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
        
        const daysLeftValue = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24)));
        
        const progressBehindTime = timeElapsedPercent > goalProgress + 5; // Allow a 5% buffer
        const atRisk = progressBehindTime && timeElapsedPercent < 85;
        const behind = progressBehindTime && timeElapsedPercent >= 85;
        
        let statusText = 'On Track';
        let statusColor = 'text-success';
        if (behind) {
            statusText = 'Behind';
            statusColor = 'text-danger';
        } else if (atRisk) {
            statusText = 'At Risk';
            statusColor = 'text-warning';
        }

        return { 
            timeElapsedPercent, 
            daysLeft: daysLeftValue, 
            statusText, 
            statusColor, 
            timeBarColor: 'bg-slate-300',
            goalBarColor: 'bg-accent' // Keep original color for active periods
        };
    }, [period, goalProgress]);

    return (
        <div className="text-xs text-text-secondary space-y-2">
            <div className="relative h-2 w-full bg-slate-200 rounded-full">
                {/* Time elapsed bar */}
                <div 
                    className={`absolute top-0 left-0 h-2 ${timeBarColor} rounded-full`}
                    style={{ width: `${timeElapsedPercent}%` }}
                    title={`Time elapsed: ${Math.round(timeElapsedPercent)}%`}
                />
                {/* Goal progress indicator */}
                <div 
                    className={`absolute top-0 left-0 h-2 ${goalBarColor} rounded-full`}
                    style={{ width: `${goalProgress}%` }}
                    title={`Goal progress: ${goalProgress}%`}
                />
            </div>
            <div className="flex justify-between items-center">
                <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                <div className="flex items-center space-x-1">
                    <CalendarDaysIcon className="w-3 h-3" />
                    <span>{daysLeft} days left</span>
                </div>
            </div>
        </div>
    );
};