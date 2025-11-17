import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Task } from '../../../types';

interface TaskStatusDonutChartProps {
    tasks: Task[];
}

export const TaskStatusDonutChart: React.FC<TaskStatusDonutChartProps> = ({ tasks }) => {
    const statusCounts = useMemo(() => {
        const counts = {
            'To Do': 0,
            'In Progress': 0,
            'Done': 0,
        };
        tasks.forEach(task => {
            if (task.status in counts) {
                counts[task.status]++;
            }
        });
        return counts;
    }, [tasks]);

    const totalTasks = tasks.length;
    const data = [
        { label: 'To Do', value: statusCounts['To Do'], color: '#3b82f6' }, // info
        { label: 'In Progress', value: statusCounts['In Progress'], color: '#f59e0b' }, // warning
        { label: 'Done', value: statusCounts['Done'], color: '#10b981' }, // success
    ];

    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title="Task Status">
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full col-start-1 row-start-1" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalTasks > 0 && data.map((item, index) => {
                            if (item.value === 0) return null;
                            const dasharray = (item.value / totalTasks) * circumference;
                            const strokeDashoffset = offset;
                            offset += dasharray;

                            return (
                                <circle
                                    key={index}
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="12"
                                    strokeDasharray={`${dasharray} ${circumference}`}
                                    strokeDashoffset={-strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>
                    <div className="flex flex-col items-center justify-center pointer-events-none col-start-1 row-start-1">
                        <span className="text-3xl font-bold text-[#FFFFFF]">{totalTasks}</span>
                        <span className="text-[#F2F2F2]">Total Tasks</span>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-8 space-y-2 text-sm w-full max-w-[200px]">
                    {data.map(item => (
                         <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                                <span className="text-[#F2F2F2] truncate">{item.label}</span>
                            </div>
                            <span className="font-semibold text-[#FFFFFF]">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};