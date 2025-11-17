
import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Department, Employee } from '../../../types';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (department: Department) => void;
    department: Department | null;
    employees: Employee[];
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onSave, department, employees }) => {
    const [formData, setFormData] = useState<Omit<Department, 'id'>>({ name: '', managerId: '' });

    useEffect(() => {
        if (department) {
            setFormData({ name: department.name, managerId: department.managerId });
        } else {
            setFormData({ name: '', managerId: '' });
        }
    }, [department, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const departmentToSave: Department = {
            ...formData,
            id: department?.id || `DEPT-${Date.now()}`,
        };
        onSave(departmentToSave);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={department ? 'Edit Department' : 'Add New Department'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Department Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                <div>
                    <label htmlFor="managerId" className="block text-sm font-medium text-text-secondary">Manager</label>
                    <select id="managerId" name="managerId" value={formData.managerId} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                        <option value="" disabled>Select a manager</option>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Department</button>
                </div>
            </form>
        </Modal>
    );
};
