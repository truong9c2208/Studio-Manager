import React from 'react';
import type { Ticket, Employee, Customer } from '../../../types';
import { TicketCard } from './TicketCard';

interface TicketKanbanColumnProps {
    title: Ticket['status'];
    tickets: Ticket[];
    employees: Employee[];
    customers: Customer[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: Ticket['status']) => void;
    onTicketClick: (ticket: Ticket) => void;
    currentUser: Employee;
}

const statusColors: Record<Ticket['status'], string> = {
    Open: 'border-t-info',
    'In Progress': 'border-t-warning',
    Resolved: 'border-t-success',
    Closed: 'border-t-gray-400',
};

export const TicketKanbanColumn: React.FC<TicketKanbanColumnProps> = ({ title, tickets, employees, customers, onDragStart, onDrop, onTicketClick, currentUser }) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div 
            className="bg-secondary rounded-lg w-80 flex-shrink-0 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, title)}
        >
            <div className={`px-3 pt-3 pb-2 border-t-4 ${statusColors[title]} rounded-t-lg`}>
                <h3 className="font-bold text-md text-text-primary flex items-center">
                    {title}
                    <span className="ml-2 text-sm font-semibold text-text-secondary bg-primary h-5 w-5 rounded-full flex items-center justify-center">
                        {tickets.length}
                    </span>
                </h3>
            </div>
            <div className="p-3 pt-0 overflow-y-auto flex-1">
                {tickets.map(ticket => (
                    <TicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        employees={employees}
                        customers={customers}
                        onDragStart={onDragStart} 
                        onViewDetailsClick={() => onTicketClick(ticket)}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    );
};