import React, { useState, useMemo } from 'react';
import type { GitRepository } from '../../../../types';
import { RepoCard } from './RepoCard';
import { SearchIcon } from '../../../icons/SearchIcon';
import { PlusIcon } from '../../../icons/PlusIcon';

interface GitProjectsViewProps {
    repositories: GitRepository[];
    onSelectRepo: (repoId: string) => void;
    onAddNewRepo: () => void;
}

export const GitProjectsView: React.FC<GitProjectsViewProps> = ({ repositories, onSelectRepo, onAddNewRepo }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRepos = useMemo(() => {
        if (!searchTerm) return repositories;
        return repositories.filter(repo =>
            repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [repositories, searchTerm]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 bg-primary border border-secondary rounded-md"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                </div>
                <button onClick={onAddNewRepo} className="flex-shrink-0 flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Repository</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRepos.map(repo => (
                    <RepoCard key={repo.id} repository={repo} onSelect={() => onSelectRepo(repo.id)} />
                ))}
            </div>
        </div>
    );
};