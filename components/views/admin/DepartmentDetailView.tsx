
import React, { useState, useMemo } from 'react';
import type { Employee, Department, Project } from '../../../types';
import { Card } from '../../common/Card';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { DepartmentKpiRadarChart } from './charts/DepartmentKpiRadarChart';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { AddMemberToDepartmentModal } from './AddMemberToDepartmentModal';

interface DepartmentDetailViewProps {
    departmentId: string;
    onBack: () => void;
    departments: Department[];
    employees: Employee[];
    projects: Project[];
    onUpdateEmployee: (employee: Employee) => void;
}

export const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({ departmentId, onBack, departments, employees, projects, onUpdateEmployee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const department = useMemo(() => departments.find(d => d.id === departmentId), [departments, departmentId]);
    
    const { manager, members } = useMemo(() => {
        if (!department) return { manager: undefined, members: [] };
        const manager = employees.find(e => e.id === department.managerId);
        const members = employees.filter(e => e.departmentId === department.id);
        return { manager, members };
    }, [department, employees]);

    const activeProjectsCount = useMemo(() => {
        if (!members.length) return 0;
        const memberIds = members.map(m => m.id);
        const projectsInvolved = projects.filter(p => 
            p.status !== 'Completed' && p.team.some(tm => memberIds.includes(tm.employeeId))
        );
        return new Set(projectsInvolved.map(p => p.id)).size;
    }, [members, projects]);
    
    const handleAddMember = (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        if (employee && department) {
            onUpdateEmployee({ ...employee, departmentId: department.id });
        }
        setIsModalOpen(false);
    };

    const handleRemoveMember = (employee: Employee) => {
        if (window.confirm(`Are you sure you want to remove ${employee.name} from this department?`)) {
            onUpdateEmployee({ ...employee, departmentId: '' });
        }
    };

    if (!department) {
        return <div className="p-8">Department not found.</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header>
                <button onClick={onBack} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>Back to People Management</span>
                </button>
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-3xl font-bold">{department.name}</h1>
                        <p className="text-text-secondary">
                            Managed by: <span className="font-semibold text-text-primary">{manager?.name || 'N/A'}</span>
                        </p>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Members" value={String(members.length)} />
                <Card title="Active Projects" value={String(activeProjectsCount)} />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <DepartmentKpiRadarChart members={members} />
                 <Card title="Members">
                    <div className="flex justify-end -mt-12 mb-2">
                         <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-accent text-white px-3 py-1.5 rounded-md hover:bg-accent-hover text-sm">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Member</span>
                        </button>
                    </div>
                    <div className="space-y-2 h-64 overflow-y-auto pr-2">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-primary rounded-md">
                                <div className="flex items-center space-x-3">
                                    <img src={`https://i.pravatar.cc/40?u=${member.id}`} alt={member.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-xs text-text-secondary">{member.role}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveMember(member)} className="text-text-secondary hover:text-danger p-1">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                 </Card>
            </section>

            <AddMemberToDepartmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddMember}
                availableEmployees={employees.filter(e => e.departmentId !== departmentId)}
            />
        </div>
    );
};
