import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Goal, KeyResult } from '../../../types';

interface GoalCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { keyResultId: string; newValue: number }[], comment: string) => void;
  goal: Goal | null;
  employeeName: string;
}

interface KrUpdate {
  keyResultId: string;
  currentValue: number;
}

export const GoalCheckInModal: React.FC<GoalCheckInModalProps> = ({ isOpen, onClose, onSave, goal, employeeName }) => {
  const [krUpdates, setKrUpdates] = useState<KrUpdate[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (goal) {
      setKrUpdates(goal.keyResults.map(kr => ({ keyResultId: kr.id, currentValue: kr.currentValue })));
      setComment('');
    }
  }, [goal, isOpen]);

  const handleKrChange = (krId: string, value: string) => {
    const newValue = Number(value);
    setKrUpdates(currentUpdates =>
      currentUpdates.map(u => (u.keyResultId === krId ? { ...u, currentValue: newValue } : u))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
        alert("Please provide a comment for this update.");
        return;
    }
    const updatesToSave = krUpdates.map(u => ({ keyResultId: u.keyResultId, newValue: u.currentValue }));
    onSave(updatesToSave, comment);
  };

  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Check-in for: ${goal.title}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-text-secondary">Updating as <span className="font-semibold">{employeeName}</span>.</p>
        
        <div>
            <h3 className="text-md font-semibold mb-2">Key Results Progress</h3>
            <div className="space-y-3">
                {goal.keyResults.map((kr, index) => {
                    const update = krUpdates[index];
                    return (
                        <div key={kr.id} className="p-3 bg-secondary rounded-md">
                            <label htmlFor={kr.id} className="block text-sm font-medium text-text-primary">{kr.description}</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-text-secondary">{kr.currentValue} &rarr;</span>
                                <input
                                    type="number"
                                    id={kr.id}
                                    value={update?.currentValue ?? ''}
                                    onChange={(e) => handleKrChange(kr.id, e.target.value)}
                                    className="w-24 p-2 text-sm bg-primary border border-secondary rounded-md"
                                />
                                <span className="text-sm text-text-secondary">/ {kr.targetValue} {kr.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-text-secondary">Update & Notes*</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            placeholder="What progress did you make? Any blockers?"
            className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md"
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Check-in</button>
        </div>
      </form>
    </Modal>
  );
};