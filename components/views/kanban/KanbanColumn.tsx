import React, { useMemo } from 'react';
import type { Task, Employee } from '../../../types';
import { TaskCard } from './TaskCard';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';

interface KanbanColumnProps {
    title: TaskStatus;
    tasks: Task[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
    currentUser: Employee;
    isProjectLeader: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, onDragStart, onDrop, onTaskClick, currentUser, isProjectLeader }) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const sortedTasks = useMemo(() => {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return [...tasks].sort((a, b) => {
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            if (a.deadline && b.deadline) {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            if (a.deadline) return -1;
            if (b.deadline) return 1;

            return 0;
        });
    }, [tasks]);

    return (
        <div 
            className="bg-[#1B3C53] rounded-lg p-3 w-80 flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, title)}
        >
            <h3 className="font-bold text-lg mb-4 px-1 text-[#F2F2F2]">{title} <span className="text-sm font-normal text-[#A0AEC0]">{tasks.length}</span></h3>
            <div className="h-full">
                {sortedTasks.map(task => <TaskCard key={task.id} task={task} onDragStart={onDragStart} onClick={() => onTaskClick(task)} currentUser={currentUser} isProjectLeader={isProjectLeader} />)}
            </div>
        </div>
    );
};