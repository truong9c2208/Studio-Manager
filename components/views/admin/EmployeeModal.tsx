import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Employee, Department } from '../../../types';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employee: Employee) => void;
    employee: Employee | null;
    departments: Department[];
}

const getEmptyEmployee = (): Omit<Employee, 'id' | 'kpi' | 'customerRating' | 'peerRatings' | 'customerFeedback' | 'learningPaths' | 'schedule' | 'dailyScheduleChanges' | 'revenueGenerated' | 'referralCode'> => ({
    name: '',
    email: '',
    role: '',
    departmentId: '',
    status: 'Active',
    systemRole: 'User',
    phone: '',
    address: { street: '', city: '', state: '', zip: '' },
    wallet: { balance: 0, transactions: [] },
    achievements: [],
    timeOffRequests: [],
    leaveBalances: { annual: 0, sick: 0, personal: 0 },
});

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee, departments }) => {
    const [formData, setFormData] = useState(getEmptyEmployee());

    useEffect(() => {
        if (employee) {
            const { id, kpi, customerRating, peerRatings, customerFeedback, learningPaths, schedule, dailyScheduleChanges, revenueGenerated, referralCode, ...rest } = employee;
            setFormData(rest);
        } else {
            setFormData(getEmptyEmployee());
        }
    }, [employee, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1] as keyof Employee['address'];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employeeToSave: Employee = {
            ...formData,
            id: employee?.id || `EMP-${Date.now()}`,
            // Add default values for complex properties
            revenueGenerated: employee?.revenueGenerated || 0,
            kpi: employee?.kpi || { teamwork: 80, problemSolving: 85, communication: 90, punctuality: 95, qualityOfWork: 88 },
            customerRating: employee?.customerRating || 92,
            peerRatings: employee?.peerRatings || [],
            customerFeedback: employee?.customerFeedback || [],
            learningPaths: employee?.learningPaths || [],
            schedule: employee?.schedule || [],
            dailyScheduleChanges: employee?.dailyScheduleChanges || {},
            referralCode: employee?.referralCode,
        };
        onSave(employeeToSave);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={employee ? 'Edit Employee' : 'Add New Employee'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" required />
                    <InputField label="Role" name="role" value={formData.role} onChange={handleChange} required />
                    <SelectField label="Department" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                        <option value="" disabled>Select a department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </SelectField>
                    <SelectField label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'On Leave']} />
                    <SelectField label="System Role" name="systemRole" value={formData.systemRole} onChange={handleChange} options={['Admin', 'User']} />
                    <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
                    <InputField label="Street Address" name="address.street" value={formData.address.street} onChange={handleChange} />
                    <InputField label="City" name="address.city" value={formData.address.city} onChange={handleChange} />
                    <InputField label="State" name="address.state" value={formData.address.state} onChange={handleChange} />
                    <InputField label="ZIP Code" name="address.zip" value={formData.address.zip} onChange={handleChange} />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Employee</button>
                </div>
            </form>
        </Modal>
    );
};

// Helper components for the form
const InputField: React.FC<any> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
    </div>
);

const SelectField: React.FC<any> = ({ label, name, options, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <select id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
            {options ? options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>) : children}
        </select>
    </div>
);