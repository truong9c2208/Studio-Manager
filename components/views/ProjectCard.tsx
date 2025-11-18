import React from 'react';
import type { Project, Employee } from '../../types';
import { Badge } from '../common/Badge';

interface ProjectCardProps {
    project: Project;
    employees: Employee[];
    onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, employees, onClick }) => {
    const statusMap = {
        'On Track': 'success',
        'At Risk': 'warning',
        'Off Track': 'danger',
        'Completed': 'info',
    } as const;
    
    const teamMembers = project.team.map(member => 
        employees.find(e => e.id === member.employeeId)
    ).filter((e): e is Employee => e !== undefined);

    return (
        <div onClick={onClick} className="bg-slate-500/20 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-[#F2F2F2]">{project.client}</p>
                        <h3 className="text-lg font-bold text-[#FFFFFF] mt-1">{project.name}</h3>
                    </div>
                    <Badge text={project.status} color={statusMap[project.status]} size="sm" />
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center text-sm text-[#F2F2F2] mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-primary rounded-full h-2.5">
                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                </div>

                 <div className="mt-4 text-sm text-[#F2F2F2]">
                    Budget: <span className="font-semibold text-[#FFFFFF]">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-primary flex justify-between items-center text-sm">
                <div>
                    <span className="text-[#F2F2F2]">Due: </span>
                    <span className="font-semibold text-[#FFFFFF]">{project.deadline}</span>
                </div>
                 <div className="flex -space-x-2">
                    {teamMembers.slice(0, 3).map(member => (
                        <img 
                            key={member.id}
                            src={`https://i.pravatar.cc/32?u=${member.id}`}
                            alt={member.name}
                            title={member.name}
                            className="w-8 h-8 rounded-full border-2 border-secondary"
                        />
                    ))}
                    {teamMembers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold border-2 border-secondary">
                            +{teamMembers.length - 3}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};