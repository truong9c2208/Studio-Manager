import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Workflow, WorkflowStep, NavItem } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';

interface WorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (workflow: Workflow) => void;
    workflow: Workflow | null;
    navItems: NavItem[];
}

const getEmptyWorkflow = (): Omit<Workflow, 'id'> => ({
    title: '',
    description: '',
    steps: [{ id: `WFS-${Date.now()}`, title: '', description: '', actionText: 'Go to...', actionLink: 'Dashboard' }],
});

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose, onSave, workflow, navItems }) => {
    const [formData, setFormData] = useState(getEmptyWorkflow());

    useEffect(() => {
        if (isOpen) {
            setFormData(workflow ? { ...workflow } : getEmptyWorkflow());
        }
    }, [workflow, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStepChange = (index: number, field: keyof Omit<WorkflowStep, 'id'>, value: string) => {
        const newSteps = [...formData.steps];
        const stepToUpdate = { ...newSteps[index] };
        // @ts-ignore
        stepToUpdate[field] = value;
        newSteps[index] = stepToUpdate;
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        const newStep: WorkflowStep = { id: `WFS-${Date.now()}`, title: '', description: '', actionText: 'Go to...', actionLink: 'Dashboard' };
        setFormData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    };

    const removeStep = (index: number) => {
        if (formData.steps.length > 1) {
            setFormData(prev => ({ ...prev, steps: formData.steps.filter((_, i) => i !== index) }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const workflowToSave: Workflow = {
            ...formData,
            id: workflow?.id || `WF-${Date.now()}`,
        };
        onSave(workflowToSave);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={workflow ? 'Edit Workflow' : 'Create New Workflow'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Workflow Title" name="title" value={formData.title} onChange={handleChange} required />
                <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required />

                <div>
                    <h3 className="text-md font-semibold mb-2">Steps</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {formData.steps.map((step, index) => (
                            <div key={index} className="p-3 bg-secondary rounded-md space-y-2 relative">
                                <p className="font-bold text-sm">Step {index + 1}</p>
                                <InputField label="Step Title" value={step.title} onChange={(e: any) => handleStepChange(index, 'title', e.target.value)} />
                                <InputField label="Description" value={step.description} onChange={(e: any) => handleStepChange(index, 'description', e.target.value)} />
                                <div className="grid grid-cols-2 gap-2">
                                    <InputField label="Action Button Text" value={step.actionText} onChange={(e: any) => handleStepChange(index, 'actionText', e.target.value)} />
                                    <SelectField label="Action Link" value={step.actionLink} onChange={(e: any) => handleStepChange(index, 'actionLink', e.target.value)}>
                                        {navItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                                    </SelectField>
                                </div>
                                {formData.steps.length > 1 && <button type="button" onClick={() => removeStep(index)} className="absolute top-2 right-2 p-1 text-text-secondary hover:text-danger"><TrashIcon className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addStep} className="flex items-center space-x-1 text-sm text-accent hover:underline mt-2">
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Step</span>
                    </button>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Workflow</button>
                </div>
            </form>
        </Modal>
    );
};

// Helper components
const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-text-secondary">{label}</label>
        <input {...props} className="w-full mt-1 p-2 text-sm bg-primary border border-secondary rounded-md" />
    </div>
);
const TextAreaField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
        <textarea {...props} rows={2} className="w-full mt-1 p-2 text-sm bg-primary border border-secondary rounded-md" />
    </div>
);
const SelectField: React.FC<any> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-text-secondary">{label}</label>
        <select {...props} className="w-full mt-1 p-2 text-sm bg-primary border border-secondary rounded-md">
            {children}
        </select>
    </div>
);
