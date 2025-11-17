import React, { useState } from 'react';
import type { Plugin, GitRepository, Employee, PluginVersion, ProjectPage, Issue, PullRequest, Release, CodeFile } from '../../types';
import { GitProjectsView } from './resources/git/GitProjectsView';
import { PluginsView } from './resources/minecraft/PluginsView';
import { PluginDetailView } from './resources/minecraft/PluginDetailView';
import { RepoDetailView } from './resources/git/RepoDetailView';
import { CubeIcon } from '../icons/CubeIcon';
import { CodeIcon } from '../icons/CodeIcon';
import { PluginModal } from './resources/minecraft/PluginModal';
import { RepoModal } from './resources/git/RepoModal';

interface ResourcesViewProps {
    plugins: Plugin[];
    gitRepositories: GitRepository[];
    employees: Employee[];
    currentUser: Employee;
    onSavePlugin: (plugin: Plugin) => void;
    onDeletePlugin: (pluginId: string) => void;
    onAddPluginVersion: (pluginId: string, version: PluginVersion) => void;
    onSaveRepo: (repo: GitRepository) => void;
    onDeleteRepo: (repoId: string) => void;
    onUpdatePluginWiki: (pluginId: string, pages: ProjectPage[]) => void;
    onUpdateRepoWiki: (repoId: string, pages: ProjectPage[]) => void;
    onSaveIssue: (repoId: string, issue: Issue) => void;
    onSavePullRequest: (repoId: string, pr: PullRequest) => void;
    onSaveRelease: (repoId: string, release: Release) => void;
    onUploadFileToRepo: (repoId: string, branchName: string, newFile: CodeFile) => void;
    onRenameFileInRepo: (repoId: string, branchName: string, oldName: string, newName: string) => void;
    onDeleteFileInRepo: (repoId: string, branchName: string, fileName: string) => void;
    onCreateBranchInRepo: (repoId: string, newBranchName: string, fromBranchName: string) => void;
    onRenameBranchInRepo: (repoId: string, oldBranchName: string, newBranchName: string) => void;
    onDeleteBranchInRepo: (repoId: string, branchNameToDelete: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = (props) => {
    const { 
        plugins, gitRepositories, employees, currentUser,
        onSavePlugin, onDeletePlugin, onAddPluginVersion,
        onSaveRepo, onDeleteRepo, onUpdatePluginWiki, onUpdateRepoWiki,
        onSaveIssue, onSavePullRequest, onSaveRelease, ...repoHandlers
    } = props;
    
    const [activeTab, setActiveTab] = useState<'plugins' | 'git'>('plugins');
    const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
    const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);

    // Modal States
    const [isPluginModalOpen, setIsPluginModalOpen] = useState(false);
    const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
    const [editingRepo, setEditingRepo] = useState<GitRepository | null>(null);

    const selectedPlugin = plugins.find(p => p.id === selectedPluginId);
    const selectedRepo = gitRepositories.find(r => r.id === selectedRepoId);

    const handleAddNewPlugin = () => {
        setEditingPlugin(null);
        setIsPluginModalOpen(true);
    };

    const handleEditPlugin = (plugin: Plugin) => {
        setEditingPlugin(plugin);
        setIsPluginModalOpen(true);
    };

    const handleAddNewRepo = () => {
        setEditingRepo(null);
        setIsRepoModalOpen(true);
    };
    
    const handleEditRepo = (repo: GitRepository) => {
        setEditingRepo(repo);
        setIsRepoModalOpen(true);
    };

    const handleDeleteAndGoBack = (deleteFn: () => void, backFn: () => void) => {
        deleteFn();
        backFn();
    }

    const renderContent = () => {
        if (selectedPlugin) {
            return <PluginDetailView 
                plugin={selectedPlugin} 
                onBack={() => setSelectedPluginId(null)}
                onEdit={handleEditPlugin}
                onDelete={() => handleDeleteAndGoBack(() => onDeletePlugin(selectedPlugin.id), () => setSelectedPluginId(null))}
                onUpdatePlugin={onSavePlugin}
                onAddVersion={onAddPluginVersion}
                onUpdateWikiPages={(pages) => onUpdatePluginWiki(selectedPlugin.id, pages)}
            />;
        }
    
        if (selectedRepo) {
            return <RepoDetailView 
                repository={selectedRepo}
                employees={employees}
                currentUser={currentUser}
                onBack={() => setSelectedRepoId(null)}
                onEdit={handleEditRepo}
                onDelete={() => handleDeleteAndGoBack(() => onDeleteRepo(selectedRepo.id), () => setSelectedRepoId(null))}
                onUpdateRepo={onSaveRepo}
                onUpdateWikiPages={(pages) => onUpdateRepoWiki(selectedRepo.id, pages)}
                onSaveIssue={(issue) => onSaveIssue(selectedRepo.id, issue)}
                onSavePullRequest={(pr) => onSavePullRequest(selectedRepo.id, pr)}
                onSaveRelease={(release) => onSaveRelease(selectedRepo.id, release)}
                {...repoHandlers}
            />;
        }

        return (
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Resources</h1>
                </div>

                <div className="border-b border-secondary">
                    <nav className="-mb-px flex space-x-6">
                        <button
                            onClick={() => setActiveTab('plugins')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                activeTab === 'plugins'
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <CubeIcon className="w-5 h-5" />
                            <span>Minecraft Plugins</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('git')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                activeTab === 'git'
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <CodeIcon className="w-5 h-5" />
                            <span>Git Projects</span>
                        </button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'plugins' && (
                        <PluginsView plugins={plugins} onSelectPlugin={setSelectedPluginId} onAddNewPlugin={handleAddNewPlugin} />
                    )}
                    {activeTab === 'git' && (
                        <GitProjectsView repositories={gitRepositories} onSelectRepo={setSelectedRepoId} onAddNewRepo={handleAddNewRepo} />
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {renderContent()}
            
            <PluginModal 
                isOpen={isPluginModalOpen}
                onClose={() => setIsPluginModalOpen(false)}
                onSave={onSavePlugin}
                plugin={editingPlugin}
                employees={employees}
            />

            <RepoModal
                isOpen={isRepoModalOpen}
                onClose={() => setIsRepoModalOpen(false)}
                onSave={onSaveRepo}
                repo={editingRepo}
                employees={employees}
            />
        </>
    );
};
