import React from 'react';
import type { Task, Employee } from '../../../types';
import { KanbanColumn } from './KanbanColumn';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';

interface KanbanBoardProps {
    tasks: Task[];
    onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
    currentUser: Employee;
    isProjectLeader: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskDrop, onTaskClick, currentUser, isProjectLeader }) => {
    const todoTasks = tasks.filter(t => t.status === 'To Do');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onTaskDrop(taskId, newStatus);
        }
    };

    return (
        <div className="flex space-x-4 overflow-x-auto p-1 pb-4">
            <KanbanColumn title="To Do" tasks={todoTasks} onDragStart={handleDragStart} onDrop={handleDrop} onTaskClick={onTaskClick} currentUser={currentUser} isProjectLeader={isProjectLeader} />
            <KanbanColumn title="In Progress" tasks={inProgressTasks} onDragStart={handleDragStart} onDrop={handleDrop} onTaskClick={onTaskClick} currentUser={currentUser} isProjectLeader={isProjectLeader} />
            <KanbanColumn title="Done" tasks={doneTasks} onDragStart={handleDragStart} onDrop={handleDrop} onTaskClick={onTaskClick} currentUser={currentUser} isProjectLeader={isProjectLeader} />
        </div>
    );
};