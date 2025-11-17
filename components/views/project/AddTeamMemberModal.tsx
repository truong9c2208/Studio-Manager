import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import type { Employee } from '../../../types';

interface AddTeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeId: string, role: string) => void;
    availableEmployees: Employee[];
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ isOpen, onClose, onSave, availableEmployees }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [role, setRole] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmployeeId && role) {
            onSave(selectedEmployeeId, role);
            // Reset form
            setSelectedEmployeeId('');
            setRole('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
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
                 <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-secondary">Project Role</label>
                    <input 
                        type="text" 
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        placeholder="e.g., Lead Developer"
                        className="mt-1 block w-full px-3 py-2 bg-primary border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
                 <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Add Member</button>
                </div>
            </form>
        </Modal>
    );
};