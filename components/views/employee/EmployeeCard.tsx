import React from 'react';
import type { Employee } from '../../../types';
import { Badge } from '../../common/Badge';
import { PencilIcon } from '../../icons/PencilIcon';

interface EmployeeCardProps {
    employee: Employee;
    onEdit?: () => void;
    onViewDetails: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onViewDetails }) => {
    return (
        <div className="bg-slate-500/20 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
            <div className="flex flex-col items-center text-center">
                <img 
                    src={`https://i.pravatar.cc/80?u=${employee.id}`} 
                    alt={employee.name}
                    className="w-20 h-20 rounded-full mb-3"
                />
                <h3 className="font-bold text-lg text-[#F2F2F2] cursor-pointer hover:text-accent" onClick={onViewDetails}>{employee.name}</h3>
                <p className="text-sm text-[#F2F2F2]">{employee.role}</p>
                <div className="mt-2">
                    <Badge text={employee.status} color={employee.status === 'Active' ? 'success' : 'warning'} size="sm" />
                </div>
            </div>
            {onEdit && (
                <button onClick={onEdit} className="absolute top-3 right-3 text-text-secondary hover:text-accent p-1">
                    <PencilIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
