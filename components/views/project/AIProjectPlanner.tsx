import React, { useState } from 'react';
import type { Project, Task } from '../../../types';
import { generateProjectPlan } from '../../../services/api';
import { SparklesIcon } from '../../icons/SparklesIcon';

interface AIProjectPlannerProps {
    project: Project;
    onPlanGenerated: (tasks: Task[]) => void;
}

export const AIProjectPlanner: React.FC<AIProjectPlannerProps> = ({ project, onPlanGenerated }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // The project type does not have a description property. I'll construct one.
    const projectDescription = `Project: ${project.name} for client ${project.client}.`;

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const tasks = await generateProjectPlan(projectDescription, project.team.length, project.deadline);
            onPlanGenerated(tasks);
        } catch (error) {
            console.error("Failed to generate project plan:", error);
            const errorTask: Task = {
                id: 'TASK-ERROR',
                title: 'Error Generating Plan',
                description: 'The AI assistant could not generate a project plan. Please try again or create tasks manually.',
                status: 'To Do',
                priority: 'High',
            };
            onPlanGenerated([errorTask]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center p-8 bg-secondary rounded-lg border-2 border-dashed border-primary">
            <SparklesIcon className="w-12 h-12 mx-auto text-accent" />
            <h3 className="mt-2 text-lg font-semibold">Project Plan Not Started</h3>
            <p className="mt-1 text-sm text-text-secondary">
                Use our AI Assistant to generate a list of tasks based on your project's details.
            </p>
            <div className="mt-6">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex items-center justify-center mx-auto space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover disabled:bg-gray-400"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating Plan...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Generate with AI</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
