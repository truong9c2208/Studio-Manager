import React, { useState, useMemo } from 'react';
import type { Plugin } from '../../../../types';
import { PluginCard } from './PluginCard';
import { SearchIcon } from '../../../icons/SearchIcon';
import { PlusIcon } from '../../../icons/PlusIcon';

interface PluginsViewProps {
    plugins: Plugin[];
    onSelectPlugin: (pluginId: string) => void;
    onAddNewPlugin: () => void;
}

export const PluginsView: React.FC<PluginsViewProps> = ({ plugins, onSelectPlugin, onAddNewPlugin }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlugins = useMemo(() => {
        if (!searchTerm) return plugins;
        return plugins.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plugin.tagline.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [plugins, searchTerm]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search plugins..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 bg-primary border border-secondary rounded-md"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                </div>
                <button onClick={onAddNewPlugin} className="flex-shrink-0 flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Plugin</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlugins.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} onSelect={() => onSelectPlugin(plugin.id)} />
                ))}
            </div>
        </div>
    );
};