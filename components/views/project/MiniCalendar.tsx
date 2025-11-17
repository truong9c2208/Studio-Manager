import React, { useState } from 'react';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
import { ChevronUpIcon } from '../../icons/ChevronUpIcon';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';

interface MiniCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onClose: () => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect }) => {
    const [displayDate, setDisplayDate] = useState(new Date(selectedDate));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
    
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const renderDays = () => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const daysArray = [];

        // Add blank days for the first week
        for (let i = 0; i < startDay; i++) {
            daysArray.push(<div key={`blank-${i}`} className="w-8 h-8"></div>);
        }

        // Add actual days
        for (let day = 1; day <= totalDays; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected = selectedDate.toDateString() === currentDate.toDateString();
            daysArray.push(
                <button 
                    key={day} 
                    onClick={() => onDateSelect(currentDate)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                        isSelected ? 'bg-accent text-white' : 'hover:bg-secondary'
                    }`}
                >
                    {day}
                </button>
            );
        }
        return daysArray;
    };
    
    const changeMonth = (delta: number) => {
        setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const changeYear = (delta: number) => {
        setDisplayDate(prev => new Date(prev.getFullYear() + delta, prev.getMonth(), 1));
    };

    return (
        <div className="absolute top-full mt-2 z-20 bg-primary shadow-lg border border-secondary rounded-md p-3 w-64">
            <div className="flex justify-between items-center mb-2">
                 <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-secondary"><ChevronLeftIcon className="w-4 h-4" /></button>
                 <span className="font-semibold text-sm">{monthNames[month]}</span>
                 <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-secondary"><ChevronRightIcon className="w-4 h-4" /></button>
                 <button onClick={() => changeYear(-1)} className="p-1 rounded-full hover:bg-secondary"><ChevronDownIcon className="w-4 h-4" /></button>
                 <span className="font-semibold text-sm">{year}</span>
                 <button onClick={() => changeYear(1)} className="p-1 rounded-full hover:bg-secondary"><ChevronUpIcon className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary mb-1">
                {dayNames.map(day => <div key={day} className="font-semibold">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {renderDays()}
            </div>
        </div>
    );
};