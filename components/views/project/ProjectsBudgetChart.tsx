import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Project } from '../../../types';

interface ProjectsBudgetChartProps {
    projects: Project[];
}

export const ProjectsBudgetChart: React.FC<ProjectsBudgetChartProps> = ({ projects }) => {
    // Show top 7 projects by budget to avoid clutter
    const topProjects = useMemo(() => {
        return [...projects]
            .filter(p => p.status !== 'Completed')
            .sort((a, b) => b.budget - a.budget)
            .slice(0, 7);
    }, [projects]);

    return (
        <Card title="Active Projects Budget Overview">
            <div className="space-y-4 pt-2 h-64 overflow-y-auto">
                {topProjects.length > 0 ? topProjects.map(project => {
                    const spentPercentage = (project.spent / project.budget) * 100;
                    let barColor = 'bg-info';
                    if (spentPercentage > 90) {
                        barColor = 'bg-danger';
                    } else if (spentPercentage > 75) {
                        barColor = 'bg-warning';
                    }
                    
                    return (
                        <div key={project.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-[#FFFFFF] truncate" title={project.name}>{project.name}</span>
                                <span className="text-[#F2F2F2] text-xs">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-primary rounded-full h-3 relative overflow-hidden border border-secondary">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
                                    style={{ width: `${spentPercentage}%` }}
                                />
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        <p>No active projects with budgets.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
