
import React, { useMemo } from 'react';
import type { Employee, Project, Ticket } from '../../../types';
import { Card } from '../../common/Card';
import { ClockIcon } from '../../icons/ClockIcon';
import { ClipboardListIcon } from '../../icons/ClipboardListIcon';
import { TicketsIcon } from '../../icons/TicketsIcon';
import { PlusIcon } from '../../icons/PlusIcon';

interface MyDayDashboardViewProps {
  currentUser: Employee;
  projects: Project[];
  tickets: Ticket[];
  onNavigate: (viewId: string) => void;
}

const TaskItem: React.FC<{ task: any, projectName: string }> = ({ task, projectName }) => (
    <div className="flex justify-between items-center p-2 hover:bg-primary rounded-md">
        <div>
            <p className="font-semibold">{task.title}</p>
            <p className="text-xs text-text-secondary">{projectName} - Due: {task.deadline}</p>
        </div>
        <div className="text-xs font-bold text-danger">{task.priority}</div>
    </div>
);

const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
    <div className="flex justify-between items-center p-2 hover:bg-primary rounded-md">
        <div>
            <p className="font-semibold">{ticket.title}</p>
            <p className="text-xs text-text-secondary">#{ticket.id} - from {ticket.requesterName}</p>
        </div>
        <div className="text-xs font-bold text-warning">{ticket.priority}</div>
    </div>
);

export const MyDayDashboardView: React.FC<MyDayDashboardViewProps> = ({ currentUser, projects, tickets, onNavigate }) => {
    
    const today = new Date();
    const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    const todaysSchedule = useMemo(() => {
        return currentUser.schedule.find(s => s.date === todayString);
    }, [currentUser.schedule, todayString]);

    const myTasksDueSoon = useMemo(() => {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        
        return projects.flatMap(p => 
            p.tasks
                .filter(t => 
                    // FIX: Property 'assignee' does not exist on type 'Task'. Did you mean 'assigneeId'? Also, compare by ID not name.
                    t.assigneeId === currentUser.id &&
                    t.status !== 'Done' &&
                    t.deadline &&
                    new Date(t.deadline) >= today &&
                    new Date(t.deadline) <= threeDaysFromNow
                )
                .map(t => ({ ...t, projectName: p.name }))
        ).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
        // FIX: Update dependency from currentUser.name to currentUser.id
    }, [projects, currentUser.id, today]);

    const myOpenTickets = useMemo(() => {
        return tickets.filter(t => 
            (t.ownerId === currentUser.id || t.assignees.some(a => a.employeeId === currentUser.id)) &&
            (t.status === 'Open' || t.status === 'In Progress')
        ).sort((a, b) => a.priority === 'High' ? -1 : 1);
    }, [tickets, currentUser.id]);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Good Morning, {currentUser.name.split(' ')[0]}!</h1>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Today's Schedule">
                    <div className="flex items-center space-x-3">
                        <ClockIcon className="w-8 h-8 text-accent" />
                        <div>
                            <p className="font-semibold">{today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            {todaysSchedule && todaysSchedule.shifts.length > 0 ? (
                                <div className="text-sm text-text-secondary">{todaysSchedule.shifts.join(', ')}</div>
                            ) : (
                                <div className="text-sm text-text-secondary">No shifts scheduled today.</div>
                            )}
                        </div>
                    </div>
                </Card>
                 <div className="flex items-center justify-around bg-secondary p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
                    <button onClick={() => onNavigate('Goals')} className="text-center font-semibold text-accent hover:underline">
                        <p className="text-3xl">🎯</p>
                        <p>My Goals</p>
                    </button>
                    <button onClick={() => onNavigate('Learning')} className="text-center font-semibold text-accent hover:underline">
                         <p className="text-3xl">🎓</p>
                        <p>Learning</p>
                    </button>
                    <button onClick={() => onNavigate('Workflows')} className="text-center font-semibold text-accent hover:underline">
                         <p className="text-3xl">🚀</p>
                        <p>Start Workflow</p>
                    </button>
                 </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="My Tasks Due Soon">
                    <div className="space-y-2 h-64 overflow-y-auto pr-2">
                        {myTasksDueSoon.length > 0 ? (
                            myTasksDueSoon.map(task => <TaskItem key={task.id} task={task} projectName={task.projectName} />)
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                <p>No tasks due in the next 3 days. Great job!</p>
                            </div>
                        )}
                    </div>
                </Card>
                <Card title="My Open Tickets">
                     <div className="space-y-2 h-64 overflow-y-auto pr-2">
                        {myOpenTickets.length > 0 ? (
                            myOpenTickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                <p>Inbox zero! No open tickets assigned.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </section>
        </div>
    );
};
