import React, { useMemo } from 'react';
import type { Event } from '../../../types';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';

interface EventTimelineProps {
    events: Event[];
    viewDate: Date;
    onViewDateChange: (date: Date) => void;
    selectedEventId: string | null;
    onSelectEvent: (eventId: string) => void;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, viewDate, onViewDateChange, selectedEventId, onSelectEvent }) => {
    
    const dayCount = 14; 
    const timelineStart = useMemo(() => addDays(viewDate, -7), [viewDate]);
    const timelineDays = useMemo(() => {
        return Array.from({ length: dayCount }).map((_, i) => addDays(timelineStart, i));
    }, [timelineStart]);

    const timelineEnd = addDays(timelineDays[timelineDays.length - 1], 1);

    const handlePrev = () => onViewDateChange(addDays(viewDate, -7));
    const handleNext = () => onViewDateChange(addDays(viewDate, 7));

    const getEventBarProps = (event: Event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = addDays(new Date(event.endDate), 1);
        
        eventStart.setHours(0,0,0,0);
        eventEnd.setHours(0,0,0,0);

        const effectiveStart = new Date(Math.max(timelineStart.getTime(), eventStart.getTime()));
        const effectiveEnd = new Date(Math.min(timelineEnd.getTime(), eventEnd.getTime()));

        if (effectiveStart >= effectiveEnd) return null;

        const startDayIndex = (effectiveStart.getTime() - timelineStart.getTime()) / (1000 * 3600 * 24);
        const durationDays = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 3600 * 24);
        
        if (durationDays <= 0) return null;

        return {
            left: `${(startDayIndex / dayCount) * 100}%`,
            width: `${(durationDays / dayCount) * 100}%`,
        };
    };

    const timelineRows: Event[][] = useMemo(() => {
        const rows: Event[][] = [];
        const sortedEvents = [...events].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        for (const event of sortedEvents) {
            let placed = false;
            for (const row of rows) {
                const lastEventInRow = row[row.length - 1];
                if (new Date(event.startDate) > new Date(lastEventInRow.endDate)) {
                    row.push(event);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                rows.push([event]);
            }
        }
        return rows;
    }, [events]);

    let lastMonth: string | null = null;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="bg-primary p-4 rounded-lg shadow-sm h-full">
            <div className="flex justify-center items-center mb-4 relative">
                 <button onClick={handlePrev} className="absolute left-0 p-1 rounded-full hover:bg-secondary"><ChevronLeftIcon className="w-5 h-5" /></button>
                 <div>
                    <h3 className="text-lg font-semibold">Timeline View</h3>
                    <p className="text-sm text-text-secondary">
                        {timelineDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {' - '}
                        {timelineDays[timelineDays.length - 1].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                 </div>
                 <button onClick={handleNext} className="absolute right-0 p-1 rounded-full hover:bg-secondary"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <div className="relative">
                {/* Header */}
                <div className="grid" style={{ gridTemplateColumns: `repeat(${dayCount}, minmax(0, 1fr))`}}>
                    {timelineDays.map(day => {
                        const currentMonth = monthNames[day.getMonth()];
                        const showMonth = currentMonth !== lastMonth;
                        lastMonth = currentMonth;
                        return (
                            <div key={day.toISOString()} className="text-center border-r border-secondary last:border-r-0 py-1 h-12">
                               {showMonth && <p className="text-xs text-text-secondary font-semibold">{currentMonth}</p>}
                               <p className={`font-semibold ${!showMonth ? 'mt-5' : ''}`}>{day.getDate()}</p>
                            </div>
                        )
                    })}
                </div>
                {/* Body */}
                <div className="relative border-t border-secondary pt-2 min-h-[400px]">
                    {/* Background Grid */}
                    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${dayCount}, minmax(0, 1fr))`}}>
                         {timelineDays.map((day, i) => (
                            <div key={i} className="h-full border-r border-secondary last:border-r-0"></div>
                         ))}
                    </div>

                    {/* Event Rows */}
                    <div className="relative space-y-1">
                        {timelineRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="relative h-8">
                                {row.map(event => {
                                    const props = getEventBarProps(event);
                                    if (!props) return null;
                                    const isSelected = selectedEventId === event.id;

                                    return (
                                        <button 
                                            key={event.id}
                                            onClick={() => onSelectEvent(event.id)}
                                            style={props}
                                            className={`absolute top-1 h-6 rounded flex items-center px-2 text-white text-xs font-semibold truncate transition-all duration-200
                                                ${isSelected ? 'bg-accent shadow-lg scale-105 z-10' : 'bg-indigo-400 hover:bg-accent'}
                                            `}
                                        >
                                            {event.title}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};