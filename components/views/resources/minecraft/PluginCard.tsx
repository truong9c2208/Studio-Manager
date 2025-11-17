
import React from 'react';
import type { Plugin } from '../../../../types';
import { Badge } from '../../../common/Badge';

interface PluginCardProps {
    plugin: Plugin;
    onSelect: () => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin, onSelect }) => {
    const latestVersion = plugin.versions[0];
    return (
        <div onClick={onSelect} className="bg-secondary p-4 rounded-lg border border-primary hover:border-accent transition-colors cursor-pointer flex flex-col justify-between">
            <div>
                <div className="flex items-start space-x-3">
                    <img src={plugin.iconUrl} alt={plugin.name} className="w-16 h-16 rounded-md flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{plugin.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{plugin.tagline}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs text-text-secondary mt-4 pt-2 border-t border-primary">
                <span>By {plugin.authors.join(', ')}</span>
                <div className="flex items-center space-x-1">
                    <Badge text={plugin.category} color="accent" size="sm" />
                    {latestVersion && <Badge text={latestVersion.version} color="primary" size="sm" />}
                </div>
            </div>
        </div>
    );
};
