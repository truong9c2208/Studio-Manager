import React, { useState } from 'react';
import type { Workflow } from '../../types';
import { CloseIcon } from '../icons/CloseIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface WorkflowSidePanelProps {
    workflow: Workflow;
    activeStepIndex: number;
    onClose: () => void;
    onNavigateStep: (stepIndex: number) => void;
    onNavigateView: (viewId: string) => void;
}

export const WorkflowSidePanel: React.FC<WorkflowSidePanelProps> = ({ workflow, activeStepIndex, onClose, onNavigateStep, onNavigateView }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    const activeStep = workflow.steps[activeStepIndex];

    if (isMinimized) {
        return (
            <button 
                onClick={() => setIsMinimized(false)}
                className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-accent text-white p-3 rounded-l-lg shadow-lg"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed top-20 right-0 bottom-0 w-80 bg-secondary border-l border-primary shadow-2xl z-40 flex flex-col">
            {/* Header */}
            <header className="p-4 border-b border-primary">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">{workflow.title}</h2>
                    <div>
                        <button onClick={() => setIsMinimized(true)} className="p-1 text-text-secondary hover:text-text-primary"><ChevronRightIcon className="w-5 h-5"/></button>
                        <button onClick={onClose} className="p-1 text-text-secondary hover:text-danger"><CloseIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <p className="text-xs text-text-secondary mt-1">Step {activeStepIndex + 1} of {workflow.steps.length}</p>
            </header>

            {/* Steps */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {workflow.steps.map((step, index) => {
                    const isCompleted = index < activeStepIndex;
                    const isActive = index === activeStepIndex;
                    return (
                        <div key={step.id} className="flex space-x-3">
                            <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs
                                    ${isActive ? 'bg-accent text-white' : isCompleted ? 'bg-success text-white' : 'bg-primary border border-secondary text-text-secondary'}`}
                                >
                                    {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : index + 1}
                                </div>
                                {index < workflow.steps.length - 1 && <div className="w-px h-full bg-secondary"></div>}
                            </div>
                            <div className={`pb-4 ${isActive ? '' : 'opacity-60'}`}>
                                <h4 className="font-semibold">{step.title}</h4>
                                {isActive && (
                                    <>
                                        <p className="text-sm text-text-secondary mt-1">{step.description}</p>
                                        <button 
                                            onClick={() => onNavigateView(step.actionLink)}
                                            className="mt-2 text-sm font-semibold text-accent hover:underline"
                                        >
                                            {step.actionText} &rarr;
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <footer className="p-4 border-t border-primary flex justify-between">
                <button 
                    onClick={() => onNavigateStep(activeStepIndex - 1)} 
                    disabled={activeStepIndex === 0}
                    className="px-4 py-2 bg-primary border border-secondary rounded-md text-sm font-semibold disabled:opacity-50"
                >
                    Previous
                </button>
                <button 
                    onClick={() => onNavigateStep(activeStepIndex + 1)}
                    disabled={activeStepIndex === workflow.steps.length - 1}
                    className="px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold disabled:opacity-50"
                >
                    Next
                </button>
            </footer>
        </div>
    );
};