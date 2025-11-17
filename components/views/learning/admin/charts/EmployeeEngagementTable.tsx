import React, { useMemo } from 'react';
import type { Employee } from '../../../../../types';
import { Card } from '../../../../common/Card';
import { Table, type Column } from '../../../../common/Table';
import { ProgressBar } from '../../../../common/ProgressBar';

interface EmployeeEngagementTableProps {
  allEmployees: Employee[];
}

interface EngagementData {
    id: string;
    name: string;
    role: string;
    completed: number;
    inProgress: number;
    progress: number;
}

export const EmployeeEngagementTable: React.FC<EmployeeEngagementTableProps> = ({ allEmployees }) => {
    const employeeStats = useMemo<EngagementData[]>(() => {
        return allEmployees.map(employee => {
            const completed = employee.learningPaths.filter(lp => lp.status === 'Completed').length;
            const inProgress = employee.learningPaths.filter(lp => lp.status === 'In Progress').length;
            const total = employee.learningPaths.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;
            return {
                id: employee.id,
                name: employee.name,
                role: employee.role,
                completed,
                inProgress,
                progress,
            };
        });
    }, [allEmployees]);

    const columns: Column<EngagementData>[] = [
        { header: 'Employee', accessor: 'name', cell: (item) => (
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-text-secondary">{item.role}</p>
            </div>
        ) },
        { header: 'Completed', accessor: 'completed' },
        { header: 'In Progress', accessor: 'inProgress' },
        { header: 'Overall Progress', accessor: 'progress', cell: (item) => <ProgressBar progress={item.progress} /> },
    ];

    return (
        <Card title="Employee Engagement">
            <div className="-m-6 h-64 overflow-y-auto">
                <Table columns={columns} data={employeeStats} />
            </div>
        </Card>
    );
};
