import React, { useState, useMemo } from 'react';
import type { Project, Employee, Customer } from '../../types';
import { ProjectCard } from './ProjectCard';
import { GridIcon } from '../icons/GridIcon';
import { TableIcon } from '../icons/TableIcon';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { PlusIcon } from '../icons/PlusIcon';
import { ProjectStatusDonutChart } from './project/ProjectStatusDonutChart';
import { ProjectsBudgetChart } from './project/ProjectsBudgetChart';
import { OverallTeamContributionChart } from './project/OverallTeamContributionChart';
import { NewProjectModal } from './project/NewProjectModal';
import { mockCustomers } from '../../data/mockData';

interface ProjectsViewProps {
    projects: Project[];
    employees: Employee[];
    onViewProject: (projectId: string) => void;
    isAdmin: boolean;
    currentUser: Employee;
    onCreateProject: (projectData: { name: string, client: string, deadline: string, description: string }, generateWithAI: boolean) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, employees, onViewProject, isAdmin, currentUser, onCreateProject }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [activeTab, setActiveTab] = useState<'all' | 'my'>(isAdmin ? 'all' : 'my');
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const myProjects = useMemo(() => {
        return projects.filter(p => p.team.some(member => member.employeeId === currentUser.id));
    }, [projects, currentUser]);

    const projectsToShow = activeTab === 'all' ? projects : myProjects;

    const columns: Column<Project>[] = [
        { header: 'Project Name', accessor: 'name' },
        { header: 'Client', accessor: 'client' },
        { 
            header: 'Status', 
            accessor: 'status',
            cell: (project) => {
                const statusMap = {
                    'On Track': 'success',
                    'At Risk': 'warning',
                    'Off Track': 'danger',
                    'Completed': 'info',
                } as const;
                return <Badge text={project.status} color={statusMap[project.status]} size="sm" />;
            }
        },
        { 
            header: 'Progress', 
            accessor: 'progress',
            cell: (project) => (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
            )
        },
        {
            header: 'Budget',
            accessor: 'budget',
            cell: (project) => `$${project.spent.toLocaleString()} / $${project.budget.toLocaleString()}`
        },
        { header: 'Deadline', accessor: 'deadline' },
    ];

    return (
        <>
            <div className="p-8 space-y-8">
                <h1 className="text-3xl font-bold text-[#FFFFFF]">Projects Dashboard</h1>

                {/* Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isAdmin && <ProjectStatusDonutChart title="All Projects Status" projects={projects} />}
                    <ProjectStatusDonutChart title="My Projects" projects={myProjects} />
                </section>
                
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProjectsBudgetChart projects={isAdmin ? projects : myProjects} />
                    <OverallTeamContributionChart projects={isAdmin ? projects : myProjects} allEmployees={employees} />
                </section>
                
                {/* Project List Section */}
                <div>
                    <div className="flex justify-between items-center border-b border-secondary mb-6">
                        {/* Tabs */}
                        <nav className="-mb-px flex space-x-6">
                            {isAdmin && (
                                <button 
                                    onClick={() => setActiveTab('all')}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'all' 
                                        ? 'border-accent text-[#10b981]' 
                                        : 'border-transparent text-[#F2F2F2] hover:text-[#FFFFFF] hover:border-gray-300'
                                    }`}
                                >
                                    All Projects
                                </button>
                            )}
                            <button 
                                onClick={() => setActiveTab('my')}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'my' 
                                    ? 'border-accent text-[#10b981]' 
                                    : 'border-transparent text-[#F2F2F2] hover:text-[#FFFFFF] hover:border-gray-300'
                                }`}
                            >
                                My Projects
                            </button>
                        </nav>

                        {/* Controls */}
                        <div className="flex items-center space-x-4 pb-2">
                            <div className="flex items-center bg-primary p-1 rounded-md">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : ''}`}>
                                    <GridIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-accent text-white' : ''}`}>
                                    <TableIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <button onClick={() => setIsNewProjectModalOpen(true)} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                <PlusIcon className="w-5 h-5" />
                                <span>New Project</span>
                            </button>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectsToShow.map((project) => (
                                <ProjectCard key={project.id} project={project} employees={employees} onClick={() => onViewProject(project.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-secondary rounded-lg">
                            <Table columns={columns} data={projectsToShow} onRowClick={(project) => onViewProject(project.id)} />
                        </div>
                    )}
                </div>
            </div>
            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onCreate={onCreateProject}
                customers={mockCustomers}
            />
        </>
    );
};