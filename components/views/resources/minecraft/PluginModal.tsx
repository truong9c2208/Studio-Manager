import React, { useState, useEffect } from 'react';
import { Modal } from '../../../common/Modal';
import type { Plugin, Employee, ProjectPage } from '../../../../types';
import { MultiSelectDropdown } from '../../../common/MultiSelectDropdown';

interface PluginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plugin: Plugin) => void;
    plugin: Plugin | null;
    employees: Employee[];
}

const getEmptyPlugin = (employees: Employee[]): Omit<Plugin, 'id' | 'versions' | 'dependencies' | 'wikiPages' | 'lastUpdated'> => ({
    name: '',
    iconUrl: 'https://i.imgur.com/s6m8k2x.png',
    tagline: '',
    description: '',
    category: 'Gameplay',
    authors: [],
});

export const PluginModal: React.FC<PluginModalProps> = ({ isOpen, onClose, onSave, plugin, employees }) => {
    const [formData, setFormData] = useState(getEmptyPlugin(employees));

    useEffect(() => {
        if (plugin) {
            const { id, versions, dependencies, wikiPages, lastUpdated, ...rest } = plugin;
            setFormData(rest);
        } else {
            setFormData(getEmptyPlugin(employees));
        }
    }, [plugin, isOpen, employees]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAuthorChange = (selectedIds: string[]) => {
        const selectedNames = selectedIds.map(id => employees.find(e => e.id === id)?.name || '').filter(Boolean);
        setFormData(prev => ({...prev, authors: selectedNames}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const initialWikiPage: ProjectPage = {
             id: `wiki-${Date.now()}`,
             title: 'Home',
             content: `# ${formData.name} Wiki\n\nWelcome to the wiki!`
        };
        const pluginToSave: Plugin = {
            ...formData,
            id: plugin?.id || `plugin-${Date.now()}`,
            versions: plugin?.versions || [],
            dependencies: plugin?.dependencies || [],
            wikiPages: plugin?.wikiPages || [initialWikiPage],
            lastUpdated: new Date().toISOString().split('T')[0],
        };
        onSave(pluginToSave);
        onClose();
    };
    
    const employeeOptions = employees.map(e => ({ value: e.id, label: e.name }));
    const selectedAuthorIds = formData.authors.map(name => employees.find(e => e.name === name)?.id || '').filter(Boolean);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={plugin ? 'Edit Plugin' : 'Add New Plugin'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Plugin Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Icon URL" name="iconUrl" value={formData.iconUrl} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="tagline" className="block text-sm font-medium text-text-secondary">Tagline</label>
                    <input type="text" id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description (Markdown)</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            <option>Gameplay</option>
                            <option>Admin Tools</option>
                            <option>Economy</option>
                            <option>Fun</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">Authors</label>
                        <MultiSelectDropdown
                            options={employeeOptions}
                            selectedValues={selectedAuthorIds}
                            onChange={handleAuthorChange}
                            placeholder="Select authors..."
                        />
                    </div>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Plugin</button>
                </div>
            </form>
        </Modal>
    );
};

// Helper components for the form
const InputField: React.FC<any> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
    </div>
);