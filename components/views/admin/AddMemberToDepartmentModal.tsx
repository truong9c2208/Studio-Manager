
import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import type { Employee } from '../../../types';

interface AddMemberToDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeId: string) => void;
    availableEmployees: Employee[];
}

export const AddMemberToDepartmentModal: React.FC<AddMemberToDepartmentModalProps> = ({ isOpen, onClose, onSave, availableEmployees }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmployeeId) {
            onSave(selectedEmployeeId);
            setSelectedEmployeeId('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Member to Department">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="employee" className="block text-sm font-medium text-text-secondary">Employee</label>
                    <select 
                        id="employee"
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-primary border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                    >
                        <option value="" disabled>Select an employee</option>
                        {availableEmployees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>
                 <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Add Member</button>
                </div>
            </form>
        </Modal>
    );
};
