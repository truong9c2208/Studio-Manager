import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import type { Task, Employee } from '../../../types';
import { ClockIcon } from '../../icons/ClockIcon';

interface UpcomingDeadlinesProps {
    tasks: Task[];
    allEmployees: Employee[];
}

const differenceInDays = (date1: Date, date2: Date): number => {
    const diffTime = date1.getTime() - date2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ tasks, allEmployees }) => {
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        return tasks
            .filter(task => {
                if (task.status === 'Done' || !task.deadline) {
                    return false;
                }
                const deadlineDate = new Date(task.deadline);
                deadlineDate.setHours(0, 0, 0, 0);
                return deadlineDate >= today && deadlineDate <= sevenDaysFromNow;
            })
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
    }, [tasks]);

    return (
        <Card title="Upcoming Deadlines">
            <div className="space-y-3 pt-2 h-64 overflow-y-auto">
                {upcomingTasks.length > 0 ? upcomingTasks.map(task => {
                    const deadline = new Date(task.deadline!);
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    deadline.setHours(0,0,0,0);
                    const daysLeft = differenceInDays(deadline, today);

                    let urgencyColor = 'text-green-500';
                    if (daysLeft <= 1) urgencyColor = 'text-red-500';
                    else if (daysLeft <= 3) urgencyColor = 'text-yellow-500';

                    const assigneeName = allEmployees.find(e => e.id === task.assigneeId)?.name || 'Unassigned';

                    return (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-primary">
                            <div>
                                <p className="font-semibold text-sm text-text-primary">{task.title}</p>
                                <p className="text-xs text-text-secondary">{assigneeName}</p>
                            </div>
                            <div className={`text-sm font-bold flex items-center ${urgencyColor}`}>
                                <ClockIcon className="w-4 h-4 mr-1" />
                                {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex items-center justify-center h-full text-[#F2F2F2]">
                        <p>No deadlines in the next 7 days.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};