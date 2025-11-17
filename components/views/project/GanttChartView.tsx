import React, { useState, useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Task } from '../../../types';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
import { MiniCalendar } from './MiniCalendar';

interface GanttChartViewProps {
    tasks: Task[];
}

// Helper functions defined outside the component for performance and purity
const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getStartOfWeek = (date: Date): Date => {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0); // Normalize to midnight
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday (0) to get Monday
    dt.setDate(diff);
    return dt;
}

export const GanttChartView: React.FC<GanttChartViewProps> = ({ tasks }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    const weekDays = useMemo(() => {
        const start = getStartOfWeek(viewDate);
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, [viewDate]);

    const viewStartDate = weekDays[0];
    const viewEndDate = addDays(weekDays[6], 1); // This is the start of the next week, for exclusive end date comparisons

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const todayMarkerPosition = useMemo(() => {
        if (today >= viewStartDate && today < viewEndDate) {
            const diffDays = (today.getTime() - viewStartDate.getTime()) / (1000 * 3600 * 24);
            return `${(diffDays / 7) * 100}%`;
        }
        return null;
    }, [today, viewStartDate, viewEndDate]);

    const handlePrevWeek = () => {
        setViewDate(prev => addDays(prev, -7));
    };

    const handleNextWeek = () => {
        setViewDate(prev => addDays(prev, 7));
    };
    
    const handleDateSelect = (date: Date) => {
        setViewDate(date);
        setIsCalendarOpen(false);
    };

    const getTaskBarProps = (task: Task) => {
        if (!task.startDate) {
            return { style: { display: 'none' as const }, className: '' };
        }
    
        const taskStart = new Date(task.startDate);
        taskStart.setHours(0, 0, 0, 0);
    
        const taskEnd = task.deadline 
            ? addDays(new Date(task.deadline), 1) 
            : addDays(new Date(task.startDate), 1);
        taskEnd.setHours(0, 0, 0, 0);
    
        const effectiveStart = new Date(Math.max(viewStartDate.getTime(), taskStart.getTime()));
        const effectiveEnd = new Date(Math.min(viewEndDate.getTime(), taskEnd.getTime()));
    
        if (effectiveStart >= effectiveEnd) {
            return { style: { display: 'none' as const }, className: '' };
        }
        
        const startDayIndex = (effectiveStart.getTime() - viewStartDate.getTime()) / (1000 * 3600 * 24);
        const durationDays = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 3600 * 24);
    
        if (durationDays <= 0) {
           return { style: { display: 'none' as const }, className: '' };
        }
    
        const left = (startDayIndex / 7) * 100;
        const width = (durationDays / 7) * 100;
    
        const statusColorClasses: Record<Task['status'], string> = {
            'To Do': 'bg-info',
            'In Progress': 'bg-warning',
            'Done': 'bg-success',
        };
    
        return {
            style: {
                position: 'absolute' as const,
                left: `${left}%`,
                width: `${width}%`,
            },
            className: statusColorClasses[task.status] || 'bg-text-secondary',
        };
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 -mt-2">
                <h2 className="text-2xl font-bold">Weekly Timeline</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevWeek} className="p-1 rounded-md hover:bg-secondary"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <div className="relative">
                        <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="text-sm font-semibold w-48 text-center p-1 rounded-md hover:bg-secondary">
                            {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            {' - '}
                            {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </button>
                        {isCalendarOpen && (
                            <MiniCalendar 
                                selectedDate={viewDate}
                                onDateSelect={handleDateSelect}
                                onClose={() => setIsCalendarOpen(false)}
                            />
                        )}
                    </div>
                    <button onClick={handleNextWeek} className="p-1 rounded-md hover:bg-secondary"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="relative" style={{ minWidth: '800px' }}>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 h-10 border-b border-primary bg-secondary sticky top-0 z-20">
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="text-center font-semibold text-sm border-r border-slate-200 last:border-r-0 py-2">
                                <span className="text-text-secondary">{day.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</span>{' '}
                                <span className="text-text-primary">{day.getDate()}</span>
                            </div>
                        ))}
                    </div>

                    {/* Task Rows container */}
                    <div className="relative pt-2 space-y-1">
                        {/* Background Grid Lines */}
                        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-7 z-0">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className="h-full border-r border-slate-200 last:border-r-0"></div>
                            ))}
                        </div>
                        
                        {/* Today Marker */}
                        {todayMarkerPosition && (
                            <div 
                                className="absolute top-0 h-full w-0.5 bg-success" 
                                style={{ left: todayMarkerPosition, zIndex: 5 }}
                                title="Today"
                            >
                               <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-success ring-2 ring-white"></div>
                            </div>
                        )}

                        {/* Task Rows */}
                        {tasks.map((task) => {
                             const { style, className } = getTaskBarProps(task);
                            return (
                                <div key={task.id} className="relative h-8 group">
                                    <div 
                                        className={`z-10 h-6 top-1 rounded-md transition-all duration-300 flex items-center px-2 ${className}`}
                                        style={style}
                                    >
                                       <span className="text-xs text-white font-semibold truncate" title={task.title}>{task.title}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};