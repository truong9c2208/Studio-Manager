import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../common/Modal';
import type { Employee, Shift, TimeOffRequest } from '../../../types';

const allShifts: Shift[] = ['Morning (9am-5pm)', 'Afternoon (1pm-9pm)', 'Night (5pm-1am)'];

interface ScheduleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    existingShifts: Shift[];
    onSave: (date: Date, shifts: Shift[], leaveRequest: Omit<TimeOffRequest, 'id' | 'status'> | null) => void;
    employee: Employee;
    leaveInfo?: TimeOffRequest;
}

export const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ isOpen, onClose, date, existingShifts, onSave, employee, leaveInfo }) => {
    const [selectedShifts, setSelectedShifts] = useState<Shift[]>(existingShifts);
    const [activeTab, setActiveTab] = useState<'shifts' | 'leave'>('shifts');
    const [leaveData, setLeaveData] = useState({
        type: 'Vacation' as TimeOffRequest['type'],
        reason: '',
    });

    useEffect(() => {
        if(isOpen) {
            setSelectedShifts(existingShifts);
            setActiveTab(leaveInfo ? 'leave' : 'shifts');
            setLeaveData({ type: 'Vacation', reason: '' });
        }
    }, [existingShifts, isOpen, leaveInfo]);
    
    const vacationDaysThisMonth = useMemo(() => {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        return employee.timeOffRequests.filter(r => {
            const rDate = new Date(r.startDate); // Assuming single-day requests
            rDate.setHours(0,0,0,0);
            return r.type === 'Vacation' && (r.status === 'Pending' || r.status === 'Approved') && rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear;
        }).length;
    }, [employee.timeOffRequests, date]);
    
    const canRequestVacation = vacationDaysThisMonth < 3;

    const handleShiftToggle = (shift: Shift) => {
        setSelectedShifts(prev => prev.includes(shift) ? prev.filter(s => s !== shift) : [...prev, shift]);
    };
    
    const handleShiftSave = () => {
        onSave(date, selectedShifts, null);
    };
    
    const handleLeaveRequest = () => {
        // Manually format date to YYYY-MM-DD to avoid timezone issues with toISOString()
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const request: Omit<TimeOffRequest, 'id' | 'status'> = {
            startDate: dateString,
            endDate: dateString,
            type: leaveData.type,
            reason: leaveData.reason,
        };
        onSave(date, [], request);
    };

    const handleClearAllShifts = () => {
        setSelectedShifts([]);
    };
    
    const handleLeaveDataChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLeaveData(prev => ({...prev, [name]: value }));
    }

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title={`Manage Schedule for ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`}
        >
            {leaveInfo ? (
                <div className="text-center p-4">
                    <h3 className="font-semibold text-lg">Time Off Requested</h3>
                    <p className="mt-2">A request for <span className="font-bold">{leaveInfo.type}</span> is currently <span className="font-bold">{leaveInfo.status}</span> for this day.</p>
                    <p className="text-sm text-text-secondary mt-1">Shifts cannot be added until the request is resolved.</p>
                    <div className="mt-6 flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Close</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="border-b border-secondary mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setActiveTab('shifts')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'shifts' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'}`}>Register Shifts</button>
                            <button onClick={() => setActiveTab('leave')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'leave' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'}`}>Request Time Off</button>
                        </nav>
                    </div>

                    {activeTab === 'shifts' && (
                         <div className="space-y-4">
                            <p className="font-semibold text-text-secondary">Select one or more shifts to register:</p>
                            <div className="space-y-2">
                                {allShifts.map(shift => (
                                    <label key={shift} className="flex items-center p-3 bg-secondary rounded-lg cursor-pointer hover:bg-slate-200">
                                        <input type="checkbox" checked={selectedShifts.includes(shift)} onChange={() => handleShiftToggle(shift)} className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                                        <span className="ml-3 font-medium text-text-primary">{shift}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <button type="button" onClick={handleClearAllShifts} className="px-4 py-2 bg-primary border border-secondary text-danger rounded-md hover:bg-secondary text-sm font-semibold">Clear All</button>
                                <div className="space-x-2">
                                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                                    <button type="button" onClick={handleShiftSave} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'leave' && (
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="type" className="block text-sm font-medium text-text-secondary">Leave Type</label>
                                <select id="type" name="type" value={leaveData.type} onChange={handleLeaveDataChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                                    <option>Vacation</option>
                                    <option>Sick Leave</option>
                                    <option>Personal</option>
                                </select>
                            </div>
                            {leaveData.type === 'Vacation' && (
                                <p className={`text-sm p-2 rounded-md ${canRequestVacation ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                    You have requested <span className="font-bold">{vacationDaysThisMonth} of 3</span> vacation days for this month.
                                </p>
                            )}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">Reason (Optional)</label>
                                <textarea id="reason" name="reason" value={leaveData.reason} onChange={handleLeaveDataChange} rows={3} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                            </div>
                             <div className="pt-4 flex justify-end space-x-2">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                                <button onClick={handleLeaveRequest} disabled={leaveData.type === 'Vacation' && !canRequestVacation} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:bg-gray-400">Submit Request</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};