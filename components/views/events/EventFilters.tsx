import React from 'react';
import type { Event } from '../../../types';
import { getEventStatus } from '../../../utils/eventUtils';

interface EventFiltersProps {
    events: Event[];
    filters: { type: string[]; status: string[] };
    onFilterChange: (filters: { type: string[]; status: string[] }) => void;
}

const FilterButtonGroup: React.FC<{ options: string[], selected: string[], onChange: (selected: string[]) => void, allowMultiple?: boolean }> = ({ options, selected, onChange, allowMultiple = false }) => {
    
    const handleToggle = (option: string) => {
        if (option === 'All') {
            onChange([]);
            return;
        }

        if (allowMultiple) {
             const newSelection = selected.includes(option)
                ? selected.filter(item => item !== option)
                : [...selected, option];
            onChange(newSelection);
        } else {
            onChange(selected.includes(option) ? [] : [option]);
        }
    };
    
    const allIsSelected = selected.length === 0;

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleToggle('All')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    allIsSelected ? 'bg-accent text-white' : 'bg-primary text-text-secondary hover:bg-slate-200'
                }`}
            >
                All
            </button>
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => handleToggle(option)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selected.includes(option) ? 'bg-accent text-white' : 'bg-primary text-text-secondary hover:bg-slate-200'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};


export const EventFilters: React.FC<EventFiltersProps> = ({ events, filters, onFilterChange }) => {
    const totalEvents = events.length;
    const ongoingEvents = events.filter(e => getEventStatus(e) === 'Ongoing').length;
    
    const eventTypes = [...new Set(events.map(e => e.type))];
    const eventStatuses = ['Upcoming', 'Ongoing', 'Completed'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{totalEvents}</p>
                    <p className="text-xs text-text-secondary">TOTAL</p>
                </div>
                <div className="bg-primary p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{ongoingEvents}</p>
                    <p className="text-xs text-text-secondary">ONGOING</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Event Type</label>
                <FilterButtonGroup 
                    options={eventTypes} 
                    selected={filters.type} 
                    onChange={type => onFilterChange({ ...filters, type })} 
                    allowMultiple 
                />
            </div>
             <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Status</label>
                 <FilterButtonGroup 
                    options={eventStatuses} 
                    selected={filters.status} 
                    onChange={status => onFilterChange({ ...filters, status })} 
                    allowMultiple
                />
            </div>
             <button onClick={() => onFilterChange({ type: [], status: [] })} className="text-sm text-accent hover:underline">
                Reset Filters
            </button>
        </div>
    );
};
