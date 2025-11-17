
import React, { useState, useMemo } from 'react';
import { Card } from '../../common/Card';
import { PlusIcon } from '../../icons/PlusIcon';
import type { Department, Employee } from '../../../types';
import { DepartmentCard } from './DepartmentCard';
import { DepartmentModal } from './DepartmentModal';

interface DepartmentsViewProps {
    employees: Employee[];
    departments: Department[];
    onSaveDepartment: (department: Department) => void;
    onDeleteDepartment: (departmentId: string) => void;
    onViewDepartment: (departmentId: string) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ employees, departments, onSaveDepartment, onDeleteDepartment, onViewDepartment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const departmentsWithData = useMemo(() => {
        return departments.map(dept => {
            const manager = employees.find(e => e.id === dept.managerId);
            const members = employees.filter(e => e.departmentId === dept.id);
            return { ...dept, manager, members };
        });
    }, [departments, employees]);
    
    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingDepartment(null);
        setIsModalOpen(true);
    };

    const handleSave = (department: Department) => {
        onSaveDepartment(department);
        setIsModalOpen(false);
    };
    
    const handleDelete = (departmentId: string) => {
        if (window.confirm("Are you sure you want to delete this department? This will unassign all employees from it.")) {
            onDeleteDepartment(departmentId);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#F2F2F2]">Manage Departments</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Department</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentsWithData.map(dept => (
                    <DepartmentCard 
                        key={dept.id}
                        department={dept}
                        manager={dept.manager}
                        members={dept.members}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={() => onViewDepartment(dept.id)}
                    />
                ))}
            </div>

            <DepartmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                department={editingDepartment}
                employees={employees}
            />
        </div>
    );
};
