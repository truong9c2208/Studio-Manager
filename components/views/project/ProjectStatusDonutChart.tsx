import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Project } from '../../../types';

interface ProjectStatusDonutChartProps {
    title: string;
    projects: Project[];
}

export const ProjectStatusDonutChart: React.FC<ProjectStatusDonutChartProps> = ({ title, projects }) => {
    const statusCounts = useMemo(() => {
        const counts: { [key in Project['status']]: number } = {
            'On Track': 0,
            'At Risk': 0,
            'Off Track': 0,
            'Completed': 0,
        };
        projects.forEach(project => {
            if (project.status in counts) {
                counts[project.status]++;
            }
        });
        return counts;
    }, [projects]);

    const totalProjects = projects.length;
    const data = [
        { label: 'On Track', value: statusCounts['On Track'], color: '#10b981' }, // success
        { label: 'At Risk', value: statusCounts['At Risk'], color: '#f59e0b' }, // warning
        { label: 'Off Track', value: statusCounts['Off Track'], color: '#ef4444' }, // danger
        { label: 'Completed', value: statusCounts['Completed'], color: '#3b82f6' }, // info
    ];

    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title={title}>
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full col-start-1 row-start-1" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalProjects > 0 && data.map((item, index) => {
                            if (item.value === 0) return null;
                            const dasharray = (item.value / totalProjects) * circumference;
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
                        <span className="text-3xl font-bold text-[#FFFFFF]">{totalProjects}</span>
                        <span className="text-[#F2F2F2]">Projects</span>
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