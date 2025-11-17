import React from 'react';
import type { Event, Employee } from '../../../types';
import { Badge } from '../../common/Badge';
import { getEventStatus } from '../../../utils/eventUtils';

interface EventDetailProps {
    event: Event | undefined;
    employees: Employee[];
    onEdit: (event: Event) => void;
    onDelete: (eventId: string) => void;
    isAdmin: boolean;
}

const statusColorMap: Record<Event['status'], 'info' | 'success' | 'primary'> = {
    'Upcoming': 'info',
    'Ongoing': 'success',
    'Completed': 'primary'
};

export const EventDetail: React.FC<EventDetailProps> = ({ event, employees, onEdit, onDelete, isAdmin }) => {
    if (!event) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary">Select an event to see details</p>
            </div>
        );
    }

    const owner = employees.find(e => e.id === event.ownerId);
    const participantDetails = event.participants
        .map(id => employees.find(e => e.id === id))
        .filter((e): e is Employee => e !== undefined);

    const fullDateRange = `${new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    const status = getEventStatus(event);

    return (
        <div className="space-y-6 text-sm">
            <div>
                <div className="flex items-center space-x-2">
                    <Badge text={status.toUpperCase()} color={statusColorMap[status]} size="sm" />
                    <span className="text-text-secondary">{event.type} • {fullDateRange}</span>
                </div>
                <h2 className="text-2xl font-bold mt-2 text-text-primary">{event.title}</h2>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-text-secondary mb-1">Project</h3>
                    <p className="text-text-primary">{event.project || 'No associated project'}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-text-secondary mb-1">Description</h3>
                    <p className="text-text-primary whitespace-pre-wrap">{event.description}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-text-secondary mb-1">Event Owner</h3>
                    <p className="text-text-primary">{owner?.name || 'Unknown'}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-text-secondary mb-1">Participants</h3>
                    <div className="flex flex-wrap gap-2">
                        {participantDetails.map(p => (
                            <div key={p.id} title={p.name} className="flex items-center space-x-1 bg-primary px-2 py-1 rounded-full text-xs font-medium">
                                <img src={`https://i.pravatar.cc/16?u=${p.id}`} alt={p.name} className="w-4 h-4 rounded-full" />
                                <span>{p.name.split(' ')[0].toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-text-secondary mb-1">Discount Vouchers</h3>
                    {event.vouchers && event.vouchers.length > 0 ? (
                        <div className="space-y-2">
                            {event.vouchers.map(v => (
                                <div key={v.id} className="bg-primary p-2 rounded-md border border-secondary">
                                    <p className="font-semibold font-mono text-accent">{v.code}</p>
                                    <p className="text-xs text-text-secondary">{v.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary italic">No vouchers for this event.</p>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className="space-y-3 pt-6">
                    <button 
                        onClick={() => onEdit(event)}
                        className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent-hover"
                    >
                        Edit Event
                    </button>
                    <button 
                        onClick={() => onDelete(event.id)}
                        className="w-full bg-danger text-white py-2 rounded-lg font-semibold hover:opacity-90"
                    >
                        Delete Event
                    </button>
                </div>
            )}
        </div>
    );
};