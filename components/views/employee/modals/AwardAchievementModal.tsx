import React, { useState } from 'react';
import { Modal } from '../../../common/Modal';
import type { Achievement, EarnedAchievement } from '../../../../types';
import { AchievementBadge } from '../achievements/AchievementBadge';
import { CheckCircleIcon } from '../../../icons/CheckCircleIcon';

interface AwardAchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAward: (achievementId: string) => void;
    allAchievements: Achievement[];
    employeeAchievements: EarnedAchievement[];
}

export const AwardAchievementModal: React.FC<AwardAchievementModalProps> = ({ isOpen, onClose, onAward, allAchievements, employeeAchievements }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const employeeAchievementIds = employeeAchievements.map(a => a.achievementId);

    const handleConfirm = () => {
        if (selectedId) {
            onAward(selectedId);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Award an Achievement" size="lg">
            <div className="space-y-4">
                <p className="text-sm">Select an achievement to award. Achievements the employee has already earned are marked.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2 bg-secondary rounded-md">
                    {allAchievements.map(ach => {
                        const isEarned = employeeAchievementIds.includes(ach.id);
                        const isSelected = selectedId === ach.id;
                        return (
                            <button
                                key={ach.id}
                                onClick={() => !isEarned && setSelectedId(ach.id)}
                                disabled={isEarned}
                                className={`p-2 rounded-lg text-center transition-all duration-200 relative
                                    ${isEarned ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary'}
                                    ${isSelected ? 'bg-accent text-white ring-2 ring-accent-hover' : 'bg-primary border border-secondary'}
                                `}
                            >
                                {isEarned && (
                                    <div className="absolute top-1 right-1 bg-success text-white rounded-full p-0.5">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="flex justify-center -mt-2">
                                     <AchievementBadge achievement={ach} dateAwarded="" />
                                </div>
                                <p className={`font-semibold text-xs -mt-1 ${isSelected ? 'text-white' : 'text-text-primary'}`}>{ach.name}</p>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-indigo-200' : 'text-text-secondary'}`}>{ach.description}</p>
                            </button>
                        );
                    })}
                </div>
                 <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                    <button type="button" onClick={handleConfirm} disabled={!selectedId} className="px-4 py-2 bg-accent text-white rounded-md disabled:bg-gray-400">Award Selected</button>
                </div>
            </div>
        </Modal>
    );
};