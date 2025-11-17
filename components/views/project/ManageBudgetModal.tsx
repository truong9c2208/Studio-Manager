import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';

interface ManageBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBudget: number, newSpent: number) => void;
    currentBudget: number;
    currentSpent: number;
}

export const ManageBudgetModal: React.FC<ManageBudgetModalProps> = ({ isOpen, onClose, onSave, currentBudget, currentSpent }) => {
    const [budget, setBudget] = useState(currentBudget);
    const [spent, setSpent] = useState(currentSpent);

    useEffect(() => {
        setBudget(currentBudget);
        setSpent(currentSpent);
    }, [currentBudget, currentSpent, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(budget, spent);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Project Budget">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-text-secondary">Total Budget ($)</label>
                    <input 
                        type="number" 
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-primary border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent" 
                    />
                </div>
                 <div>
                    <label htmlFor="spent" className="block text-sm font-medium text-text-secondary">Amount Spent ($)</label>
                    <input 
                        type="number" 
                        id="spent"
                        value={spent}
                        onChange={(e) => setSpent(Number(e.target.value))}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-primary border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent" 
                    />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Budget</button>
                </div>
            </form>
        </Modal>
    );
};