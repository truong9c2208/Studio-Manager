import React, { useState } from 'react';
import { Card } from '../../common/Card';
import type { Employee, Project } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { AddTeamMemberModal } from './AddTeamMemberModal';

interface ProjectTeamProps {
    project: Project;
    onUpdateProject: (project: Project) => void;
    allEmployees: Employee[];
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ project, onUpdateProject, allEmployees }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const teamMembers = project.team.map(member => {
        const employee = allEmployees.find(e => e.id === member.employeeId);
        return { ...employee, ...member };
    }).filter(e => e.name); // Filter out if employee not found

    const availableEmployees = allEmployees.filter(emp => !project.team.some(m => m.employeeId === emp.id));
    
    const handleAddMember = (employeeId: string, role: string) => {
        const newTeam = [...project.team, { employeeId, role }];
        onUpdateProject({ ...project, team: newTeam });
        setIsModalOpen(false);
    };

    const handleRemoveMember = (employeeId: string) => {
        const newTeam = project.team.filter(m => m.employeeId !== employeeId);
        onUpdateProject({ ...project, team: newTeam });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#F2F2F2]">Team Members</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Member</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(member => (
                    <Card key={member.employeeId}>
                        <div className="flex items-center space-x-4">
                            <img src={`https://i.pravatar.cc/64?u=${member.id}`} alt={member.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="font-bold text-lg text-[#F2F2F2]">{member.name}</h3>
                                <p className="text-[#A0AEC0]">{member.role}</p>
                                <p className="text-xs text-accent">{member.email}</p>
                            </div>
                            <button onClick={() => handleRemoveMember(member.employeeId)} className="ml-auto text-text-secondary hover:text-danger">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <AddTeamMemberModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddMember}
                availableEmployees={availableEmployees}
            />
        </div>
    );
};