

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Employee, Ticket } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';

interface AssigneeManagerProps {
    assignees: { employeeId: string; role: string }[];
    onAssigneesChange: (assignees: { employeeId: string; role: string }[]) => void;
    allEmployees: Employee[];
    disabled?: boolean;
}

export const AssigneeManager: React.FC<AssigneeManagerProps> = ({ assignees, onAssigneesChange, allEmployees, disabled }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // FIX: Imported `useMemo` from React to resolve 'Cannot find name' errors.
    const assignedEmployeeIds = useMemo(() => assignees.map(a => a.employeeId), [assignees]);
    const availableEmployees = useMemo(() => allEmployees.filter(e => !assignedEmployeeIds.includes(e.id)), [allEmployees, assignedEmployeeIds]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddAssignee = (employeeId: string) => {
        onAssigneesChange([...assignees, { employeeId, role: 'Support' }]);
        setIsDropdownOpen(false);
    };

    const handleRemoveAssignee = (employeeId: string) => {
        onAssigneesChange(assignees.filter(a => a.employeeId !== employeeId));
    };

    const handleRoleChange = (employeeId: string, role: string) => {
        onAssigneesChange(assignees.map(a => a.employeeId === employeeId ? { ...a, role } : a));
    };

    return (
        <div className="space-y-2">
            {assignees.map(assignee => {
                const employee = allEmployees.find(e => e.id === assignee.employeeId);
                if (!employee) return null;
                return (
                    <div key={employee.id} className="flex items-center space-x-2 bg-primary p-2 rounded-md">
                        <img src={`https://i.pravatar.cc/32?u=${employee.id}`} alt={employee.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{employee.name}</p>
                            <input 
                                type="text"
                                value={assignee.role}
                                onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                                placeholder="Assign role..."
                                disabled={disabled}
                                className="text-xs w-full bg-transparent border-0 border-b border-secondary focus:ring-0 focus:border-accent p-0 disabled:border-transparent"
                            />
                        </div>
                        {!disabled && (
                             <button type="button" onClick={() => handleRemoveAssignee(employee.id)} className="p-1 text-text-secondary hover:text-danger rounded-full">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}

            {!disabled && (
                 <div className="relative" ref={dropdownRef}>
                    <button 
                        type="button" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center space-x-2 p-2 bg-primary border border-dashed border-secondary rounded-md hover:bg-secondary text-text-secondary text-sm font-semibold"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Assignee</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-primary border border-secondary rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {availableEmployees.length > 0 ? availableEmployees.map(employee => (
                                <button
                                    key={employee.id}
                                    type="button"
                                    onClick={() => handleAddAssignee(employee.id)}
                                    className="w-full text-left p-2 hover:bg-secondary flex items-center space-x-2"
                                >
                                    <img src={`https://i.pravatar.cc/24?u=${employee.id}`} alt={employee.name} className="w-6 h-6 rounded-full" />
                                    <span>{employee.name}</span>
                                </button>
                            )) : <p className="p-2 text-xs text-center text-text-secondary">All employees are assigned.</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};