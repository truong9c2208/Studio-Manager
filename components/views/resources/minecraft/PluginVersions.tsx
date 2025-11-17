import React from 'react';
import type { PluginVersion } from '../../../../types';
import { Badge } from '../../../common/Badge';
import { DownloadIcon } from '../../../icons/DownloadIcon';
import { PlusIcon } from '../../../icons/PlusIcon';

interface PluginVersionsProps {
    versions: PluginVersion[];
    onAddVersion: () => void;
}

export const PluginVersions: React.FC<PluginVersionsProps> = ({ versions, onAddVersion }) => {
    const totalDownloads = versions.reduce((sum, v) => sum + v.downloads, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-primary p-3 rounded-md border border-secondary">
                <div>
                    <h4 className="font-semibold text-text-secondary">Total Downloads</h4>
                    <p className="text-2xl font-bold text-accent">{totalDownloads.toLocaleString()}</p>
                </div>
                <button 
                    onClick={onAddVersion} 
                    className="flex items-center space-x-2 bg-primary border border-secondary text-text-primary px-3 py-1.5 rounded-md hover:bg-secondary text-sm font-semibold"
                >
                    <PlusIcon className="w-4 h-4"/>
                    <span>Upload New Version</span>
                </button>
            </div>
            {versions.map(v => (
                <div key={v.id} className="bg-primary p-4 rounded-lg border border-secondary transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <h3 className="text-xl font-bold font-mono text-accent">{v.version}</h3>
                            <p className="text-xs text-text-secondary mt-1">Released on {v.releaseDate}</p>
                        </div>
                        <a href={v.downloadUrl} className="mt-3 sm:mt-0 flex items-center justify-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover text-sm font-semibold w-full sm:w-auto">
                            <DownloadIcon className="w-5 h-5"/>
                            <div>
                                <span>Download</span>
                                <span className="font-normal opacity-80 ml-1">({v.downloads.toLocaleString()})</span>
                            </div>
                        </a>
                    </div>
                    <div className="text-sm text-text-primary my-3 prose prose-sm max-w-none border-t border-secondary pt-3">
                        <p>{v.changelog}</p>
                    </div>
                    <div className="border-t border-secondary pt-3 mt-3 flex items-center space-x-2">
                        <span className="text-xs font-semibold text-text-secondary">Compatibility:</span>
                        <div className="flex flex-wrap gap-1">
                            {v.minecraftVersions.map(mc => <Badge key={mc} text={`MC ${mc}`} color="success" size="sm" />)}
                            {v.supportedForks.map(fork => <Badge key={fork} text={fork} color="info" size="sm" />)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};