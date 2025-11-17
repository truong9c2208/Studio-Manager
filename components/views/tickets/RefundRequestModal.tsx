import React, { useState } from 'react';
import { Modal } from '../../common/Modal';

interface RefundRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    productName: string;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ isOpen, onClose, onSubmit, productName }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            onSubmit(reason.trim());
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Request Refund for ${productName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">
                        Please provide a reason for your refund request. This will be sent to an administrator for review.
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={5}
                        className="mt-1 block w-full px-3 py-2 bg-primary border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                    />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Submit Request</button>
                </div>
            </form>
        </Modal>
    );
};