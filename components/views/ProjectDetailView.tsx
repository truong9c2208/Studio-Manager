import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { KanbanBoard } from './kanban/KanbanBoard';
import { TaskModal } from './kanban/TaskModal';
import type { Task, Project, Employee, ProjectPage } from '../../types';
import { ProjectTeam } from './project/ProjectTeam';
import { ProjectDocuments } from './project/ProjectDocuments';
import { ProjectPages } from './project/ProjectPages';
import { TaskStatusDonutChart } from './project/TaskStatusDonutChart';
import { TeamWorkloadBarChart } from './project/TeamWorkloadBarChart';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { ManageBudgetModal } from './project/ManageBudgetModal';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { UpcomingDeadlines } from './project/UpcomingDeadlines';
import { TeamContributionChart } from './project/TeamContributionChart';
import { Table, type Column } from '../common/Table';
import { PertChartView } from './project/PertChartView';

interface ProjectDetailViewProps {
    projectId: string;
    onBack: () => void;
    projects: Project[];
    employees: Employee[];
    onUpdateProject: (project: Project) => void;
    isAdmin: boolean;
    currentUser: Employee;
}

type Tab = 'overview' | 'tasks' | 'team' | 'documents' | 'wiki';
type TaskTab = 'list' | 'pert' | 'board';

const getEmptyTask = (projectId: string): Task => ({
    id: `TASK-${Date.now()}`,
    title: '',
    status: 'To Do',
    priority: 'Medium',
    points: 1,
    description: '',
    comments: [],
    startDate: new Date().toISOString().split('T')[0], // Automatically set start date
});

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId, onBack, projects, employees, onUpdateProject, isAdmin, currentUser }) => {
    const project = projects.find(p => p.id === projectId);
    
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [activeTaskTab, setActiveTaskTab] = useState<TaskTab>('pert');

    const projectTeamMembers = useMemo(() => {
        if (!project) return [];
        return project.team
            .map(member => employees.find(e => e.id === member.employeeId))
            .filter((e): e is Employee => e !== undefined);
    }, [project, employees]);

    const isProjectLeader = useMemo(() => {
        if (!project || !currentUser) return false;
        return isAdmin || project.team.some(member => 
            member.employeeId === currentUser.id && 
            (member.role.toLowerCase().includes('lead') || member.role.toLowerCase().includes('manager'))
        );
    }, [project, currentUser, isAdmin]);

    if (!project) {
        return <div className="p-8">Project not found.</div>;
    }
    
    const handleSaveTask = (taskToSave: Task) => {
        const isNew = !project.tasks.some(t => t.id === taskToSave.id);
        const updatedTasks = isNew
            ? [...project.tasks, taskToSave]
            : project.tasks.map(t => t.id === taskToSave.id ? taskToSave : t);
        
        onUpdateProject({ ...project, tasks: updatedTasks });
        setSelectedTask(null);
        setIsAddTaskModalOpen(false);
    };

    const handleDeleteTask = (taskId: string) => {
        const updatedTasks = project.tasks.filter(t => t.id !== taskId);
        onUpdateProject({ ...project, tasks: updatedTasks });
        setSelectedTask(null);
    }
    
    const handleSaveBudget = (newBudget: number, newSpent: number) => {
        onUpdateProject({ ...project, budget: newBudget, spent: newSpent });
        setIsBudgetModalOpen(false);
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Project['status'];
        onUpdateProject({ ...project, status: newStatus });
    };

    const statusStyling = {
        'On Track': { badge: 'success', select: 'bg-green-100 text-green-800 border-green-300 focus:ring-green-500' },
        'At Risk': { badge: 'warning', select: 'bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-500' },
        'Off Track': { badge: 'danger', select: 'bg-red-100 text-red-800 border-red-300 focus:ring-red-500' },
        'Completed': { badge: 'info', select: 'bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-500' },
    } as const;

    const tabs: {id: Tab, label: string}[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'team', label: 'Team' },
        { id: 'documents', label: 'Documents' },
        { id: 'wiki', label: 'Wiki' },
    ];
    
    const taskColumns: Column<Task>[] = [
        { header: 'Title', accessor: 'title', cell: t => <span className="font-semibold">{t.title}</span> },
        { header: 'Status', accessor: 'status', cell: (t) => <Badge text={t.status} color={t.status === 'Done' ? 'success' : (t.status === 'In Progress' ? 'warning' : 'info')} size="sm" /> },
        { header: 'Assignee', accessor: 'assigneeId', cell: (t) => t.assigneeId ? (employees.find(e => e.id === t.assigneeId)?.name || 'Unknown') : 'Unassigned' },
        { header: 'Priority', accessor: 'priority' },
        { 
            header: 'Est. Duration', 
            accessor: 'mostLikelyDuration', 
            cell: (t) => {
                if (t.optimisticDuration === undefined) return 'N/A';
                const pert = Math.round(((t.optimisticDuration || 0) + 4 * (t.mostLikelyDuration || 0) + (t.pessimisticDuration || 0)) / 6);
                return `${pert} day(s)`;
            }
        },
        { header: 'Dependencies', accessor: 'dependencies', cell: (t) => t.dependencies?.length || 0 },
    ];

    return (
        <div className="p-8 space-y-8">
            <header>
                <button onClick={onBack} className="flex items-center space-x-2 text-[#F2F2F2] hover:text-[#10b981] mb-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>Back to Projects</span>
                </button>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-bold text-[#FFFFFF]">{project.name}</h1>
                        {isAdmin ? (
                            <div className="relative">
                                <select
                                    value={project.status}
                                    onChange={handleStatusChange}
                                    className={`py-1 pl-3 pr-8 rounded-md text-sm font-semibold border appearance-none focus:outline-none focus:ring-2 ${statusStyling[project.status].select}`}
                                >
                                    <option value="On Track">On Track</option>
                                    <option value="At Risk">At Risk</option>
                                    <option value="Off Track">Off Track</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
                            </div>
                        ) : (
                             <Badge text={project.status} color={statusStyling[project.status].badge} />
                        )}
                    </div>
                    <p className="text-text-secondary font-semibold">{project.client}</p>
                </div>
            </header>

            <div className="border-b border-primary">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id 
                                    ? 'border-accent text-[#10b981]' 
                                    : 'border-transparent text-[#F2F2F2] hover:text-[#FFFFFF] hover:border-gray-300'}`
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'overview' && (
                     <div className="space-y-8">
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <Card title="Progress">
                                <div className="w-full bg-primary rounded-full h-4">
                                    <div className="bg-accent h-4 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <p className="text-center mt-2 font-bold text-lg text-[#FFFFFF]">{project.progress}%</p>
                            </Card>
                            <Card title="Budget">
                                {isAdmin && (
                                     <button onClick={() => setIsBudgetModalOpen(true)} className="absolute top-4 right-4 text-text-secondary hover:text-accent">
                                        <PencilIcon className="w-5 h-5" />
                                     </button>
                                )}
                                <p className="text-3xl font-bold text-[#FFFFFF]">${project.spent.toLocaleString()} / <span className="text-xl text-[#F2F2F2]">${project.budget.toLocaleString()}</span></p>
                                <div className="w-full bg-primary rounded-full h-2.5 mt-2">
                                    <div className="bg-info h-2.5 rounded-full" style={{ width: `${(project.spent / project.budget) * 100}%` }}></div>
                                </div>
                            </Card>
                            <Card title="Deadline" value={project.deadline} />
                        </section>
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TaskStatusDonutChart tasks={project.tasks} />
                            <UpcomingDeadlines tasks={project.tasks} allEmployees={employees} />
                            <TeamWorkloadBarChart tasks={project.tasks} allEmployees={employees} />
                            <TeamContributionChart tasks={project.tasks} allEmployees={employees} />
                        </section>
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-1 bg-slate-500/20 p-1 rounded-lg">
                                <button onClick={() => setActiveTaskTab('list')} className={`px-3 py-1 text-sm font-semibold rounded-md ${activeTaskTab === 'list' ? 'bg-slate-500/20 text-[#FFFFFF] shadow-sm' : 'text-text-secondary'}`}>List</button>
                                <button onClick={() => setActiveTaskTab('pert')} className={`px-3 py-1 text-sm font-semibold rounded-md ${activeTaskTab === 'pert' ? 'bg-slate-500/20 text-[#FFFFFF] shadow-sm' : 'text-text-secondary'}`}>Timeline (PERT)</button>
                                <button onClick={() => setActiveTaskTab('board')} className={`px-3 py-1 text-sm font-semibold rounded-md ${activeTaskTab === 'board' ? 'bg-slate-500/20 text-[#FFFFFF] shadow-sm' : 'text-text-secondary'}`}>Board</button>
                            </div>
                            <button onClick={() => setIsAddTaskModalOpen(true)} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                <PlusIcon className="w-5 h-5" />
                                <span>Add Task</span>
                            </button>
                        </div>

                        {activeTaskTab === 'list' && (
                            <Card>
                                <div className="-m-6">
                                    <Table
                                        columns={taskColumns}
                                        data={project.tasks}
                                        onRowClick={setSelectedTask}
                                    />
                                </div>
                            </Card>
                        )}
                        {activeTaskTab === 'pert' && (
                            <PertChartView tasks={project.tasks} criticalPath={project.criticalPath || []} onTaskClick={setSelectedTask} currentUser={currentUser} />
                        )}
                        {activeTaskTab === 'board' && (
                            <KanbanBoard tasks={project.tasks} onTaskClick={setSelectedTask} currentUser={currentUser} isProjectLeader={isProjectLeader} onTaskDrop={(taskId, newStatus) => {
                                const taskToUpdate = project.tasks.find(t => t.id === taskId);
                                if (taskToUpdate) {
                                    const isMyTask = taskToUpdate.assigneeId === currentUser.id;
                                    if (!isProjectLeader && !isMyTask) {
                                        console.warn("Permission denied: You can only move your own tasks.");
                                        // In a real app, you might show a toast notification here
                                        return; 
                                    }
                                    if (taskToUpdate.status !== newStatus) {
                                        handleSaveTask({ ...taskToUpdate, status: newStatus });
                                    }
                                }
                            }} />
                        )}
                    </div>
                )}
                {activeTab === 'team' && <ProjectTeam project={project} onUpdateProject={onUpdateProject} allEmployees={employees} />}
                {activeTab === 'documents' && <ProjectDocuments documents={project.documents || []} />}
                {activeTab === 'wiki' && <ProjectPages project={project} onUpdateProject={onUpdateProject} />}
            </div>
            
            {(selectedTask || isAddTaskModalOpen) && (
                <TaskModal 
                    isOpen={true} 
                    onClose={() => { setSelectedTask(null); setIsAddTaskModalOpen(false); }} 
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    task={selectedTask || getEmptyTask(project.id)}
                    project={project}
                    onUpdateProject={onUpdateProject}
                    teamMembers={projectTeamMembers}
                    currentUser={currentUser}
                    isProjectLeader={isProjectLeader}
                />
            )}

            {isBudgetModalOpen && (
                <ManageBudgetModal 
                    isOpen={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                    onSave={handleSaveBudget}
                    currentBudget={project.budget}
                    currentSpent={project.spent}
                />
            )}
        </div>
    );
};