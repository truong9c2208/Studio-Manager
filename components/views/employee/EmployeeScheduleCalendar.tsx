import React, { useState, useMemo } from 'react';
import type { Employee, Shift, TimeOffRequest } from '../../../types';
import { Card } from '../../common/Card';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
import { ScheduleEditModal } from './ScheduleEditModal';

interface EmployeeScheduleCalendarProps {
    employee: Employee;
    onUpdateSchedule?: (changedDate: string, newSchedule: Employee['schedule']) => void;
    onSaveTimeOffRequest?: (request: Omit<TimeOffRequest, 'id' | 'status'>) => void;
    isMyProfile: boolean;
    isAdmin: boolean;
}

const shiftColors: Record<Shift, string> = {
    'Morning (9am-5pm)': 'bg-blue-100 text-blue-800 border-blue-300',
    'Afternoon (1pm-9pm)': 'bg-amber-100 text-amber-800 border-amber-300',
    'Night (5pm-1am)': 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

export const EmployeeScheduleCalendar: React.FC<EmployeeScheduleCalendarProps> = ({ employee, onUpdateSchedule, onSaveTimeOffRequest, isMyProfile, isAdmin }) => {
    const [viewDate, setViewDate] = useState(new Date('2025-10-01')); // Default to a date with schedule items
    const [modalState, setModalState] = useState<{ isOpen: boolean; date: Date | null; existingShifts: Shift[]; leaveInfo?: TimeOffRequest }>({ isOpen: false, date: null, existingShifts: [] });
    
    const isScheduleGloballyEditable = (isMyProfile || isAdmin);

    const scheduleMap = useMemo(() => {
        const map = new Map<string, Shift[]>();
        employee.schedule.forEach(item => {
            const dateKey = item.date;
            map.set(dateKey, item.shifts);
        });
        return map;
    }, [employee.schedule]);
    
    const handleDayClick = (day: number, isEditable: boolean, leaveInfo?: TimeOffRequest) => {
        if (!isEditable) return;
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setModalState({ isOpen: true, date, existingShifts: scheduleMap.get(dateKey) || [], leaveInfo });
    };
    
    const handleSave = (date: Date, newShifts: Shift[], leaveRequest: Omit<TimeOffRequest, 'id' | 'status'> | null) => {
        if (leaveRequest && onSaveTimeOffRequest) {
            onSaveTimeOffRequest(leaveRequest);
        } else if (onUpdateSchedule) {
            const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            let newSchedule = employee.schedule.filter(item => item.date !== dateKey);
            if (newShifts.length > 0) {
                newSchedule.push({ date: dateKey, shifts: newShifts });
            }
            onUpdateSchedule(dateKey, newSchedule);
        }
        setModalState({ isOpen: false, date: null, existingShifts: [] });
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`pad-start-${i}`} className="border-r border-b border-secondary bg-primary"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        currentDate.setHours(0, 0, 0, 0);

        const dateKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const shifts = scheduleMap.get(dateKey);
        
        const leaveOnDay = employee.timeOffRequests.find(r => {
            const reqDate = new Date(r.startDate); // Assuming single-day requests
            reqDate.setHours(0,0,0,0);
            return reqDate.getTime() === currentDate.getTime();
        });

        const isPastDate = currentDate < today;
        const changesMade = employee.dailyScheduleChanges[dateKey] || 0;
        const hasReachedLimit = changesMade >= 2;

        const isEditableForUser = isMyProfile && !isPastDate && !hasReachedLimit;
        const isDayEditable = (isAdmin || isEditableForUser) && !leaveOnDay; // Can't edit a day that already has a leave request
        const isClickable = isScheduleGloballyEditable && isDayEditable;

        let tooltip = '';
        if (isScheduleGloballyEditable) {
            if (isPastDate) tooltip = 'Cannot edit past dates';
            else if (hasReachedLimit) tooltip = 'Edit limit reached for this day';
            else if (leaveOnDay) tooltip = `Leave request is ${leaveOnDay.status}`;
        }

        const isTodayMarker = today.getTime() === currentDate.getTime();

        calendarDays.push(
            <div 
                key={day}
                title={tooltip}
                className={`
                    p-1 border-r border-b border-secondary min-h-[120px] flex flex-col relative
                    ${isTodayMarker ? 'bg-secondary' : 'bg-primary'}
                    ${isClickable ? 'hover:bg-slate-200 transition-colors cursor-pointer' : ''}
                    ${(!isClickable || leaveOnDay) && isScheduleGloballyEditable ? 'opacity-60 cursor-not-allowed' : ''}
                `} 
                onClick={() => handleDayClick(day, isClickable, leaveOnDay)}
            >
                <div className={`font-semibold self-start mb-1 text-sm ${isTodayMarker ? 'bg-accent text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-text-primary p-1'}`}>{day}</div>
                <div className="space-y-1 overflow-y-auto">
                    {shifts?.map(shift => (
                        <div key={shift} className={`p-1 rounded-md text-xs font-semibold border ${shiftColors[shift]}`}>
                            <p>{shift.split(' ')[0]}</p>
                            <p className="font-normal">{shift.match(/\((.*)\)/)?.[1]}</p>
                        </div>
                    ))}
                    {leaveOnDay && (
                        <div className={`p-1 mt-1 rounded-md text-xs font-semibold border ${
                            leaveOnDay.status === 'Approved' ? 'bg-rose-100 text-rose-800 border-rose-300' : 
                            'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                            <p>{leaveOnDay.type}</p>
                            <p className="font-normal text-right">({leaveOnDay.status})</p>
                        </div>
                    )}
                </div>
                {!isAdmin && isMyProfile && changesMade > 0 && (
                     <div className="absolute bottom-1 right-1 text-xs bg-gray-200 text-gray-600 rounded-full h-5 w-5 flex items-center justify-center font-bold" title={`${changesMade} edits made`}>
                        {changesMade}
                    </div>
                )}
            </div>
        );
    }
    
    const remainingCells = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        calendarDays.push(<div key={`pad-end-${i}`} className="border-r border-b border-secondary bg-primary"></div>);
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 -mt-2">
                <h2 className="text-xl font-bold">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-2">
                    {isMyProfile && (
                        <span className="text-sm font-semibold text-text-secondary">
                           (You can edit future dates up to 2 times per day)
                        </span>
                    )}
                    <button onClick={() => changeMonth(-1)} className="p-1 rounded-md hover:bg-secondary"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <button onClick={() => setViewDate(new Date())} className="text-sm font-semibold p-1 px-3 rounded-md hover:bg-secondary">Today</button>
                    <button onClick={() => changeMonth(1)} className="p-1 rounded-md hover:bg-secondary"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
            </div>
            <div className="border-t border-l border-secondary">
                 <div className="grid grid-cols-7">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-sm text-text-secondary py-2 border-r border-b border-secondary bg-secondary">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calendarDays}
                </div>
            </div>
             {modalState.isOpen && modalState.date && (
                <ScheduleEditModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ isOpen: false, date: null, existingShifts: [] })}
                    date={modalState.date}
                    existingShifts={modalState.existingShifts}
                    onSave={handleSave}
                    employee={employee}
                    leaveInfo={modalState.leaveInfo}
                />
            )}
        </Card>
    );
};