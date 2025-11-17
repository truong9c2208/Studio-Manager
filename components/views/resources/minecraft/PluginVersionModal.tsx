import React, { useState } from 'react';
import { Modal } from '../../../common/Modal';
import type { PluginVersion, ServerFork } from '../../../../types';
import { TagInput } from '../../../common/TagInput';

interface PluginVersionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (version: PluginVersion) => void;
}

const getEmptyVersion = (): Omit<PluginVersion, 'id' | 'downloads'> => ({
    version: '',
    changelog: '',
    releaseDate: new Date().toISOString().split('T')[0],
    minecraftVersions: [],
    supportedForks: [],
    downloadUrl: '#',
    fileName: '',
});

const mcVersionSuggestions = ["1.20.1", "1.20.2", "1.19.4", "1.18.2", "1.17.1", "1.16.5"];
const serverForkSuggestions: ServerFork[] = ['Paper', 'Spigot', 'Purpur', 'Folia', 'Fabric', 'Forge'];

export const PluginVersionModal: React.FC<PluginVersionModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(getEmptyVersion());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const versionToSave: PluginVersion = {
            ...formData,
            id: `v-${Date.now()}`,
            downloads: 0,
            fileName: formData.fileName || `Plugin-${formData.version}.jar`,
        };
        onSave(versionToSave);
        setFormData(getEmptyVersion()); // Reset form after save
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload New Version" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Version Number (e.g., 1.2.3)" name="version" value={formData.version} onChange={handleChange} required />
                <div>
                    <label htmlFor="changelog" className="block text-sm font-medium text-text-secondary">Changelog (Markdown)</label>
                    <textarea id="changelog" name="changelog" value={formData.changelog} onChange={handleChange} required rows={5} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Minecraft Versions</label>
                    <TagInput 
                        tags={formData.minecraftVersions}
                        onTagsChange={(tags) => setFormData(p => ({...p, minecraftVersions: tags}))}
                        suggestions={mcVersionSuggestions}
                        placeholder="Add MC versions (e.g., 1.20.1)"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Supported Server Forks</label>
                    <TagInput 
                        tags={formData.supportedForks}
                        // FIX: Cast string[] to ServerFork[] to match the type definition.
                        onTagsChange={(tags) => setFormData(p => ({...p, supportedForks: tags as ServerFork[]}))}
                        suggestions={serverForkSuggestions}
                        placeholder="Add server forks (e.g., Paper)"
                    />
                </div>

                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Upload File</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <p className="text-sm text-text-secondary">
                                <button type="button" className="font-medium text-accent hover:text-accent-hover focus:outline-none">
                                    Click to upload
                                </button>
                                <span> or drag and drop</span>
                            </p>
                             <p className="text-xs text-text-secondary">JAR file up to 10MB (Simulated)</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Upload Version</button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
    </div>
);