import React, { useState } from 'react';
import { Modal } from '../../../common/Modal';
import { Badge } from '../../../common/Badge';
import { PencilIcon } from '../../../icons/PencilIcon';
import { TrashIcon } from '../../../icons/TrashIcon';
import { CheckCircleIcon } from '../../../icons/CheckCircleIcon';
import { CloseIcon } from '../../../icons/CloseIcon';
import type { GitRepository } from '../../../../types';

interface ManageBranchesModalProps {
    isOpen: boolean;
    onClose: () => void;
    repo: GitRepository;
    onCreateBranch: (newBranchName: string, fromBranchName: string) => void;
    onRenameBranch: (oldBranchName: string, newBranchName: string) => void;
    onDeleteBranch: (branchName: string) => void;
}

export const ManageBranchesModal: React.FC<ManageBranchesModalProps> = ({ isOpen, onClose, repo, onCreateBranch, onRenameBranch, onDeleteBranch }) => {
    const [newBranchName, setNewBranchName] = useState('');
    const [sourceBranch, setSourceBranch] = useState(repo.defaultBranch);
    const [editingBranch, setEditingBranch] = useState<{ oldName: string; newName: string } | null>(null);

    const handleCreate = () => {
        if (newBranchName.trim()) {
            onCreateBranch(newBranchName.trim(), sourceBranch);
            setNewBranchName('');
        }
    };

    const handleStartRename = (branchName: string) => {
        setEditingBranch({ oldName: branchName, newName: branchName });
    };

    const handleConfirmRename = () => {
        if (editingBranch && editingBranch.newName.trim() && editingBranch.newName !== editingBranch.oldName) {
            onRenameBranch(editingBranch.oldName, editingBranch.newName.trim());
        }
        setEditingBranch(null);
    };

    const handleDelete = (branchName: string) => {
        if (window.confirm(`Are you sure you want to delete the branch "${branchName}"?`)) {
            onDeleteBranch(branchName);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Branches" size="lg">
            <div className="space-y-6">
                {/* Branch List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-text-secondary">Existing Branches</h3>
                    {repo.branches.map(branch => {
                        const isEditing = editingBranch?.oldName === branch;
                        const isDefault = repo.defaultBranch === branch;
                        return (
                            <div key={branch} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={editingBranch.newName}
                                        onChange={(e) => setEditingBranch({ ...editingBranch, newName: e.target.value })}
                                        className="flex-grow p-1 bg-primary border-accent rounded-md text-sm"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-sm">{branch}</span>
                                        {isDefault && <Badge text="Default" size="sm" color="accent" />}
                                    </div>
                                )}
                                <div className="flex items-center space-x-1">
                                    {isEditing ? (
                                        <>
                                            <button onClick={handleConfirmRename} className="p-1 text-success hover:bg-primary rounded-full"><CheckCircleIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setEditingBranch(null)} className="p-1 text-danger hover:bg-primary rounded-full"><CloseIcon className="w-5 h-5"/></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleStartRename(branch)} className="p-1 text-text-secondary hover:text-accent hover:bg-primary rounded-full"><PencilIcon className="w-4 h-4"/></button>
                                            {!isDefault && <button onClick={() => handleDelete(branch)} className="p-1 text-text-secondary hover:text-danger hover:bg-primary rounded-full"><TrashIcon className="w-4 h-4"/></button>}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create New Branch */}
                <div className="border-t border-secondary pt-4">
                     <h3 className="font-semibold text-text-secondary mb-2">Create New Branch</h3>
                     <div className="flex items-stretch space-x-2">
                         <input
                            type="text"
                            value={newBranchName}
                            onChange={e => setNewBranchName(e.target.value)}
                            placeholder="New branch name..."
                            className="flex-grow p-2 bg-primary border border-secondary rounded-md"
                         />
                         <div className="flex items-center bg-primary border border-secondary rounded-md px-2">
                            <span className="text-sm text-text-secondary mr-2">From:</span>
                            <select value={sourceBranch} onChange={e => setSourceBranch(e.target.value)} className="bg-transparent border-0 focus:ring-0 text-sm font-mono">
                                {repo.branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                         </div>
                         <button onClick={handleCreate} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Create</button>
                     </div>
                </div>
            </div>
        </Modal>
    );
};
