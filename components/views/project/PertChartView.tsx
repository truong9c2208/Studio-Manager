import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { Task, Employee } from '../../../types';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
import { MiniCalendar } from './MiniCalendar';
import { StarIcon } from '../../icons/StarIcon';

interface PertNode {
    task: Task;
    x: number;
    y: number;
    width: number;
    ref: React.RefObject<HTMLDivElement>;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const DAY_WIDTH = 170;
const LANE_HEIGHT = 80;
const NODE_PADDING = 8;

export const PertChartView: React.FC<{ tasks: Task[]; criticalPath: string[]; onTaskClick: (task: Task) => void; currentUser: Employee; }> = ({ tasks, criticalPath, onTaskClick, currentUser }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { weekDays, viewStartDate, viewEndDate } = useMemo(() => {
        const start = new Date(viewDate);
        start.setDate(start.getDate() - 3); // Center the view date
        start.setHours(0,0,0,0);
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        return {
            weekDays: days,
            viewStartDate: days[0],
            viewEndDate: addDays(days[6], 1),
        };
    }, [viewDate]);

    const handlePrev = () => setViewDate(prev => addDays(prev, -7));
    const handleNext = () => setViewDate(prev => addDays(prev, 7));
    const handleDateSelect = (date: Date) => {
        setViewDate(date);
        setIsCalendarOpen(false);
    };

    const { nodes, layoutHeight } = useMemo(() => {
        const visibleTasks = tasks.filter(task => {
            if (!task.startDate) return false;
            const taskStart = new Date(task.startDate);
            taskStart.setHours(0,0,0,0);
            const pertDuration = Math.round(((task.optimisticDuration || 1) + 4 * (task.mostLikelyDuration || 1) + (task.pessimisticDuration || 1)) / 6);
            const taskEnd = addDays(taskStart, Math.max(1, pertDuration));
            
            return (taskStart < viewEndDate && taskEnd > viewStartDate);
        });

        const sortedTasks = visibleTasks.sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
        
        const lanes: Date[] = []; // Stores the end date of the last task in each lane
        const newNodes: PertNode[] = [];

        sortedTasks.forEach(task => {
            const taskStart = new Date(task.startDate!);
            const pertDuration = Math.round(((task.optimisticDuration || 1) + 4 * (task.mostLikelyDuration || 1) + (task.pessimisticDuration || 1)) / 6);
            const taskEnd = addDays(taskStart, Math.max(1, pertDuration));
            const nodeWidth = Math.max(1, pertDuration) * DAY_WIDTH - NODE_PADDING;

            let assignedLane = -1;
            for (let i = 0; i < lanes.length; i++) {
                if (taskStart >= lanes[i]) {
                    assignedLane = i;
                    break;
                }
            }

            if (assignedLane === -1) {
                assignedLane = lanes.length;
            }
            lanes[assignedLane] = taskEnd;

            const daysFromStart = (taskStart.getTime() - viewStartDate.getTime()) / (1000 * 3600 * 24);
            
            newNodes.push({
                task: task,
                x: daysFromStart * DAY_WIDTH,
                y: assignedLane * LANE_HEIGHT,
                width: nodeWidth,
                ref: React.createRef<HTMLDivElement>(),
            });
        });

        return { nodes: newNodes, layoutHeight: (lanes.length + 1) * LANE_HEIGHT };
    }, [tasks, viewStartDate, viewEndDate]);
    
    const containerWidth = 7 * DAY_WIDTH;

    return (
        <div className="bg-[#1B3C53] rounded-lg border">
            <div className="p-4 flex justify-between items-center border-b border-secondary">
                <button onClick={handlePrev} className="p-1 rounded-md hover:bg-[#10b981] text-[#F2F2F2]"><ChevronLeftIcon className="w-5 h-5" /></button>
                <div className="relative">
                    <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="text-center p-1 rounded-md hover:bg-[#10b981]">
                        <h3 className="font-semibold text-[#F2F2F2]">{weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                    </button>
                    {isCalendarOpen && <MiniCalendar selectedDate={viewDate} onDateSelect={handleDateSelect} onClose={() => setIsCalendarOpen(false)} />}
                </div>
                <button onClick={handleNext} className="p-1 rounded-md hover:bg-[#10b981] text-[#F2F2F2]"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
                <div ref={containerRef} className="relative p-4" style={{ width: containerWidth, height: layoutHeight }}>
                    {/* Background grid */}
                    <div className="absolute inset-0 grid grid-cols-7">
                        {weekDays.map((day, i) => (
                            <div key={i} className={`h-full ${i < 6 ? 'border-r border-secondary' : ''}`}>
                                <div className="text-center font-semibold text-sm py-1">
                                    <span className="text-[#F2F2F2]">{day.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</span>{' '}
                                    <span className="text-[#FFFFFF]">{day.getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Task Nodes */}
                    {nodes.map(({ task, x, y, width, ref }) => {
                        const isCritical = criticalPath.includes(task.id);
                        const isMyTask = task.assigneeId === currentUser.id;
                        return (
                            <div
                                key={task.id}
                                ref={ref}
                                onClick={() => onTaskClick(task)}
                                className={`absolute p-3 rounded-lg shadow-md transition-all duration-300 flex flex-col justify-center cursor-pointer 
                                    ${isCritical ? 'bg-red-50 border-2 border-danger hover:shadow-lg' : 'bg-secondary border hover:bg-slate-200'}
                                    ${isMyTask ? 'ring-2 ring-inset ring-accent' : ''}
                                `}
                                style={{
                                    transform: `translate(${x}px, ${y}px)`,
                                    top: '40px', // Offset for header
                                    width: `${width}px`,
                                    height: `${LANE_HEIGHT - 20}px`
                                }}
                            >
                                <p className="font-bold text-sm truncate flex items-center" title={task.title}>
                                    {isMyTask && <StarIcon className="w-4 h-4 mr-1.5 text-yellow-400 flex-shrink-0" />}
                                    {task.title}
                                </p>
                                <p className="text-xs text-text-secondary">{task.suggestedRole || 'N/A'}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};