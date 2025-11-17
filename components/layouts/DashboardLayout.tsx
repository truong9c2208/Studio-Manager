import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { DashboardView } from '../views/DashboardView';
import { ProjectsView } from '../views/ProjectsView';
import { CustomersView } from '../views/CustomersView';
import { EmployeesView } from '../views/EmployeesView';
import { InvoicesView } from '../views/InvoicesView';
import { TicketsView } from '../views/TicketsView';
import { SimpleTableView } from '../views/SimpleTableView';
import { ResourcesView } from '../views/ResourcesView';
import { CustomerDetailView } from '../views/CustomerDetailView';
import { ProjectDetailView } from '../views/ProjectDetailView';
import { EmployeeDetailView } from '../views/EmployeeDetailView';
import { MyDayDashboardView } from '../views/staff/MyDayDashboardView';
import { EventsView } from '../views/EventsView';
import { LicencesView } from '../views/LicencesView';
import { DepartmentDetailView } from '../views/admin/DepartmentDetailView';
import { NotificationsView } from '../views/NotificationsView';
import { InvoiceDetailModal } from '../views/invoices/InvoiceDetailModal';
import { ProductsView } from '../views/products/ProductsView';
import { GoalsView } from '../views/staff/GoalsView';
import { LearningView } from '../views/staff/LearningView';
import { CourseDetailView } from '../views/learning/CourseDetailView';
import { WorkflowsView } from '../views/staff/WorkflowsView';
import { WorkflowSidePanel } from '../workflow/WorkflowSidePanel';
import { mockProjects, mockInvoices, mockTickets, mockCustomers, mockNotifications, mockDepartments, mockEvents, mockLicences, mockProducts, mockProductCategories, mockPlugins, mockGitRepositories, mockLicenceActivity, mockRefundRequests, mockGoals, allAchievements, mockCourses, mockWorkflows } from '../../data/mockData';
import type { Employee, Project, Invoice, Ticket, Customer, Notification, Department, Event, Licence, Product, ProductCategory, Plugin, GitRepository, LicenceActivity, RefundRequest, Goal, Workflow, Course, Task, LearningAssignment, TimeOffRequest } from '../../types';
import * as api from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';
import { LogoutIcon } from '../icons/LogoutIcon';

interface DashboardLayoutProps {
    loggedInUser: Employee;
    onLogout: () => void;
    allUsers: Employee[];
    onUpdateEmployees: (employees: Employee[]) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ loggedInUser, onLogout, allUsers, onUpdateEmployees }) => {
    const { t } = useTranslation();
    
    // Data states
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [licences, setLicences] = useState<Licence[]>(mockLicences);
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>(mockProductCategories);
    const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
    const [gitRepositories, setGitRepositories] = useState<GitRepository[]>(mockGitRepositories);
    const [licenceActivity, setLicenceActivity] = useState<LicenceActivity[]>(mockLicenceActivity);
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(mockRefundRequests);
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
    
    // UI states
    const [viewingAsUser, setViewingAsUser] = useState<Employee>(loggedInUser);
    const isAdmin = viewingAsUser.systemRole === 'Admin';
    const [activeView, setActiveView] = useState(isAdmin ? 'Dashboard' : 'My Day');
    const [detailView, setDetailView] = useState<{ type: string; id: string } | null>(null);
    const [viewingCourse, setViewingCourse] = useState<{ course: Course, assignment: LearningAssignment } | null>(null);
    const [activeWorkflow, setActiveWorkflow] = useState<{ workflow: Workflow; step: number } | null>(null);

    useEffect(() => {
        // Keep viewingAsUser in sync if the underlying loggedInUser prop changes (e.g., after a data update)
        // but only if we are not actively viewing as someone else.
        if (viewingAsUser.id === loggedInUser.id) {
            setViewingAsUser(loggedInUser);
        }
    }, [loggedInUser, viewingAsUser.id]);
    
    const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const handleNavItemClick = (id: string) => {
        setActiveView(id);
        setDetailView(null);
        setViewingCourse(null);
    };

    const handleGoHome = () => {
        const homeView = isAdmin ? 'Dashboard' : 'My Day';
        handleNavItemClick(homeView);
    };

    const handleProfileClick = () => {
        // This should always show the logged in user's profile, not the "viewing as" user
        setDetailView({ type: 'my-profile', id: loggedInUser.id });
    };

    const handleSetViewingAsUser = (employeeId: string) => {
        const user = allUsers.find(e => e.id === employeeId);
        if (user) {
            setViewingAsUser(user);
            setActiveView(user.systemRole === 'Admin' ? 'Dashboard' : 'My Day');
            setDetailView(null);
            setViewingCourse(null);
        }
    };
    
    const handleUpdateEmployee = async (employee: Employee) => {
        await api.saveEmployee(employee);
        const updated = await api.getEmployees();
        onUpdateEmployees(updated);
    };
    
    const handleUpdateSchedule = async (employeeId: string, changedDate: string, newSchedule: Employee['schedule'], byAdmin: boolean) => {
        const employee = allUsers.find(e => e.id === employeeId);
        if (employee) {
            const changes = employee.dailyScheduleChanges || {};
            if (!byAdmin) {
                changes[changedDate] = (changes[changedDate] || 0) + 1;
            }
            await handleUpdateEmployee({ ...employee, schedule: newSchedule, dailyScheduleChanges: changes });
        }
    };
    
    const handleTimeOffRequest = async (request: Omit<TimeOffRequest, 'id' | 'status'>) => {
        const result = await api.saveTimeOffRequest(loggedInUser.id, request);
        if (result.success) {
            const updated = await api.getEmployees();
            onUpdateEmployees(updated);
        }
    };

    const handleUpdateGoal = (goal: Goal) => {
        const index = goals.findIndex(g => g.id === goal.id);
        if (index > -1) {
            setGoals(goals.map(g => g.id === goal.id ? goal : g));
        } else {
            setGoals([...goals, goal]);
        }
    };

    const handleStartWorkflow = (workflow: Workflow) => {
        setActiveWorkflow({ workflow, step: 0 });
        handleNavItemClick(workflow.steps[0].actionLink);
    };

    const handleCloseWorkflow = () => setActiveWorkflow(null);
    
    const handleNavigateWorkflowStep = (newStepIndex: number) => {
        if (activeWorkflow && newStepIndex >= 0 && newStepIndex < activeWorkflow.workflow.steps.length) {
            setActiveWorkflow(prev => prev ? ({ ...prev, step: newStepIndex }) : null);
            handleNavItemClick(activeWorkflow.workflow.steps[newStepIndex].actionLink);
        }
    };

    const handleCreateProject = async (projectData: { name: string, client: string, deadline: string, description: string }, generateWithAI: boolean) => {
        let tasks: Task[] = [];
        if (generateWithAI) {
            tasks = await api.generateProjectPlan(projectData.description, 3, projectData.deadline);
        }
        const newProject: Project = {
            id: `PROJ-${Date.now()}`,
            name: projectData.name,
            client: projectData.client,
            status: 'On Track',
            progress: 0,
            budget: 10000,
            spent: 0,
            deadline: projectData.deadline,
            team: [],
            tasks: tasks,
        };
        setProjects([...projects, newProject]);
        setDetailView({ type: 'project', id: newProject.id });
    };

    const renderDetailView = () => {
        if (viewingCourse) {
            return <CourseDetailView 
                course={viewingCourse.course}
                assignment={viewingCourse.assignment}
                onBack={() => setViewingCourse(null)}
                onUpdateAssignment={async (updatedAssignment) => {
                    const updatedUser = {
                        ...viewingAsUser,
                        learningPaths: viewingAsUser.learningPaths.map(lp => lp.courseId === updatedAssignment.courseId ? updatedAssignment : lp)
                    };
                    await handleUpdateEmployee(updatedUser);
                    setViewingCourse(prev => prev ? ({...prev, assignment: updatedAssignment}) : null);
                }}
            />;
        }
        if (!detailView) return null;
        switch (detailView.type) {
            case 'project':
                return <ProjectDetailView projectId={detailView.id} onBack={() => setDetailView(null)} projects={projects} employees={allUsers} onUpdateProject={async(p) => { await api.updateProject(p); setProjects(await api.getProjects()); }} isAdmin={isAdmin} currentUser={viewingAsUser} />;
            case 'customer':
                return <CustomerDetailView customerId={detailView.id} onBack={() => setDetailView(null)} invoices={invoices} tickets={tickets} />;
            case 'employee':
                return <EmployeeDetailView employeeId={detailView.id} onBack={() => setDetailView(null)} projects={projects} employees={allUsers} tickets={tickets} departments={departments} courses={courses} isAdmin={isAdmin} allAchievements={allAchievements} />;
            case 'my-profile':
                return <EmployeeDetailView 
                    employeeId={loggedInUser.id} 
                    onBack={() => setDetailView(null)} 
                    projects={projects} 
                    employees={allUsers} 
                    tickets={tickets} 
                    departments={departments}
                    courses={courses}
                    isMyProfile 
                    isAdmin={loggedInUser.systemRole === 'Admin'}
                    allAchievements={allAchievements}
                    onUpdateEmployee={handleUpdateEmployee}
                    onUpdateSchedule={handleUpdateSchedule}
                    onRequestWithdrawal={async (employeeId, amount, method) => { await api.requestWithdrawal(employeeId, amount, method); onUpdateEmployees(await api.getEmployees()); }}
                    onRedeemReward={async (employeeId, rewardId, cost) => { await api.redeemReward(employeeId, rewardId, cost); onUpdateEmployees(await api.getEmployees()); }}
                    onAddTransaction={async (employeeId, transaction) => { await api.addTransaction(employeeId, transaction); onUpdateEmployees(await api.getEmployees()); }}
                    onAwardAchievement={async (employeeId, achievementId) => { await api.awardAchievement(employeeId, achievementId); onUpdateEmployees(await api.getEmployees()); }}
                    onSaveTimeOffRequest={handleTimeOffRequest}
                />;
            case 'department':
                 return <DepartmentDetailView departmentId={detailView.id} onBack={() => setDetailView(null)} departments={departments} employees={allUsers} projects={projects} onUpdateEmployee={handleUpdateEmployee} />;
            case 'invoice':
                return <InvoiceDetailModal isOpen={true} onClose={() => setDetailView(null)} invoiceId={detailView.id} invoices={invoices} tickets={tickets} currentUser={viewingAsUser} />;
            default:
                return null;
        }
    };

    const renderActiveView = () => {
        if (detailView || viewingCourse) return renderDetailView();
        if (!isAdmin && (activeView === 'Dashboard' || activeView === 'My Day')) {
            return <MyDayDashboardView currentUser={viewingAsUser} projects={projects} tickets={tickets} onNavigate={handleNavItemClick} />
        }
        switch (activeView) {
            case 'Dashboard':
                return <DashboardView projects={projects} employees={allUsers} invoices={invoices} tickets={tickets} products={products} productCategories={productCategories} />;
            case 'Projects':
                return <ProjectsView projects={projects} employees={allUsers} onViewProject={(id) => setDetailView({ type: 'project', id })} isAdmin={isAdmin} currentUser={viewingAsUser} onCreateProject={handleCreateProject} />;
            case 'Customers':
                return <CustomersView onViewCustomer={(id) => setDetailView({ type: 'customer', id })} invoices={invoices} tickets={tickets} />;
            case 'Employees':
                return <EmployeesView employees={allUsers} departments={departments} onViewEmployee={(id) => setDetailView({ type: 'employee', id })} onUpdateEmployees={onUpdateEmployees} onSaveDepartment={async(d) => { await api.saveDepartment(d); setDepartments(await api.getDepartments()); }} onDeleteDepartment={async(id) => { await api.deleteDepartment(id); setDepartments(await api.getDepartments()); }} onViewDepartment={(id) => setDetailView({ type: 'department', id })} onUpdateEmployee={handleUpdateEmployee}/>;
            case 'Invoices':
                return <InvoicesView invoices={invoices} tickets={tickets} onUpdateInvoice={async(i) => { await api.updateInvoice(i); setInvoices(await api.getInvoices()); }} onViewInvoice={(id) => setDetailView({ type: 'invoice', id })} currentUser={viewingAsUser} />;
            case 'Tickets':
                return <TicketsView tickets={tickets} employees={allUsers} customers={customers} projects={projects} invoices={invoices} products={products} licences={licences} events={events} refundRequests={refundRequests} onUpdateTicket={async(t) => { await api.updateTicket(t); setTickets(await api.getTickets()); }} onProcessPayment={async(ticketId, amount, type) => { await api.processPaymentForTicket(ticketId, amount, type); setTickets(await api.getTickets()); }} onAddNote={async(ticketId, note) => { await api.addNoteToTicket(ticketId, note, viewingAsUser.id); setTickets(await api.getTickets()); }} onAddRefundRequest={async(req) => { await api.addRefundRequest(req); setRefundRequests(await api.getRefundRequests()); setTickets(await api.getTickets()); }} onViewInvoice={(id) => setDetailView({ type: 'invoice', id })} currentUser={viewingAsUser} />;
            case 'Resources':
                return <ResourcesView plugins={plugins} gitRepositories={gitRepositories} employees={allUsers} currentUser={viewingAsUser} onSavePlugin={async(p) => { await api.savePlugin(p); setPlugins(await api.getPlugins()); }} onDeletePlugin={async(id) => { await api.deletePlugin(id); setPlugins(await api.getPlugins()); }} onAddPluginVersion={async(id, v) => { await api.addPluginVersion(id, v); setPlugins(await api.getPlugins()); }} onUpdatePluginWiki={async(id, pages) => { await api.updatePluginWiki(id, pages); setPlugins(await api.getPlugins()); }} onSaveRepo={async(r) => { await api.saveRepo(r); setGitRepositories(await api.getGitRepositories()); }} onDeleteRepo={async(id) => { await api.deleteRepo(id); setGitRepositories(await api.getGitRepositories()); }} onUpdateRepoWiki={async(id, pages) => { await api.updateRepoWiki(id, pages); setGitRepositories(await api.getGitRepositories()); }} onSaveIssue={async(id, issue) => { await api.saveIssue(id, issue); setGitRepositories(await api.getGitRepositories()); }} onSavePullRequest={async(id, pr) => { await api.savePullRequest(id, pr); setGitRepositories(await api.getGitRepositories()); }} onSaveRelease={async(id, rel) => { await api.saveRelease(id, rel); setGitRepositories(await api.getGitRepositories()); }} onUploadFileToRepo={async(repoId, branch, file) => { await api.uploadFileToRepo(repoId, branch, file); setGitRepositories(await api.getGitRepositories()); }} onRenameFileInRepo={async(repoId, branch, oldName, newName) => { await api.renameFileInRepo(repoId, branch, oldName, newName); setGitRepositories(await api.getGitRepositories()); }} onDeleteFileInRepo={async(repoId, branch, fileName) => { await api.deleteFileInRepo(repoId, branch, fileName); setGitRepositories(await api.getGitRepositories()); }} onCreateBranchInRepo={async(repoId, newBranch, fromBranch) => { await api.createBranchInRepo(repoId, newBranch, fromBranch); setGitRepositories(await api.getGitRepositories()); }} onRenameBranchInRepo={async(repoId, oldName, newName) => { await api.renameBranchInRepo(repoId, oldName, newName); setGitRepositories(await api.getGitRepositories()); }} onDeleteBranchInRepo={async(repoId, branchName) => { await api.deleteBranchInRepo(repoId, branchName); setGitRepositories(await api.getGitRepositories()); }} />;
            case 'Events':
                return <EventsView events={events} employees={allUsers} projects={projects} onSaveEvent={async(e) => { await api.saveEvent(e); setEvents(await api.getEvents()); }} onDeleteEvent={async(id) => { await api.deleteEvent(id); setEvents(await api.getEvents()); }} isAdmin={isAdmin} />;
            case 'Licences':
                return <LicencesView licences={licences} customers={customers} products={products} employees={allUsers} tickets={tickets} licenceActivity={licenceActivity} onSaveLicence={async(l) => { await api.saveLicence(l); setLicences(await api.getLicences()); }} onDeleteLicence={async(id) => { await api.deleteLicence(id); setLicences(await api.getLicences()); }} onBulkUpdate={async(ids, status) => { await api.bulkUpdateLicenceStatus(ids, status); setLicences(await api.getLicences()); }} />;
            case 'Notifications':
                return <NotificationsView notifications={notifications} onMarkAsRead={async(id) => { await api.markNotificationAsRead(id); setNotifications(await api.getNotifications()); }} onMarkAllAsRead={async() => { await api.markAllNotificationsAsRead(); setNotifications(await api.getNotifications()); }} />;
            case 'Products':
                // FIX: Pass isAdmin prop to ProductsView.
                return <ProductsView products={products} categories={productCategories} invoices={invoices} onSaveProduct={async(p) => { await api.saveProduct(p); setProducts(await api.getProducts()); }} onDeleteProducts={async(ids) => { await api.deleteProducts(ids); setProducts(await api.getProducts()); }} onSaveCategory={async(c) => { await api.saveProductCategory(c); setProductCategories(await api.getProductCategories()); }} onDeleteCategory={async(id) => { await api.deleteProductCategory(id); setProductCategories(await api.getProductCategories()); }} isAdmin={isAdmin} />;
            case 'Goals':
                return <GoalsView goals={goals} employees={allUsers} departments={departments} onUpdateGoal={handleUpdateGoal} currentUser={viewingAsUser} isAdmin={isAdmin} />;
            case 'Learning':
                return <LearningView currentUser={viewingAsUser} allEmployees={allUsers} courses={courses} isAdmin={isAdmin} onSaveCourse={async(c) => { await api.saveCourse(c); setCourses(await api.getCourses()); }} onDeleteCourse={async(id) => { await api.deleteCourse(id); setCourses(await api.getCourses()); }} onSaveEmployee={handleUpdateEmployee} onViewCourse={setViewingCourse} />;
            case 'Workflows':
                return <WorkflowsView workflows={workflows} onStartWorkflow={handleStartWorkflow} isAdmin={isAdmin} onSaveWorkflow={async(w) => { await api.saveWorkflow(w); setWorkflows(await api.getWorkflows()); }} onDeleteWorkflow={async(id) => { await api.deleteWorkflow(id); setWorkflows(await api.getWorkflows()); }} />;
            default:
                return <SimpleTableView title={activeView} />;
        }
    };
    
    const activeViewData = useMemo(() => {
        if (viewingCourse) return { labelKey: 'nav_learning' };
        if (detailView) return { labelKey: `detail_view_${detailView.type.replace('-', '_')}`};
        return { labelKey: `nav_${activeView.toLowerCase()}` };
    }, [activeView, detailView, viewingCourse]);
    
    let pageTitle = t(activeViewData.labelKey as any);
    if (!isAdmin && (activeView === 'Dashboard' || activeView === 'My Day')) {
        pageTitle = t('nav_my_day');
    }
     if (viewingCourse) {
        pageTitle = viewingCourse.course.name;
    }

    return (
        <div className="flex h-screen bg-[#234C6A] text-text-primary font-sans">
            <Sidebar 
                activeItem={activeView} 
                onNavItemClick={handleNavItemClick} 
                isAdmin={isAdmin} 
                unreadNotificationsCount={unreadNotificationsCount}
                onLogoClick={handleGoHome}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    title={pageTitle}
                    loggedInUser={loggedInUser}
                    viewingAsUser={viewingAsUser}
                    allUsers={allUsers}
                    onSetViewingAsUser={handleSetViewingAsUser}
                    onProfileClick={handleProfileClick}
                    onLogout={onLogout}
                    onNavigate={handleNavItemClick}
                    unreadNotificationsCount={unreadNotificationsCount}
                />
                <div className="flex-1 overflow-y-auto">
                    {renderActiveView()}
                </div>
            </main>
            {activeWorkflow && (
                <WorkflowSidePanel 
                    workflow={activeWorkflow.workflow}
                    activeStepIndex={activeWorkflow.step}
                    onClose={handleCloseWorkflow}
                    onNavigateStep={handleNavigateWorkflowStep}
                    onNavigateView={handleNavItemClick}
                />
            )}
        </div>
    );
};