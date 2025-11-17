import React, { useState } from 'react';
import type { Plugin, PluginVersion, ProjectPage } from '../../../../types';
import { ChevronLeftIcon } from '../../../icons/ChevronLeftIcon';
import { PluginCompatibility } from './PluginCompatibility';
import { PluginVersions } from './PluginVersions';
import { Badge } from '../../../common/Badge';
import { CodeIcon } from '../../../icons/CodeIcon';
import { BookIcon } from '../../../icons/BookIcon';
import { TagIcon } from '../../../icons/TagIcon';
import { PencilIcon } from '../../../icons/PencilIcon';
import { TrashIcon } from '../../../icons/TrashIcon';
import { PluginVersionModal } from './PluginVersionModal';
import { WikiView } from '../common/WikiView';

interface PluginDetailViewProps {
    plugin: Plugin;
    onBack: () => void;
    onEdit: (plugin: Plugin) => void;
    onDelete: () => void;
    onUpdatePlugin: (plugin: Plugin) => void;
    onAddVersion: (pluginId: string, version: PluginVersion) => void;
    onUpdateWikiPages: (pages: ProjectPage[]) => void;
}

type Tab = 'overview' | 'versions' | 'wiki';

export const PluginDetailView: React.FC<PluginDetailViewProps> = ({ plugin, onBack, onEdit, onDelete, onUpdatePlugin, onAddVersion, onUpdateWikiPages }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

    const tabs: {id: Tab, label: string, icon: React.FC<any>}[] = [
        {id: 'overview', label: 'Overview', icon: BookIcon},
        {id: 'versions', label: 'Versions', icon: TagIcon},
        {id: 'wiki', label: 'Wiki', icon: BookIcon},
    ];

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete the plugin "${plugin.name}"?`)) {
            onDelete();
        }
    };
    
    const handleAddVersion = (version: PluginVersion) => {
        onAddVersion(plugin.id, version);
        setIsVersionModalOpen(false);
    }
    
    const SimpleRenderer: React.FC<{ content: string }> = ({ content }) => {
        const lines = content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-4 mb-2 pb-2 border-b">{line.substring(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold mt-3 mb-1 pb-1 border-b">{line.substring(3)}</h2>;
            if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="my-2">{line}</p>;
        });
        return <div className="prose max-w-none">{lines}</div>;
    }

    return (
        <>
            <div className="p-8">
                <button onClick={onBack} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>Back to Plugins</span>
                </button>

                <header className="flex justify-between items-start mb-6">
                    <div className="flex items-start space-x-4">
                        <img src={plugin.iconUrl} alt={plugin.name} className="w-24 h-24 rounded-md" />
                        <div>
                            <h1 className="text-4xl font-bold">{plugin.name}</h1>
                            <p className="text-lg text-text-secondary mt-1">{plugin.tagline}</p>
                            <div className="mt-2">
                                <Badge text={plugin.category} color="accent" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => onEdit(plugin)} className="p-2 bg-secondary rounded-md hover:bg-primary"><PencilIcon className="w-5 h-5"/></button>
                        <button onClick={handleDeleteClick} className="p-2 bg-secondary rounded-md hover:bg-primary text-danger"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="border-b border-secondary mb-4">
                            <nav className="-mb-px flex space-x-6">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
                            {activeTab === 'overview' && <SimpleRenderer content={plugin.description} />}
                            {activeTab === 'versions' && <PluginVersions versions={plugin.versions} onAddVersion={() => setIsVersionModalOpen(true)} />}
                            {activeTab === 'wiki' && <WikiView pages={plugin.wikiPages} onUpdatePages={onUpdateWikiPages} />}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <PluginCompatibility versions={plugin.versions} />

                        <div className="bg-primary p-3 rounded-md border border-secondary">
                            <h3 className="text-sm font-semibold mb-2">Information</h3>
                            <ul className="text-xs space-y-1.5">
                                <li className="flex justify-between"><span>Authors:</span> <span className="font-semibold">{plugin.authors.join(', ')}</span></li>
                                <li className="flex justify-between"><span>Last Updated:</span> <span className="font-semibold">{plugin.lastUpdated}</span></li>
                                <li className="flex justify-between"><span>Latest Version:</span> <span className="font-semibold font-mono">{plugin.versions[0]?.version}</span></li>
                            </ul>
                        </div>

                        {plugin.dependencies.length > 0 && (
                            <div className="bg-primary p-3 rounded-md border border-secondary">
                                <h3 className="text-sm font-semibold mb-2">Dependencies</h3>
                                <div className="space-y-1">
                                    {plugin.dependencies.map(dep => (
                                        <a href={dep.link} key={dep.id} className="text-xs block p-1.5 bg-secondary rounded hover:bg-slate-200">
                                            <p className="font-semibold">{dep.name}</p>
                                            <p>{dep.required ? 'Required' : 'Optional'}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {plugin.sourceRepoId && (
                            <div className="bg-primary p-3 rounded-md border border-secondary">
                                <h3 className="text-sm font-semibold mb-2">Source Code</h3>
                                <button className="text-sm text-accent hover:underline w-full text-left flex items-center space-x-2">
                                    <CodeIcon className="w-4 h-4" />
                                    <span>View on Git</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PluginVersionModal 
                isOpen={isVersionModalOpen}
                onClose={() => setIsVersionModalOpen(false)}
                onSave={handleAddVersion}
            />
        </>
    );
};