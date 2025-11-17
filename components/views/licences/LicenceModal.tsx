import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Licence, Product, Customer } from '../../../types';
import { RefreshIcon } from '../../icons/RefreshIcon';

interface LicenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (licence: Licence) => void;
    licence: Licence | null;
    products: Product[];
    customers: Customer[];
}

const generateKey = () => `CSM-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

const getEmptyLicence = (): Omit<Licence, 'id'> => ({
    productId: '',
    customerId: '',
    key: generateKey(),
    startDate: new Date().toISOString().split('T')[0],
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year from now
    createdAt: new Date().toISOString().split('T')[0],
    status: 'Active',
});

export const LicenceModal: React.FC<LicenceModalProps> = ({ isOpen, onClose, onSave, licence, products, customers }) => {
    const [formData, setFormData] = useState<Omit<Licence, 'id'>>(getEmptyLicence());

    useEffect(() => {
        if (isOpen) {
            if (licence) {
                const { id, ...rest } = licence;
                setFormData(rest);
            } else {
                setFormData(getEmptyLicence());
            }
        }
    }, [licence, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const licenceToSave: Licence = {
            ...formData,
            id: licence?.id || `LIC-${Date.now()}`,
        };
        onSave(licenceToSave);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={licence ? 'Edit Licence' : 'Create New Licence'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Product" name="productId" value={formData.productId} onChange={handleChange} required>
                        <option value="" disabled>Select a product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </SelectField>
                    <SelectField label="Customer" name="customerId" value={formData.customerId} onChange={handleChange} required>
                        <option value="" disabled>Select a customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                    </SelectField>
                </div>
                <div>
                    <label htmlFor="key" className="block text-sm font-medium text-text-secondary">Licence Key</label>
                    <div className="relative">
                        <input type="text" id="key" name="key" value={formData.key} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md font-mono pr-10" />
                        <button type="button" onClick={() => setFormData(p => ({...p, key: generateKey()}))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-accent rounded-full hover:bg-secondary">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <SelectField label="Status" name="status" value={formData.status} onChange={handleChange}>
                        <option>Active</option>
                        <option>Expired</option>
                        <option>Revoked</option>
                    </SelectField>
                    <InputField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                    <InputField label="Expiration Date" name="expires" type="date" value={formData.expires} onChange={handleChange} required />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Licence</button>
                </div>
            </form>
        </Modal>
    );
};

// Helper components for the form
const InputField: React.FC<any> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
    </div>
);

const SelectField: React.FC<any> = ({ label, name, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <select id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
            {children}
        </select>
    </div>
);
