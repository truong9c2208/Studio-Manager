import React from 'react';
import type { Commit, Employee } from '../../../../types';

interface RepoCommitsViewProps {
    commits: Commit[];
    employees: Employee[];
}

export const RepoCommitsView: React.FC<RepoCommitsViewProps> = ({ commits, employees }) => {
    return (
        <div className="border rounded-md bg-primary divide-y divide-secondary">
            {commits.map(commit => {
                const author = employees.find(e => e.id === commit.authorId);
                return (
                    <div key={commit.hash} className="p-3 flex justify-between items-center hover:bg-secondary">
                        <div className="flex items-center space-x-3">
                             <img src={`https://i.pravatar.cc/32?u=${author?.id}`} alt={author?.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="font-semibold text-text-primary">{commit.message}</p>
                                <p className="text-sm text-text-secondary">{author?.name || 'Unknown'} committed on {new Date(commit.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="font-mono text-sm text-accent hover:underline cursor-pointer">
                            {commit.hash.substring(0, 7)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};