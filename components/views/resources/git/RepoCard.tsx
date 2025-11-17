
import React from 'react';
import type { GitRepository } from '../../../../types';
import { CodeIcon } from '../../../icons/CodeIcon';
import { StarIcon } from '../../../icons/StarIcon';
import { GitForkIcon } from '../../../icons/GitForkIcon';

interface RepoCardProps {
    repository: GitRepository;
    onSelect: () => void;
}

const languageColors: Record<GitRepository['language'], string> = {
    'Java': 'bg-yellow-500',
    'TypeScript': 'bg-blue-500',
    'Go': 'bg-cyan-500',
    'Python': 'bg-green-500',
};

export const RepoCard: React.FC<RepoCardProps> = ({ repository, onSelect }) => {
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };

    return (
        <div onClick={onSelect} className="bg-secondary p-4 rounded-lg border border-primary hover:border-accent transition-colors cursor-pointer flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2">
                    <CodeIcon className="w-5 h-5 text-text-secondary" />
                    <h3 className="text-lg font-bold text-accent hover:underline">{repository.name}</h3>
                </div>
                <p className="text-sm text-text-secondary mt-1 h-10">{repository.description}</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-text-secondary mt-4">
                <div className="flex items-center space-x-1">
                    <span className={`w-3 h-3 rounded-full ${languageColors[repository.language]}`}></span>
                    <span>{repository.language}</span>
                </div>
                 <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{repository.stars}</span>
                </div>
                 <div className="flex items-center space-x-1">
                    <GitForkIcon className="w-4 h-4" />
                    <span>{repository.forks}</span>
                </div>
                <span className="flex-grow text-right">Updated {timeSince(repository.lastUpdated)}</span>
            </div>
        </div>
    );
};
