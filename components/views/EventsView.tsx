import React, { useState, useMemo } from 'react';
import type { Event, Employee, Project } from '../../types';
import { EventFilters } from './events/EventFilters';
import { EventList } from './events/EventList';
import { EventTimeline } from './events/EventTimeline';
import { EventDetail } from './events/EventDetail';
import { PlusIcon } from '../icons/PlusIcon';
import { EventModal } from './events/EventModal';
import { getEventStatus } from '../../utils/eventUtils';

interface EventsViewProps {
    events: Event[];
    employees: Employee[];
    projects: Project[];
    onSaveEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    isAdmin: boolean;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, employees, projects, onSaveEvent, onDeleteEvent, isAdmin }) => {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);
    const [viewDate, setViewDate] = useState(new Date('2025-09-21T00:00:00'));
    const [filters, setFilters] = useState<{ type: string[]; status: string[] }>({ type: [], status: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const typeMatch = filters.type.length === 0 || filters.type.includes(event.type);
            const calculatedStatus = getEventStatus(event);
            const statusMatch = filters.status.length === 0 || filters.status.includes(calculatedStatus);
            return typeMatch && statusMatch;
        });
    }, [events, filters]);

    const selectedEvent = useMemo(() => {
        // If the selected event is no longer in the list (e.g., due to filtering), select the first available one.
        const eventExistsInFiltered = filteredEvents.some(e => e.id === selectedEventId);
        if (!eventExistsInFiltered && filteredEvents.length > 0) {
            setSelectedEventId(filteredEvents[0].id);
            return filteredEvents[0];
        }
        return events.find(e => e.id === selectedEventId);
    }, [events, selectedEventId, filteredEvents]);
    
    const handleNewEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDeleteEvent = (eventId: string) => {
        onDeleteEvent(eventId);
        if(selectedEventId === eventId) {
            const remainingEvents = events.filter(e => e.id !== eventId);
            setSelectedEventId(remainingEvents[0]?.id || null);
        }
    };
    
    const handleSave = (event: Event) => {
        onSaveEvent(event);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#234C6A]">
            <div className="p-4 flex justify-between items-center border-b border-primary bg-secondary">
                <h1 className="text-xl font-bold">Events</h1>
                {isAdmin && (
                    <button onClick={handleNewEvent} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover text-sm font-semibold">
                        <PlusIcon className="w-5 h-5" />
                        <span>New Event</span>
                    </button>
                )}
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Left Column: Filters & List */}
                <div className="w-[320px] flex-shrink-0 bg-secondary border-r border-primary p-4 space-y-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-text-primary px-2">Filters & Events</h2>
                    <EventFilters events={events} filters={filters} onFilterChange={setFilters} />
                    <EventList events={filteredEvents} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
                </div>

                {/* Center Column: Timeline */}
                <div className="flex-1 p-6 overflow-x-auto">
                    <EventTimeline events={filteredEvents} viewDate={viewDate} onViewDateChange={setViewDate} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
                </div>

                {/* Right Column: Details */}
                <div className="w-[350px] flex-shrink-0 bg-secondary border-l border-primary p-6 overflow-y-auto">
                    <EventDetail event={selectedEvent} employees={employees} onEdit={handleEditEvent} onDelete={handleDeleteEvent} isAdmin={isAdmin} />
                </div>
            </div>

            <EventModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                event={editingEvent}
                employees={employees}
                projects={projects}
            />
        </div>
    );
};