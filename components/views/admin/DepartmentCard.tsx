
import React from 'react';
import type { Department, Employee } from '../../../types';
import { PencilIcon } from '../../icons/PencilIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { TrashIcon } from '../../icons/TrashIcon';

interface DepartmentCardProps {
    department: Department;
    manager: Employee | undefined;
    members: Employee[];
    onEdit: (department: Department) => void;
    onDelete: (departmentId: string) => void;
    onViewDetails: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, manager, members, onEdit, onDelete, onViewDetails }) => {
    return (
        <div className="bg-[#1B3C53] p-4 rounded-lg shadow-md flex flex-col justify-between min-h-[160px] hover:shadow-lg transition-shadow">
            <div onClick={onViewDetails} className="cursor-pointer flex-grow">
                <h3 className="text-lg font-bold text-[#F2F2F2]">{department.name}</h3>
                <p className="text-sm text-[#F2F2F2] mt-1">
                    Manager: {manager?.name || 'Not assigned'}
                </p>
                <div className="flex items-center mt-1 text-sm text-[#F2F2F2]">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                 <div className="flex -space-x-2">
                    {members.slice(0, 5).map(member => (
                        <img 
                            key={member.id}
                            src={`https://i.pravatar.cc/32?u=${member.id}`}
                            alt={member.name}
                            title={member.name}
                            className="w-8 h-8 rounded-full border-2 border-secondary"
                        />
                    ))}
                    {members.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold border-2 border-secondary">
                            +{members.length - 5}
                        </div>
                    )}
                </div>
                <div className="space-x-1">
                     <button onClick={(e) => { e.stopPropagation(); onEdit(department); }} className="p-2 text-[#F2F2F2] hover:text-accent rounded-full hover:bg-primary">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(department.id); }} className="p-2 text-[#F2F2F2] hover:text-danger rounded-full hover:bg-primary">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
