
import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Project, Employee } from '../../../types';
import { StarIcon } from '../../icons/StarIcon';

interface OverallTeamContributionChartProps {
    projects: Project[];
    allEmployees: Employee[];
}

export const OverallTeamContributionChart: React.FC<OverallTeamContributionChartProps> = ({ projects, allEmployees }) => {
    const contribution = useMemo(() => {
        const points: { [key: string]: number } = {};
        
        projects.flatMap(p => p.tasks).forEach(task => {
            // FIX: Property 'assignee' does not exist on type 'Task'. Did you mean 'assigneeId'?
            if (task.assigneeId && task.status === 'Done' && task.points) {
                // FIX: Property 'assignee' does not exist on type 'Task'. Did you mean 'assigneeId'?
                points[task.assigneeId] = (points[task.assigneeId] || 0) + task.points;
            }
        });
        
        // FIX: The key of the points object is an employeeId, so lookup must be by ID, not by name.
        return Object.entries(points).map(([employeeId, totalPoints]) => {
            const employee = allEmployees.find(e => e.id === employeeId);
            return { name: employee?.name || "Unknown", totalPoints, id: employee?.id };
        }).sort((a,b) => b.totalPoints - a.totalPoints).slice(0, 7); // Show top 7 contributors

    }, [projects, allEmployees]);

    const maxPoints = Math.max(...contribution.map(c => c.totalPoints), 0);

    return (
        <Card title="Overall Team Contribution">
            <div className="space-y-3 pt-2 h-64 overflow-y-auto">
                {contribution.length > 0 ? contribution.map(member => (
                    <div key={member.name} className="flex items-center">
                        <img 
                            src={`https://i.pravatar.cc/32?u=${member.id || member.name}`} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-[#FFFFFF]">{member.name}</span>
                                <span className="text-[#F2F2F2] font-semibold flex items-center">
                                    {member.totalPoints}
                                    <StarIcon className="w-4 h-4 text-yellow-400 ml-1" />
                                </span>
                            </div>
                            <div className="w-full bg-primary rounded-full h-2.5">
                                <div 
                                    className="bg-success h-2.5 rounded-full" 
                                    style={{ width: `${maxPoints > 0 ? (member.totalPoints / maxPoints) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        <p>No completed tasks with points yet.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
