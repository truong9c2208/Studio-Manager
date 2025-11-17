
import React, { useState, useMemo } from 'react';
import type { Employee, Department } from '../../types';
import { EmployeeCard } from './employee/EmployeeCard';
import { DepartmentDistributionChart } from './employee/charts/DepartmentDistributionChart';
import { AverageKpiRadarChart } from './employee/charts/AverageKpiRadarChart';
import { RoleDistributionChart } from './employee/charts/RoleDistributionChart';
import { PlusIcon } from '../icons/PlusIcon';
import { EmployeeModal } from './admin/EmployeeModal';
import { DepartmentsView } from './admin/DepartmentsView';

interface EmployeesViewProps {
    employees: Employee[];
    departments: Department[];
    onViewEmployee: (employeeId: string) => void;
    onUpdateEmployees: (employees: Employee[]) => void;
    onSaveDepartment: (department: Department) => void;
    onDeleteDepartment: (departmentId: string) => void;
    onViewDepartment: (departmentId: string) => void;
    onUpdateEmployee: (employee: Employee) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ employees, departments, onViewEmployee, onUpdateEmployees, onSaveDepartment, onDeleteDepartment, onViewDepartment, onUpdateEmployee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'employees' | 'departments'>('employees');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleSave = (employee: Employee) => {
        const isNew = !employees.some(e => e.id === employee.id);
        let updatedEmployees;
        if (isNew) {
            updatedEmployees = [...employees, employee];
        } else {
            updatedEmployees = employees.map(e => e.id === employee.id ? employee : e);
        }
        onUpdateEmployees(updatedEmployees);
        setIsModalOpen(false);
    };
    
    const filteredEmployees = useMemo(() => {
        if (departmentFilter === 'all') return employees;
        return employees.filter(e => e.departmentId === departmentFilter);
    }, [employees, departmentFilter]);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#F2F2F2]">People Management</h1>
            </div>

            <div className="border-b border-secondary">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('employees')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'employees' ? 'border-accent text-[#10b981]' : 'border-transparent text-[#F2F2F2]'}`}
                    >
                        All Employees
                    </button>
                    <button onClick={() => setActiveTab('departments')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'departments' ? 'border-accent text-[#10b981]' : 'border-transparent text-[#F2F2F2]'}`}
                    >
                        Departments
                    </button>
                </nav>
            </div>

            {activeTab === 'employees' && (
                <div className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <DepartmentDistributionChart employees={employees} departments={departments} />
                        <AverageKpiRadarChart employees={employees} />
                        <RoleDistributionChart employees={employees} />
                    </section>
                    
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-[#F2F2F2]">Team Directory</h2>
                            <div className="flex items-center space-x-4">
                                <select 
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="p-2 bg-primary border border-secondary rounded-md text-sm"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>New Employee</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredEmployees.map(employee => (
                                <EmployeeCard 
                                    key={employee.id} 
                                    employee={employee}
                                    onEdit={() => handleEdit(employee)}
                                    onViewDetails={() => onViewEmployee(employee.id)}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            )}
            
            {activeTab === 'departments' && (
                <DepartmentsView 
                    employees={employees} 
                    departments={departments}
                    onSaveDepartment={onSaveDepartment}
                    onDeleteDepartment={onDeleteDepartment}
                    onViewDepartment={onViewDepartment}
                />
            )}

             <EmployeeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                employee={editingEmployee}
                departments={departments}
            />
        </div>
    );
};
