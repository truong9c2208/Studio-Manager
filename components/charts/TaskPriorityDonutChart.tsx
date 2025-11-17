import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Project, Task } from '../../types';

interface TaskPriorityDonutChartProps {
    projects: Project[];
}

export const TaskPriorityDonutChart: React.FC<TaskPriorityDonutChartProps> = ({ projects }) => {
    const allTasks = useMemo(() => projects.flatMap(p => p.tasks), [projects]);

    const priorityCounts = useMemo(() => {
        const counts: { [key in Task['priority']]: number } = {
            'High': 0,
            'Medium': 0,
            'Low': 0,
        };
        allTasks.forEach(task => {
            if (task.priority in counts) {
                counts[task.priority]++;
            }
        });
        return counts;
    }, [allTasks]);

    const totalTasks = allTasks.length;
    const data = [
        { label: 'High Priority', value: priorityCounts['High'], color: '#ef4444' }, // danger
        { label: 'Medium Priority', value: priorityCounts['Medium'], color: '#f59e0b' }, // warning
        { label: 'Low Priority', value: priorityCounts['Low'], color: '#3b82f6' }, // info
    ];

    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title="Tasks by Priority">
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalTasks > 0 && data.map((item, index) => {
                            if (item.value === 0) return null;
                            const dasharray = (item.value / totalTasks) * circumference;
                            const strokeDashoffset = offset;
                            offset += dasharray;
                            return (
                                <circle key={index} cx="60" cy="60" r="54" fill="none" stroke={item.color} strokeWidth="12" strokeDasharray={`${dasharray} ${circumference}`} strokeDashoffset={-strokeDashoffset} strokeLinecap="round" />
                            );
                        })}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{totalTasks}</span>
                        <span className="text-text-secondary">Tasks</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 space-y-2 text-sm w-full max-w-[200px]">
                    {data.map(item => (
                         <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-text-secondary">{item.label}</span>
                            </div>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
