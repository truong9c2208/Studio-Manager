import React, { useState, useEffect } from 'react';
import { Modal } from '../../../common/Modal';
import type { GitRepository, Employee, GitRepoParticipantRole } from '../../../../types';

interface RepoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (repo: GitRepository) => void;
    repo: GitRepository | null;
    employees: Employee[];
}

const getEmptyRepo = (employees: Employee[]): Omit<GitRepository, 'id' | 'stars' | 'forks' | 'lastUpdated' | 'readme' | 'participants'> => {
    const defaultOwner = employees.find(e => e.systemRole === 'Admin');
    const defaultBranch = 'main';
    return {
        name: '',
        owner: defaultOwner?.name || '',
        description: '',
        language: 'Java',
        defaultBranch: defaultBranch,
        branches: [defaultBranch],
        files: {
            [defaultBranch]: []
        },
        commits: [],
        issues: [],
        pullRequests: [],
        releases: [],
        wikiPages: [],
    };
};

export const RepoModal: React.FC<RepoModalProps> = ({ isOpen, onClose, onSave, repo, employees }) => {
    const [formData, setFormData] = useState(getEmptyRepo(employees));

    useEffect(() => {
        if (repo) {
            const { id, stars, forks, lastUpdated, readme, participants, ...rest } = repo;
            setFormData(rest);
        } else {
            setFormData(getEmptyRepo(employees));
        }
    }, [repo, isOpen, employees]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ownerEmployee = employees.find(e => e.name === formData.owner);
        if (!ownerEmployee) {
            alert("Selected owner is not a valid employee.");
            return;
        }

        const repoToSave: GitRepository = {
            ...formData,
            id: repo?.id || `git-${Date.now()}`,
            stars: repo?.stars || 0,
            forks: repo?.forks || 0,
            lastUpdated: new Date().toISOString(),
            readme: repo?.readme || `# ${formData.name}\n\n${formData.description}`,
            participants: repo?.participants || [{ employeeId: ownerEmployee.id, role: 'Admin' }],
        };
        onSave(repoToSave);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={repo ? 'Edit Repository' : 'Create New Repository'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Repository Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="owner" className="block text-sm font-medium text-text-secondary">Owner</label>
                        <select id="owner" name="owner" value={formData.owner} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            {employees.map(e => <option key={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-text-secondary">Primary Language</label>
                        <select id="language" name="language" value={formData.language} onChange={handleChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            <option>Java</option>
                            <option>TypeScript</option>
                            <option>Go</option>
                            <option>Python</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="defaultBranch" className="block text-sm font-medium text-text-secondary">Default Branch</label>
                        <input type="text" id="defaultBranch" name="defaultBranch" value={formData.defaultBranch} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Repository</button>
                </div>
            </form>
        </Modal>
    );
};