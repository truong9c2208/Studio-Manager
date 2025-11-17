import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Task, Employee } from '../../../types';

interface TeamWorkloadBarChartProps {
    tasks: Task[];
    allEmployees: Employee[];
}

export const TeamWorkloadBarChart: React.FC<TeamWorkloadBarChartProps> = ({ tasks, allEmployees }) => {
    const workload = useMemo(() => {
        const counts: { [key: string]: number } = {};
        tasks.forEach(task => {
            if (task.assigneeId) {
                counts[task.assigneeId] = (counts[task.assigneeId] || 0) + 1;
            }
        });
        
        // Find the employee object to get the avatar
        return Object.entries(counts).map(([id, count]) => {
            const employee = allEmployees.find(e => e.id === id);
            return { name: employee?.name || 'Unknown', count, id: employee?.id };
        }).sort((a,b) => b.count - a.count);
    }, [tasks, allEmployees]);

    const maxTasks = Math.max(...workload.map(w => w.count), 0);

    return (
        <Card title="Team Workload">
            <div className="space-y-3 pt-2 h-64 overflow-y-auto">
                {workload.length > 0 ? workload.map(member => (
                    <div key={member.name} className="flex items-center">
                        <img 
                            src={`https://i.pravatar.cc/32?u=${member.id || member.name}`} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-[#FFFFFF]">{member.name}</span>
                                <span className="text-[#F2F2F2]">{member.count} tasks</span>
                            </div>
                            <div className="w-full bg-primary rounded-full h-2.5">
                                <div 
                                    className="bg-accent h-2.5 rounded-full" 
                                    style={{ width: `${maxTasks > 0 ? (member.count / maxTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        <p>No tasks assigned yet.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};