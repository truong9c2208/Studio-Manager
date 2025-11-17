

import React, { useMemo } from 'react';
import type { Ticket, Employee, Customer } from '../../../types';
import { Badge } from '../../common/Badge';
import { StarIcon } from '../../icons/StarIcon';

interface TicketCardProps {
    ticket: Ticket;
    employees: Employee[];
    customers: Customer[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: string) => void;
    onViewDetailsClick: () => void;
    currentUser: Employee;
}

const Avatar: React.FC<{ employee?: Employee }> = ({ employee }) => {
    if (!employee) return null;
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
    
    return (
        <div 
            title={employee.name}
            className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold border-2 border-primary"
        >
            {getInitials(employee.name)}
        </div>
    );
};


export const TicketCard: React.FC<TicketCardProps> = ({ ticket, employees, customers, onDragStart, onViewDetailsClick, currentUser }) => {
    const owner = employees.find(e => e.id === ticket.ownerId);
    const assignees = ticket.assignees.map(a => employees.find(e => e.id === a.employeeId)).filter((e): e is Employee => e !== undefined);
    const customer = useMemo(() => customers.find(c => c.name === ticket.requesterName), [customers, ticket.requesterName]);
    
    const isOwner = ticket.ownerId === currentUser.id;
    const isAdmin = currentUser.systemRole === 'Admin';
    const isDraggable = isOwner || isAdmin;

    const timeSince = (date: string): number => (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24); // days
    
    const getSlaStatus = (): { text: string; color: 'danger' | 'warning' } | null => {
        const daysOpen = timeSince(ticket.createdAt);
        const daysSinceUpdate = timeSince(ticket.updatedAt);

        if (ticket.status === 'Open' && daysOpen > 2) {
            return { text: 'Delayed', color: 'danger' };
        }
        if (ticket.status === 'In Progress' && daysSinceUpdate > 5) {
            return { text: 'Stalled', color: 'warning' };
        }
        return null;
    };
    
    const slaStatus = getSlaStatus();
    const priorityColorMap = { High: 'danger', Medium: 'warning', Low: 'info' } as const;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggable) {
            // By storing e.currentTarget in a variable, we avoid issues with
            // React's synthetic event pooling in the asynchronous setTimeout callback.
            const cardElement = e.currentTarget;
            cardElement.classList.add('shake');
            setTimeout(() => {
                cardElement.classList.remove('shake');
            }, 820); // Corresponds to animation duration
        }
    };

    return (
        <div
            draggable={isDraggable}
            onDragStart={(e) => isDraggable && onDragStart(e, ticket.id)}
            onMouseDown={handleMouseDown}
            onClick={onViewDetailsClick}
            className={`bg-primary p-4 rounded-lg shadow-sm mb-3 border hover:shadow-md transition-all ${
                isOwner ? 'border-accent' : 'border-transparent'
            } ${!isDraggable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-md text-text-primary mb-1 flex items-center">
                    {/* FIX: Wrapped StarIcon in a span with a title attribute to fix a prop error, as the 'title' prop is not supported by the IconProps interface. */}
                    {isOwner && <span title="You are the owner"><StarIcon className="w-5 h-5 mr-1.5 text-yellow-500" /></span>}
                    {ticket.title}
                </h4>
                <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
                    <Badge text={ticket.priority} color={priorityColorMap[ticket.priority]} size="sm" />
                    {slaStatus && <Badge text={slaStatus.text} color={slaStatus.color} size="sm" />}
                </div>
            </div>
            
            <p className="text-sm text-text-secondary mb-3">
                Requested by: <span className="font-semibold">{isAdmin || !customer ? ticket.requesterName : `ID: ${customer.id}`}</span>
            </p>

            <div className="text-xs text-text-secondary flex justify-between mb-3">
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span>ID: #{ticket.id.split('-')[1]}</span>
            </div>

            <div className="border-t border-secondary pt-3 flex justify-between items-center">
                <div>
                    <p className="text-xs text-text-secondary mb-1">Staff</p>
                    <div className="flex items-center space-x-1">
                        <Avatar employee={owner} />
                        {assignees.length > 0 && <span className="text-gray-400">+</span>}
                        <div className="flex -space-x-3">
                        {assignees.slice(0, 2).map(a => <Avatar key={a.id} employee={a} />)}
                        </div>
                         {assignees.length > 2 && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-primary">
                                +{assignees.length - 2}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <button onClick={onViewDetailsClick} className="text-sm font-semibold text-accent hover:underline px-3 py-1 rounded-md hover:bg-secondary">
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};