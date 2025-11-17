import React, { useState, useMemo } from 'react';
import type { Workflow, NavItem } from '../../../types';
import { Card } from '../../common/Card';
import { PlusIcon } from '../../icons/PlusIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { WorkflowModal } from '../workflows/WorkflowModal';
import { NAV_ITEMS } from '../../../constants';
import { useTranslation } from '../../../hooks/useTranslation';

interface WorkflowsViewProps {
  workflows: Workflow[];
  onStartWorkflow: (workflow: Workflow) => void;
  isAdmin: boolean;
  onSaveWorkflow: (workflow: Workflow) => void;
  onDeleteWorkflow: (workflowId: string) => void;
}

const WorkflowCard: React.FC<{ workflow: Workflow; onStart: () => void; }> = ({ workflow, onStart }) => {
    return (
        <Card>
            <h3 className="text-lg font-bold">{workflow.title}</h3>
            <p className="text-sm text-text-secondary mt-2 h-16">{workflow.description}</p>
            <div className="mt-4">
                <button onClick={onStart} className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover font-semibold">
                    Start Process
                </button>
            </div>
        </Card>
    );
};

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({ workflows, onStartWorkflow, isAdmin, onSaveWorkflow, onDeleteWorkflow }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

    // FIX: Create a correctly typed NavItem array with translated labels for the modal.
    const navItemsWithLabels: NavItem[] = useMemo(() => (
        NAV_ITEMS.map(item => ({
            ...item,
            label: t(item.labelKey as any)
        }))
    ), [t]);

    const handleNew = () => {
        setEditingWorkflow(null);
        setIsModalOpen(true);
    };

    const handleEdit = (workflow: Workflow) => {
        setEditingWorkflow(workflow);
        setIsModalOpen(true);
    };

    const handleDelete = (workflowId: string) => {
        if (window.confirm("Are you sure you want to delete this workflow?")) {
            onDeleteWorkflow(workflowId);
        }
    };

    if (isAdmin) {
        return (
            <>
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">{t('workflows_manage_title')}</h1>
                        <button onClick={handleNew} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                            <PlusIcon className="w-5 h-5" />
                            <span>{t('workflows_btn_new')}</span>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {workflows.map(workflow => (
                            <div key={workflow.id} className="bg-secondary p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{workflow.title}</h3>
                                    <p className="text-sm text-text-secondary">{workflow.steps.length} {t('workflows_steps')}</p>
                                </div>
                                <div className="space-x-2">
                                    <button onClick={() => handleEdit(workflow)} className="p-2 hover:bg-primary rounded-full"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(workflow.id)} className="p-2 hover:bg-primary rounded-full text-danger"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <WorkflowModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSaveWorkflow}
                    workflow={editingWorkflow}
                    navItems={navItemsWithLabels}
                />
            </>
        )
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Process Workflows</h1>
            <p className="text-text-secondary">Select a standard process to be guided through the required steps.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {workflows.map(workflow => (
                    <WorkflowCard key={workflow.id} workflow={workflow} onStart={() => onStartWorkflow(workflow)} />
                ))}
            </div>
        </div>
    );
};