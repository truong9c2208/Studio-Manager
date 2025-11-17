import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Ticket } from '../../types';

interface TicketPriorityChartProps {
    tickets: Ticket[];
}

export const TicketPriorityChart: React.FC<TicketPriorityChartProps> = ({ tickets }) => {
    const priorityData = useMemo(() => {
        const counts = { High: 0, Medium: 0, Low: 0 };
        tickets.forEach(ticket => {
            if (ticket.priority in counts) {
                counts[ticket.priority]++;
            }
        });

        const data = [
            { label: 'High', value: counts.High, colorClass: 'bg-danger' },
            { label: 'Medium', value: counts.Medium, colorClass: 'bg-warning' },
            { label: 'Low', value: counts.Low, colorClass: 'bg-info' },
        ];
        return data;
    }, [tickets]);

    const maxTickets = Math.max(...priorityData.map(p => p.value), 1);

    return (
        <Card title="Tickets by Priority">
            <div className="space-y-4 pt-2">
                {priorityData.map(item => (
                    <div key={item.label}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-semibold text-text-primary">{item.label}</span>
                            <span className="text-text-secondary">{item.value} {item.value === 1 ? 'ticket' : 'tickets'}</span>
                        </div>
                        <div className="w-full bg-primary rounded-full h-4 relative overflow-hidden">
                            <div 
                                className={`h-4 rounded-full transition-all duration-500 ${item.colorClass}`}
                                style={{ width: `${(item.value / maxTickets) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};