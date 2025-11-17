import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import type { Customer } from '../../../types';
import { SparklesIcon } from '../../icons/SparklesIcon';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (projectData: { name: string, client: string, deadline: string, description: string }, generateWithAI: boolean) => void;
    customers: Customer[];
}

const templates = [
    { name: 'Web App', prompt: 'Build a web application for [purpose] that includes features like [feature A], [feature B], and [feature C]. The target audience is [audience].' },
    { name: 'Marketing Campaign', prompt: 'Launch a digital marketing campaign for [product/service] targeting [demographic]. The campaign should run for [duration] and include channels like [channel A] and [channel B]. Key success metric is [metric].' },
    { name: 'Event Planning', prompt: 'Organize a [type of event] for approximately [number] attendees. The event is scheduled for [date/season] and the goal is to [goal]. Key components include venue selection, speaker coordination, and attendee registration.' },
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate, customers }) => {
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');

    const resetForm = () => {
        setName('');
        setClient('');
        setDeadline('');
        setDescription('');
    };

    const handleGenerateWithAI = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            alert("Please provide a project description for the AI to generate a plan.");
            return;
        }
        onCreate({ name, client, deadline, description }, true);
        resetForm();
        onClose();
    };

    const handleCreateBlank = () => {
        if (!name.trim() || !client || !deadline) {
            alert("Please fill in Project Name, Client, and Deadline to create a blank project.");
            return;
        }
        onCreate({ name, client, deadline, description: '' }, false);
        resetForm();
        onClose();
    };

    const applyTemplate = (prompt: string) => {
        setDescription(prompt);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="lg">
            <form onSubmit={handleGenerateWithAI} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Project Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-text-secondary">Client</label>
                        <select id="client" value={client} onChange={e => setClient(e.target.value)} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                            <option value="" disabled>Select a client</option>
                            {customers.map(c => <option key={c.id} value={c.company}>{c.company}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary">Deadline</label>
                    <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">AI Project Planner</label>
                    <p className="text-xs text-text-secondary mb-1">Describe your project goal for the AI, or create a blank project.</p>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="e.g., Build a web application for project management..." className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>

                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Template Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                        {templates.map(t => (
                            <button type="button" key={t.name} onClick={() => applyTemplate(t.prompt)} className="px-3 py-1 text-sm bg-secondary rounded-full hover:bg-primary border border-secondary">
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end items-center space-x-4">
                    <button
                        type="button"
                        onClick={handleCreateBlank}
                        className="font-semibold text-accent hover:underline"
                    >
                        Create Blank Project
                    </button>
                    <button type="submit" className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover font-semibold">
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate with AI</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};