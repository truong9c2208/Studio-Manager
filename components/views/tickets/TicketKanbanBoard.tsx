import React from 'react';
import type { Ticket, Employee, Customer } from '../../../types';
import { TicketKanbanColumn } from './TicketKanbanColumn';

interface TicketKanbanBoardProps {
    tickets: Ticket[];
    employees: Employee[];
    customers: Customer[];
    onTicketClick: (ticket: Ticket) => void;
    onTicketDrop: (ticketId: string, newStatus: Ticket['status']) => void;
    currentUser: Employee;
}

export const TicketKanbanBoard: React.FC<TicketKanbanBoardProps> = ({ tickets, employees, customers, onTicketClick, onTicketDrop, currentUser }) => {
    
    const statuses: Ticket['status'][] = ['Open', 'In Progress', 'Resolved', 'Closed'];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, ticketId: string) => {
        e.dataTransfer.setData('ticketId', ticketId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Ticket['status']) => {
        const ticketId = e.dataTransfer.getData('ticketId');
        if (ticketId) {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket && (ticket.ownerId === currentUser.id || currentUser.systemRole === 'Admin')) {
                onTicketDrop(ticketId, newStatus);
            } else {
                // Optionally provide feedback that the action is not allowed
                console.warn("Permission denied: Cannot change status of a ticket you don't own.");
            }
        }
    };
    
    return (
        <div className="flex space-x-6 overflow-x-auto pb-4 -m-1 p-1">
            {statuses.map(status => (
                <TicketKanbanColumn 
                    key={status}
                    title={status}
                    tickets={tickets.filter(t => t.status === status)}
                    employees={employees}
                    customers={customers}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onTicketClick={onTicketClick}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
};