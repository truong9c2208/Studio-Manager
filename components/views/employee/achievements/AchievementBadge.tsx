import React from 'react';
import type { Achievement, AchievementTier } from '../../../../types';
import { TrophyIcon } from '../../../icons/TrophyIcon';
import { BugIcon } from '../../../icons/BugIcon';
import { RocketIcon } from '../../../icons/RocketIcon';
import { HeartIcon } from '../../../icons/HeartIcon';
import { AwardIcon } from '../../../icons/AwardIcon';

interface AchievementBadgeProps {
    achievement: Achievement;
    dateAwarded: string;
}

const tierStyles: Record<AchievementTier, { gradient: string; shadow: string }> = {
    Bronze: { gradient: 'from-[#cd7f32] to-[#8c5a2b]', shadow: 'shadow-orange-900/50' },
    Silver: { gradient: 'from-[#c0c0c0] to-[#a9a9a9]', shadow: 'shadow-gray-500/50' },
    Gold: { gradient: 'from-[#ffd700] to-[#cca300]', shadow: 'shadow-yellow-500/50' },
    Diamond: { gradient: 'from-[#b9f2ff] to-[#82c8d1]', shadow: 'shadow-cyan-400/50' },
};

const iconMap: Record<Achievement['icon'], React.FC<any>> = {
    Trophy: TrophyIcon,
    Bug: BugIcon,
    Rocket: RocketIcon,
    Heart: HeartIcon,
    Award: AwardIcon,
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, dateAwarded }) => {
    const style = tierStyles[achievement.tier];
    const Icon = iconMap[achievement.icon];
    
    const tooltipContent = (
        <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <p className="font-bold">{achievement.name}</p>
            <p className="font-normal">{achievement.description}</p>
            <p className="text-gray-300 mt-1">Awarded: {dateAwarded}</p>
        </div>
    );

    return (
        <div className="relative group flex flex-col items-center">
            {tooltipContent}
            <div
                className={`w-24 h-28 bg-gradient-to-br ${style.gradient} shadow-lg ${style.shadow}`}
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-12 h-12 text-white/80" />
                </div>
            </div>
            <p className="text-xs font-semibold text-text-secondary mt-2 text-center truncate w-24">{achievement.name}</p>
        </div>
    );
};