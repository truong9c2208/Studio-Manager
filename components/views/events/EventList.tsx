import React from 'react';
import type { Event } from '../../../types';
import { Badge } from '../../common/Badge';
import { getEventStatus } from '../../../utils/eventUtils';

interface EventListProps {
    events: Event[];
    selectedEventId: string | null;
    onSelectEvent: (eventId: string) => void;
}

const statusColorMap: Record<Event['status'], 'info' | 'success' | 'primary'> = {
    'Upcoming': 'info',
    'Ongoing': 'success',
    'Completed': 'primary'
};


export const EventList: React.FC<EventListProps> = ({ events, selectedEventId, onSelectEvent }) => {
    return (
        <div className="space-y-3">
             <h3 className="text-sm font-semibold text-text-primary px-1">Event List</h3>
            {events.map(event => {
                const status = getEventStatus(event);
                return (
                    <button 
                        key={event.id}
                        onClick={() => onSelectEvent(event.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            selectedEventId === event.id ? 'bg-white border-accent' : 'bg-primary border-transparent hover:border-slate-300'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-md text-text-primary">{event.title}</h4>
                            <Badge text={status} color={statusColorMap[status]} size="sm" />
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{event.type} • {event.project}</p>
                        <p className="text-xs text-text-secondary mt-2">
                            {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            {' - '}
                            {new Date(event.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                    </button>
                )
            })}
        </div>
    );
};
