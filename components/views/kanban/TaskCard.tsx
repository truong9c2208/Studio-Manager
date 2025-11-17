import React from 'react';
import type { Task, Employee } from '../../../types';
import { Badge } from '../../common/Badge';
import { CalendarIcon } from '../../icons/CalendarIcon';
import { ClipboardListIcon } from '../../icons/ClipboardListIcon';
import { StarIcon } from '../../icons/StarIcon';

interface TaskCardProps {
    task: Task;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    onClick: () => void;
    currentUser: Employee;
    isProjectLeader: boolean;
}

const priorityColorMap = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info',
} as const;

const getUrgency = (deadline?: string): 'overdue' | 'due-soon' | 'on-time' => {
    if (!deadline) return 'on-time';
    const dueDate = new Date(deadline);
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    // Normalize dates to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    twoDaysFromNow.setHours(0, 0, 0, 0);
    
    if (dueDate < today) return 'overdue';
    if (dueDate <= twoDaysFromNow) return 'due-soon';
    
    return 'on-time';
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick, currentUser, isProjectLeader }) => {
    const isMyTask = task.assigneeId === currentUser.id;
    const isDraggable = isProjectLeader || isMyTask;
    const urgency = getUrgency(task.deadline);
    const urgencyClassMap = {
      overdue: 'border-l-4 border-danger',
      'due-soon': 'border-l-4 border-warning',
      'on-time': 'border-l-4 border-transparent',
    };
    const myTaskClass = 'ring-2 ring-inset ring-accent';
    
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const completedSubtasks = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggable) {
            const cardElement = e.currentTarget;
            cardElement.classList.add('shake');
            setTimeout(() => {
                cardElement.classList.remove('shake');
            }, 820);
        }
    };

    return (
        <div 
            draggable={isDraggable}
            onDragStart={(e) => isDraggable && onDragStart(e, task.id)}
            onMouseDown={handleMouseDown}
            onClick={onClick}
            className={`bg-[#456882] p-3 rounded-md shadow-sm mb-3 hover:shadow-lg transition-shadow duration-200 ${isDraggable ? 'cursor-grab' : 'cursor-not-allowed'} ${isMyTask ? myTaskClass : urgencyClassMap[urgency]}`}
        >
            <h4 className="font-semibold text-sm mb-2 text-[#F2F2F2] flex items-center">
                {isMyTask && <span title="My Task"><StarIcon className="w-4 h-4 mr-1.5 text-yellow-400 flex-shrink-0" /></span>}
                {task.title}
            </h4>
             {task.deadline && (
                <div className="flex items-center text-xs text-[#A0AEC0] mt-1 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{task.deadline}</span>
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Badge text={task.priority} color={priorityColorMap[task.priority]} size="sm" />
                    {hasSubtasks && (
                        <div
                            className="flex items-center text-xs text-text-secondary"
                            title={`${completedSubtasks} of ${task.subtasks.length} subtasks completed`}
                        >
                            <ClipboardListIcon className="w-4 h-4 mr-1" />
                            <span>{completedSubtasks}/{task.subtasks.length}</span>
                        </div>
                    )}
                </div>
                {task.assigneeId && (
                    <img
                        src={`https://i.pravatar.cc/24?u=${task.assigneeId}`}
                        alt={task.assigneeId}
                        title={task.assigneeId}
                        className="w-6 h-6 rounded-full"
                    />
                )}
            </div>
        </div>
    );
};