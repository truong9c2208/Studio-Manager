import React, { useMemo } from 'react';
import { Card } from '../../../common/Card';
import type { Employee } from '../../../../types';

interface RoleDistributionChartProps {
    employees: Employee[];
}

export const RoleDistributionChart: React.FC<RoleDistributionChartProps> = ({ employees }) => {
    const roleDistribution = useMemo(() => {
        const counts: { [key: string]: number } = {};
        employees.forEach(employee => {
            counts[employee.role] = (counts[employee.role] || 0) + 1;
        });
        
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a,b) => b.count - a.count);
    }, [employees]);

    const maxCount = Math.max(...roleDistribution.map(r => r.count), 0);

    return (
        <Card title="Role Distribution">
            <div className="space-y-3 pt-2 h-64 overflow-y-auto">
                {roleDistribution.length > 0 ? roleDistribution.map(role => (
                    <div key={role.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#F2F2F2]">{role.name}</span>
                            <span className="text-[#FFFFFF]">{role.count} {role.count === 1 ? 'employee' : 'employees'}</span>
                        </div>
                        <div className="w-full bg-primary rounded-full h-4">
                            <div 
                                className="bg-accent h-4 rounded-full" 
                                style={{ width: `${maxCount > 0 ? (role.count / maxCount) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        <p>No employees to display.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
