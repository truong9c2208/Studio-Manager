import React from 'react';
import type { Employee, Achievement } from '../../../../types';
import { Card } from '../../../common/Card';
import { AchievementBadge } from './AchievementBadge';
import { PlusIcon } from '../../../icons/PlusIcon';

interface AchievementsSectionProps {
    employee: Employee;
    allAchievements: Achievement[];
    isAdmin: boolean;
    isMyProfile: boolean;
    onAwardClick: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ employee, allAchievements, isAdmin, isMyProfile, onAwardClick }) => {
    
    const earnedAchievements = employee.achievements.map(earned => {
        const details = allAchievements.find(a => a.id === earned.achievementId);
        return { ...details, ...earned };
    }).filter(a => a.name); // Filter out if details not found

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 -mt-2">
                <h3 className="text-lg font-bold">Achievements</h3>
                {isAdmin && !isMyProfile && (
                    <button onClick={onAwardClick} className="flex items-center space-x-2 bg-secondary text-text-primary px-3 py-1.5 rounded-md hover:bg-primary text-sm font-semibold">
                        <PlusIcon className="w-4 h-4" />
                        <span>Award Achievement</span>
                    </button>
                )}
            </div>

            {earnedAchievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {earnedAchievements.map(ach => (
                        <AchievementBadge key={ach.id} achievement={ach} dateAwarded={ach.dateAwarded} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-text-secondary">
                    <p>No achievements earned yet. Keep up the great work!</p>
                </div>
            )}
        </Card>
    );
};