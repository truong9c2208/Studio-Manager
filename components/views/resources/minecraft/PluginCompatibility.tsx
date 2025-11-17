
import React from 'react';
import type { PluginVersion } from '../../../../types';
import { Badge } from '../../../common/Badge';

interface PluginCompatibilityProps {
    versions: PluginVersion[];
}

export const PluginCompatibility: React.FC<PluginCompatibilityProps> = ({ versions }) => {
    return (
        <div className="bg-primary p-3 rounded-md border border-secondary">
            <h3 className="text-sm font-semibold mb-2">Compatibility</h3>
            <div className="space-y-2 text-xs">
                {versions.slice(0, 3).map(v => ( // Show top 3 for brevity
                    <div key={v.id} className="flex items-center justify-between">
                        <span className="font-mono font-semibold bg-secondary px-2 py-0.5 rounded-md">{v.version}</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                            {v.minecraftVersions.map(mc => <Badge key={mc} text={mc} color="success" size="sm" />)}
                            {v.supportedForks.map(fork => <Badge key={fork} text={fork} color="info" size="sm" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
