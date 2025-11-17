import React, { useState, useRef, useEffect } from 'react';
import type { GitRepository, Employee, GitRepoParticipantRole, ProjectPage, Issue, PullRequest, Release, CodeFile } from '../../../../types';
import { ChevronLeftIcon } from '../../../icons/ChevronLeftIcon';
import { CodeIcon } from '../../../icons/CodeIcon';
import { GitBranchIcon } from '../../../icons/GitBranchIcon';
import { ChevronDownIcon } from '../../../icons/ChevronDownIcon';
import { StarIcon } from '../../../icons/StarIcon';
import { GitForkIcon } from '../../../icons/GitForkIcon';
import { BookIcon } from '../../../icons/BookIcon';
import { TagIcon } from '../../../icons/TagIcon';
import { Badge } from '../../../common/Badge';
import { DocumentTextIcon } from '../../../icons/DocumentTextIcon';
import { CogIcon } from '../../../icons/CogIcon';
import { PlusIcon } from '../../../icons/PlusIcon';
import { TrashIcon } from '../../../icons/TrashIcon';
import { WikiView } from '../common/WikiView';
import { Modal } from '../../../common/Modal';
import { Table, type Column } from '../../../common/Table';
import { UploadIcon } from '../../../icons/UploadIcon';
import { CommitIcon } from '../../../icons/CommitIcon';
import { RepoCommitsView } from './RepoCommitsView';
import { ManageBranchesModal } from './ManageBranchesModal';
import { PencilIcon } from '../../../icons/PencilIcon';

// A simple markdown-like renderer
const SimpleRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-4 mb-2 pb-2 border-b">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold mt-3 mb-1 pb-1 border-b">{line.substring(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
        if (line.startsWith('`')) return <pre key={i} className="bg-secondary p-2 rounded-md font-mono text-sm my-2">{line.replace(/`/g, '')}</pre>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="my-2">{line}</p>;
    });
    return <div className="prose max-w-none">{lines}</div>;
}

const GenericNewItemModal: React.FC<{ title: string, isOpen: boolean, onClose: () => void, onSave: (title: string, description: string) => void }> = ({ title, isOpen, onClose, onSave }) => {
    const [itemTitle, setItemTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSave = () => {
        onSave(itemTitle, description);
        setItemTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <input type="text" value={itemTitle} onChange={e => setItemTitle(e.target.value)} placeholder="Title" className="w-full p-2 bg-primary border border-secondary rounded-md" />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." rows={5} className="w-full p-2 bg-primary border border-secondary rounded-md" />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md">Save</button>
                </div>
            </div>
        </Modal>
    );
}

const ConfirmationModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, children: React.ReactNode }> = ({ isOpen, onClose, onConfirm, title, children }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-4">
            <p>{children}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-danger text-white rounded-md">Confirm</button>
            </div>
        </div>
    </Modal>
);

const RenameModal: React.FC<{ isOpen: boolean, onClose: () => void, onRename: (newName: string) => void, currentName: string, itemType?: string }> = ({ isOpen, onClose, onRename, currentName, itemType="item" }) => {
    const [name, setName] = useState(currentName);
    useEffect(() => setName(currentName), [currentName, isOpen]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRename(name);
    }
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Rename ${itemType}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-primary border border-secondary rounded-md" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Rename</button>
              </div>
          </form>
      </Modal>
    )
}

interface RepoDetailViewProps {
    repository: GitRepository;
    employees: Employee[];
    currentUser: Employee;
    onBack: () => void;
    onEdit: (repo: GitRepository) => void;
    onDelete: () => void;
    onUpdateRepo: (repo: GitRepository) => void;
    onUpdateWikiPages: (pages: ProjectPage[]) => void;
    onSaveIssue: (issue: Issue) => void;
    onSavePullRequest: (pr: PullRequest) => void;
    onSaveRelease: (release: Release) => void;
    onUploadFileToRepo: (repoId: string, branchName: string, newFile: CodeFile) => void;
    onRenameFileInRepo: (repoId: string, branchName: string, oldName: string, newName: string) => void;
    onDeleteFileInRepo: (repoId: string, branchName: string, fileName: string) => void;
    onCreateBranchInRepo: (repoId: string, newBranchName: string, fromBranchName: string) => void;
    onRenameBranchInRepo: (repoId: string, oldBranchName: string, newBranchName: string) => void;
    onDeleteBranchInRepo: (repoId: string, branchNameToDelete: string) => void;
}

type Tab = 'code' | 'issues' | 'prs' | 'commits' | 'wiki' | 'releases' | 'settings';

const ParticipantManager: React.FC<{
    repo: GitRepository;
    employees: Employee[];
    onUpdateRepo: (repo: GitRepository) => void;
}> = ({ repo, employees, onUpdateRepo }) => {
    const availableEmployees = employees.filter(e => !repo.participants.some(p => p.employeeId === e.id));
    const [newParticipant, setNewParticipant] = useState<{ employeeId: string; role: GitRepoParticipantRole }>({ employeeId: '', role: 'Developer' });

    const handleAdd = () => {
        if (!newParticipant.employeeId) return;
        const updatedRepo = { ...repo, participants: [...repo.participants, newParticipant] };
        onUpdateRepo(updatedRepo);
        setNewParticipant({ employeeId: '', role: 'Developer' });
    };
    
    const handleRemove = (employeeId: string) => {
        const updatedRepo = { ...repo, participants: repo.participants.filter(p => p.employeeId !== employeeId) };
        onUpdateRepo(updatedRepo);
    };

    const handleRoleChange = (employeeId: string, role: GitRepoParticipantRole) => {
        const updatedRepo = { ...repo, participants: repo.participants.map(p => p.employeeId === employeeId ? { ...p, role } : p) };
        onUpdateRepo(updatedRepo);
    };

    return (
        <div className="bg-primary p-4 rounded-md border">
            <h3 className="text-lg font-semibold mb-4">Manage Participants</h3>
            <div className="space-y-2 mb-4">
                {repo.participants.map(p => {
                    const employee = employees.find(e => e.id === p.employeeId);
                    return (
                        <div key={p.employeeId} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="flex items-center space-x-2">
                                <img src={`https://i.pravatar.cc/32?u=${employee?.id}`} alt={employee?.name} className="w-8 h-8 rounded-full" />
                                <span className="font-semibold">{employee?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select value={p.role} onChange={e => handleRoleChange(p.employeeId, e.target.value as GitRepoParticipantRole)} className="bg-primary border-secondary rounded p-1 text-sm">
                                    <option>Admin</option>
                                    <option>Maintainer</option>
                                    <option>Developer</option>
                                </select>
                                <button onClick={() => handleRemove(p.employeeId)} className="p-1 text-text-secondary hover:text-danger rounded-full"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center space-x-2 border-t pt-4">
                <select value={newParticipant.employeeId} onChange={e => setNewParticipant(p => ({...p, employeeId: e.target.value}))} className="flex-grow p-2 bg-primary border-secondary rounded-md text-sm">
                    <option value="">Select Employee...</option>
                    {availableEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <select value={newParticipant.role} onChange={e => setNewParticipant(p => ({...p, role: e.target.value as GitRepoParticipantRole}))} className="p-2 bg-primary border-secondary rounded-md text-sm">
                    <option>Developer</option>
                    <option>Maintainer</option>
                    <option>Admin</option>
                </select>
                <button onClick={handleAdd} className="p-2 bg-accent text-white rounded-md hover:bg-accent-hover"><PlusIcon className="w-5 h-5"/></button>
            </div>
        </div>
    )
};


export const RepoDetailView: React.FC<RepoDetailViewProps> = (props) => {
    const { repository, employees, currentUser, onBack, onDelete, onUpdateRepo, onUpdateWikiPages, onSaveIssue, onSavePullRequest, onSaveRelease, onUploadFileToRepo, onRenameFileInRepo, onDeleteFileInRepo, onCreateBranchInRepo, onRenameBranchInRepo, onDeleteBranchInRepo } = props;
    const [activeTab, setActiveTab] = useState<Tab>('code');
    const [modals, setModals] = useState({ issue: false, pr: false, release: false, manageBranches: false });
    const [fileToRename, setFileToRename] = useState<CodeFile | null>(null);
    const [fileToDelete, setFileToDelete] = useState<CodeFile | null>(null);
    const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
    const [selectedBranch, setSelectedBranch] = useState(repository.defaultBranch);
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const branchDropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setIsBranchDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBranchSelect = (branch: string) => {
        setSelectedBranch(branch);
        setIsBranchDropdownOpen(false);
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                const newFile: CodeFile = {
                    name: file.name,
                    type: 'file',
                    content,
                    lastCommit: {
                        message: `Upload file: ${file.name}`,
                        date: new Date().toISOString().split('T')[0],
                    },
                };
                onUploadFileToRepo(repository.id, selectedBranch, newFile);
            };
            reader.readAsText(file);
        }
        // Reset file input to allow uploading the same file again
        if(e.target) e.target.value = '';
    };

    const tabs: {id: Tab, label: string, icon: React.FC<any>}[] = [
        {id: 'code', label: 'Code', icon: CodeIcon},
        {id: 'issues', label: 'Issues', icon: DocumentTextIcon},
        {id: 'prs', label: 'Pull Requests', icon: GitBranchIcon},
        {id: 'commits', label: 'Commits', icon: CommitIcon},
        {id: 'releases', label: 'Releases', icon: TagIcon},
        {id: 'wiki', label: 'Wiki', icon: BookIcon},
        {id: 'settings', label: 'Settings', icon: CogIcon},
    ];

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete the repository "${repository.name}"? This action cannot be undone.`)) {
            onDelete();
        }
    }

    const issueColumns: Column<Issue>[] = [
        { header: 'Title', accessor: 'title', cell: i => <span className="font-semibold">{i.title}</span> },
        { header: 'Author', accessor: 'authorId', cell: i => employees.find(e => e.id === i.authorId)?.name || 'Unknown' },
        { header: 'Status', accessor: 'status', cell: i => <Badge text={i.status} color={i.status === 'Open' ? 'success' : 'danger'} size="sm" /> },
        { header: 'Created', accessor: 'createdAt' }
    ];

    const filesForBranch = repository.files[selectedBranch] || [];

    return (
        <>
        <div className="p-8 space-y-4">
            <button onClick={onBack} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-2">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Back to Git Projects</span>
            </button>

            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{repository.owner} / <span className="text-accent">{repository.name}</span></h1>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-secondary border border-primary rounded-md text-sm font-semibold"><StarIcon className="w-4 h-4"/><span>Star</span><span className="ml-1 px-1.5 bg-primary rounded-full text-xs">{repository.stars}</span></button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-secondary border border-primary rounded-md text-sm font-semibold"><GitForkIcon className="w-4 h-4"/><span>Fork</span><span className="ml-1 px-1.5 bg-primary rounded-full text-xs">{repository.forks}</span></button>
                </div>
            </header>

            <div className="border-b border-secondary">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'border-accent text-accent' 
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                           <tab.icon className="w-5 h-5" />
                           <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-secondary p-4 rounded-lg border border-primary min-h-[400px]">
                {activeTab === 'code' && (
                    <div>
                         <div className="flex justify-between items-center mb-4 p-2 bg-primary rounded-md">
                            <div className="flex items-center space-x-2">
                                <div className="relative" ref={branchDropdownRef}>
                                    <button onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)} className="flex items-center space-x-2 font-mono text-sm p-1 rounded hover:bg-slate-200">
                                        <GitBranchIcon className="w-4 h-4" />
                                        <span>{selectedBranch}</span>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </button>
                                    {isBranchDropdownOpen && (
                                        <div className="absolute top-full mt-1 w-48 bg-primary border border-secondary rounded-md shadow-lg z-10">
                                            {repository.branches.map(branch => (
                                                <button key={branch} onClick={() => handleBranchSelect(branch)} className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary ${branch === selectedBranch ? 'font-bold' : ''}`}>
                                                    {branch}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setModals(m => ({...m, manageBranches: true}))} className="text-sm font-semibold text-accent hover:underline">Manage branches</button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-1 px-3 py-1 bg-secondary border border-primary rounded-md text-sm font-semibold"><UploadIcon className="w-4 h-4"/><span>Upload file</span></button>
                            </div>
                        </div>
                        <div className="border rounded-md bg-primary divide-y divide-secondary text-sm">
                            {filesForBranch.map(file => (
                                <div key={file.name} className="p-2 flex items-center justify-between hover:bg-secondary group">
                                    <button onClick={() => setSelectedFile(file)} className="flex items-center flex-grow hover:text-accent truncate">
                                        <DocumentTextIcon className="w-4 h-4 mr-2 text-text-secondary"/>
                                        <span className="font-semibold truncate">{file.name}</span>
                                    </button>
                                    <div className="flex items-center flex-shrink-0">
                                        <span className="text-xs text-text-secondary hidden md:block mx-4 truncate">{file.lastCommit?.message}</span>
                                        <span className="text-xs text-text-secondary hidden lg:block mx-4">{file.lastCommit?.date}</span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setFileToRename(file)} className="p-1 hover:bg-slate-200 rounded" title="Rename"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => setFileToDelete(file)} className="p-1 hover:bg-slate-200 rounded" title="Delete"><TrashIcon className="w-4 h-4 text-danger" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedFile && selectedFile.type === 'file' && (
                             <div className="mt-6 p-4 border-t border-primary">
                                <h2 className="text-lg font-semibold flex items-center mb-2"><Badge text={selectedFile.name} /></h2>
                                <pre className="bg-primary p-2 rounded-md font-mono text-sm my-2 max-h-80 overflow-auto">{selectedFile.content}</pre>
                            </div>
                        )}
                        {filesForBranch.some(f => f.name === 'README.md') && (
                            <div className="mt-6 p-4 border-t border-primary">
                                <SimpleRenderer content={repository.readme} />
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'issues' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setModals(m => ({...m, issue: true}))} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold flex items-center space-x-2"><PlusIcon className="w-4 h-4"/><span>New Issue</span></button>
                        </div>
                        <Table columns={issueColumns} data={repository.issues} />
                    </div>
                )}
                 {activeTab === 'prs' && (
                    <div className="text-center py-12 text-text-secondary">
                        <h3 className="text-lg font-semibold">Pull Requests are under construction.</h3>
                        <p>This feature will be available soon.</p>
                    </div>
                )}
                 {activeTab === 'commits' && (
                    <RepoCommitsView commits={repository.commits} employees={employees} />
                )}
                {activeTab === 'releases' && (
                    <div className="text-center py-12 text-text-secondary">
                        <h3 className="text-lg font-semibold">Releases are under construction.</h3>
                        <p>This feature will be available soon.</p>
                    </div>
                )}
                {activeTab === 'wiki' && <WikiView pages={repository.wikiPages} onUpdatePages={onUpdateWikiPages} />}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <ParticipantManager repo={repository} employees={employees} onUpdateRepo={onUpdateRepo} />
                        <div className="bg-primary p-4 rounded-md border border-danger">
                            <h3 className="text-lg font-semibold text-danger">Danger Zone</h3>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm">Delete this repository. This action is irreversible.</p>
                                <button onClick={handleDeleteClick} className="px-4 py-2 bg-danger text-white rounded-md hover:opacity-90 font-semibold">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <GenericNewItemModal
            title="Create New Issue"
            isOpen={modals.issue}
            onClose={() => setModals(m => ({...m, issue: false}))}
            onSave={(title) => onSaveIssue({ id: Date.now(), title, authorId: currentUser.id, status: 'Open', createdAt: new Date().toISOString().split('T')[0] })}
        />

        {fileToRename && <RenameModal 
            isOpen={!!fileToRename}
            onClose={() => setFileToRename(null)}
            onRename={(newName) => {
                onRenameFileInRepo(repository.id, selectedBranch, fileToRename.name, newName);
                setFileToRename(null);
            }}
            currentName={fileToRename.name}
            itemType="file"
        />}

        {fileToDelete && <ConfirmationModal
            isOpen={!!fileToDelete}
            onClose={() => setFileToDelete(null)}
            onConfirm={() => {
                onDeleteFileInRepo(repository.id, selectedBranch, fileToDelete.name);
                setFileToDelete(null);
            }}
            title="Delete File"
        >
            Are you sure you want to delete the file "{fileToDelete.name}"? This action cannot be undone.
        </ConfirmationModal>}

        <ManageBranchesModal 
            isOpen={modals.manageBranches}
            onClose={() => setModals(m => ({...m, manageBranches: false}))}
            repo={repository}
            onCreateBranch={(newBranch, fromBranch) => onCreateBranchInRepo(repository.id, newBranch, fromBranch)}
            onRenameBranch={(oldName, newName) => onRenameBranchInRepo(repository.id, oldName, newName)}
            onDeleteBranch={(branchName) => onDeleteBranchInRepo(repository.id, branchName)}
        />
        </>
    );
};
