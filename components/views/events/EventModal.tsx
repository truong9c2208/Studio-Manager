import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Event, Employee, Project, Voucher } from '../../../types';
import { getEventStatus } from '../../../utils/eventUtils';
import { MultiSelectDropdown } from '../../common/MultiSelectDropdown';
import { CalendarIcon } from '../../icons/CalendarIcon';
import { MiniCalendar } from '../project/MiniCalendar';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { mockProducts } from '../../../data/mockData'; // For product selector

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Event) => void;
    event: Event | null;
    employees: Employee[];
    projects: Project[];
}

type EventFormData = Omit<Event, 'id' | 'status'>;

const getEmptyEvent = (employees: Employee[]): EventFormData => ({
    title: '',
    type: 'Internal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    project: '',
    description: '',
    ownerId: employees[0]?.id || '',
    participants: [],
    vouchers: [],
});

const VoucherManager: React.FC<{ vouchers: Voucher[], onVouchersChange: (vouchers: Voucher[]) => void }> = ({ vouchers, onVouchersChange }) => {
    
    const handleAddVoucher = () => {
        // FIX: Added the required 'uses' property to the new Voucher object, initializing it to 0 to align with the Voucher type definition.
        const newVoucher: Voucher = {
            id: `VOU-${Date.now()}`,
            code: '',
            description: '',
            discountAmount: 0,
            applicableProductIds: [],
            uses: 0,
        };
        onVouchersChange([...vouchers, newVoucher]);
    };

    const handleRemoveVoucher = (id: string) => {
        onVouchersChange(vouchers.filter(v => v.id !== id));
    };

    const handleVoucherChange = (id: string, field: keyof Voucher, value: any) => {
        onVouchersChange(vouchers.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    return (
        <div className="space-y-3">
             <h3 className="block text-sm font-medium text-text-secondary">Vouchers</h3>
            {vouchers.map(voucher => (
                <div key={voucher.id} className="p-3 bg-secondary rounded-md grid grid-cols-2 gap-x-4 gap-y-2 relative">
                    <input type="text" placeholder="Code (e.g., SUMMER24)" value={voucher.code} onChange={e => handleVoucherChange(voucher.id, 'code', e.target.value.toUpperCase())} className="col-span-1 p-1 bg-primary border-secondary rounded-md text-sm" />
                    <input type="number" placeholder="Discount Amount ($)" value={voucher.discountAmount} onChange={e => handleVoucherChange(voucher.id, 'discountAmount', Number(e.target.value))} className="col-span-1 p-1 bg-primary border-secondary rounded-md text-sm" />
                    <input type="text" placeholder="Description" value={voucher.description} onChange={e => handleVoucherChange(voucher.id, 'description', e.target.value)} className="col-span-2 p-1 bg-primary border-secondary rounded-md text-sm" />
                    <div className="col-span-2">
                        <MultiSelectDropdown 
                           options={mockProducts.map(p => ({ value: p.id, label: p.name }))}
                           selectedValues={voucher.applicableProductIds || []}
                           onChange={selected => handleVoucherChange(voucher.id, 'applicableProductIds', selected)}
                           placeholder="Applies to all products"
                        />
                    </div>
                    <button type="button" onClick={() => handleRemoveVoucher(voucher.id)} className="absolute top-2 right-2 p-1 text-text-secondary hover:text-danger"><TrashIcon className="w-4 h-4"/></button>
                </div>
            ))}
            <button type="button" onClick={handleAddVoucher} className="flex items-center space-x-1 text-sm text-accent hover:underline">
                <PlusIcon className="w-4 h-4"/>
                <span>Add Voucher</span>
            </button>
        </div>
    );
};


export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event, employees, projects }) => {
    const [formData, setFormData] = useState<EventFormData>(getEmptyEvent(employees));
    const [pickerFor, setPickerFor] = useState<'startDate' | 'endDate' | null>(null);

    useEffect(() => {
        if (event) {
            const { id, status, ...rest } = event;
            const formattedEvent = {
                ...rest,
                vouchers: rest.vouchers || [],
                startDate: rest.startDate.split('T')[0],
                endDate: rest.endDate.split('T')[0],
            };
            setFormData(formattedEvent);
        } else {
            setFormData(getEmptyEvent(employees));
        }
    }, [event, isOpen, employees]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: 'startDate' | 'endDate', date: Date) => {
        setFormData(prev => ({...prev, [name]: date.toISOString().split('T')[0] }));
        setPickerFor(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventToSave: Event = {
            ...formData,
            id: event?.id || `EVT-${Date.now()}`,
            status: getEventStatus(formData),
        };
        onSave(eventToSave);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Add New Event'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Event Title</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-text-secondary">Event Type</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            <option>Internal</option>
                            <option>Customer</option>
                            <option>Marketing</option>
                            <option>Partner</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="ownerId" className="block text-sm font-medium text-text-secondary">Event Owner</label>
                        <select id="ownerId" name="ownerId" value={formData.ownerId} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary">Start Date</label>
                        <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                         <button type="button" onClick={() => setPickerFor(pickerFor === 'startDate' ? null : 'startDate')} className="absolute right-2 top-7 p-1 hover:bg-secondary rounded-full"><CalendarIcon className="w-5 h-5 text-text-secondary"/></button>
                         {pickerFor === 'startDate' && <MiniCalendar selectedDate={new Date(formData.startDate)} onDateSelect={(d) => handleDateChange('startDate', d)} onClose={() => setPickerFor(null)} />}
                    </div>
                    <div className="relative">
                        <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary">End Date</label>
                        <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                        <button type="button" onClick={() => setPickerFor(pickerFor === 'endDate' ? null : 'endDate')} className="absolute right-2 top-7 p-1 hover:bg-secondary rounded-full"><CalendarIcon className="w-5 h-5 text-text-secondary"/></button>
                        {pickerFor === 'endDate' && <MiniCalendar selectedDate={new Date(formData.endDate)} onDateSelect={(d) => handleDateChange('endDate', d)} onClose={() => setPickerFor(null)} />}
                    </div>
                </div>

                <div>
                    <label htmlFor="project" className="block text-sm font-medium text-text-secondary">Associated Project</label>
                    <select id="project" name="project" value={formData.project || ''} onChange={handleChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                        <option value="">No associated project</option>
                        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="participants" className="block text-sm font-medium text-text-secondary">Participants</label>
                    <MultiSelectDropdown 
                        options={employees.map(e => ({ value: e.id, label: e.name }))}
                        selectedValues={formData.participants}
                        onChange={(selected) => setFormData(prev => ({ ...prev, participants: selected }))}
                        placeholder="Select participants..."
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                
                <div className="border-t border-secondary pt-4">
                    <VoucherManager vouchers={formData.vouchers || []} onVouchersChange={vouchers => setFormData(prev => ({...prev, vouchers}))} />
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Event</button>
                </div>
            </form>
        </Modal>
    );
};