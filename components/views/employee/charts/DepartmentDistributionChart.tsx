
import React, { useMemo } from 'react';
import { Card } from '../../../common/Card';
import type { Employee, Department } from '../../../../types';

interface DepartmentDistributionChartProps {
    employees: Employee[];
    departments: Department[];
}

const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ employees, departments }) => {
    const departmentData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        employees.forEach(employee => {
            counts[employee.departmentId] = (counts[employee.departmentId] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([departmentId, value], index) => {
                const department = departments.find(d => d.id === departmentId);
                return {
                    label: department?.name || 'Unassigned',
                    value,
                    color: colors[index % colors.length],
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [employees, departments]);

    const totalEmployees = employees.length;
    const circumference = 54 * 2 * Math.PI;
    let offset = 0;

    return (
        <Card title="Employees by Department">
            <div className="flex flex-col md:flex-row items-center justify-center -mt-4 min-h-[16rem]">
                <div className="relative w-[180px] h-[180px] grid place-items-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full col-start-1 row-start-1" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        {totalEmployees > 0 && departmentData.map((item, index) => {
                            if (item.value === 0) return null;
                            const dasharray = (item.value / totalEmployees) * circumference;
                            const strokeDashoffset = offset;
                            offset += dasharray;
                            return (
                                <circle
                                    key={index}
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="12"
                                    strokeDasharray={`${dasharray} ${circumference}`}
                                    strokeDashoffset={-strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>
                    <div className="flex flex-col items-center justify-center pointer-events-none col-start-1 row-start-1">
                        <span className="text-3xl font-bold text-[#F2F2F2]">{totalEmployees}</span>
                            <span className="text-[#F2F2F2]">Employees</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 space-y-2 text-sm w-full max-w-[200px]">
                    {departmentData.map(item => (
                         <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                                <span className="text-[#F2F2F2] truncate">{item.label}</span>
                            </div>
                            <span className="font-semibold text-[#FFFFFF]">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
