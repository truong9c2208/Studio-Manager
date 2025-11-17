import React, { useState } from 'react';
import { Modal } from '../../../common/Modal';
import type { WalletTransaction } from '../../../../types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<WalletTransaction, 'id' | 'date'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<WalletTransaction['type']>('bonus');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount && description) {
            onSave({
                amount: type === 'adjustment' ? amount : Math.abs(amount as number), // Allow negative for adjustments
                description,
                type,
            });
            // Reset form
            setAmount('');
            setDescription('');
            setType('bonus');
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Wallet Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            required
                            placeholder={type === 'adjustment' ? 'can be negative' : ''}
                            className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md"
                        />
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-text-secondary">Type</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value as WalletTransaction['type'])} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            <option value="bonus">Bonus</option>
                            <option value="commission">Commission</option>
                            <option value="adjustment">Adjustment</option>
                        </select>
                    </div>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Add Transaction</button>
                </div>
            </form>
        </Modal>
    );
};