import React, { useState } from 'react';
import { Modal } from '../../../common/Modal';

interface RequestWithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number, method: string) => void;
    maxAmount: number;
}

export const RequestWithdrawalModal: React.FC<RequestWithdrawalModalProps> = ({ isOpen, onClose, onConfirm, maxAmount }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [method, setMethod] = useState('PayPal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount && amount > 0 && amount <= maxAmount) {
            onConfirm(amount, method);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Withdrawal">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        max={maxAmount}
                        min="1"
                        required
                        className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md"
                    />
                     <p className="text-xs text-text-secondary mt-1">Available balance: {maxAmount} points</p>
                </div>
                 <div>
                    <label htmlFor="method" className="block text-sm font-medium text-text-secondary">Payment Method</label>
                    <select id="method" value={method} onChange={(e) => setMethod(e.target.value)} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                    </select>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Submit Request</button>
                </div>
            </form>
        </Modal>
    );
};