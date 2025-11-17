import React, { useState, useMemo, useEffect } from 'react';
import type { Employee, Project, Ticket, Department, WalletTransaction, TimeOffRequest, Achievement, Course, LearningAssignment } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { RadarChart } from '../charts/RadarChart';
import { CustomerSatisfactionGauge } from '../charts/CustomerSatisfactionGauge';
import { ActivityFeed, type ActivityItem } from '../common/ActivityFeed';
import { Table, type Column } from '../common/Table';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { TicketsIcon } from '../icons/TicketsIcon';
import { ProjectsIcon } from '../icons/ProjectsIcon';
import { StarIcon } from '../icons/StarIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { EmployeeScheduleCalendar } from './employee/EmployeeScheduleCalendar';
import { PencilIcon } from '../icons/PencilIcon';
import { ClipboardDocumentIcon } from '../icons/ClipboardDocumentIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { WalletTabView } from './employee/WalletTabView';
import { CameraIcon } from '../icons/CameraIcon';

interface EmployeeDetailViewProps {
    employeeId: string;
    onBack: () => void;
    projects: Project[];
    employees: Employee[];
    tickets: Ticket[];
    departments: Department[];
    courses: Course[];
    isMyProfile?: boolean;
    isAdmin: boolean;
    allAchievements: Achievement[];
    onUpdateEmployee?: (employee: Employee) => void;
    onUpdateSchedule?: (employeeId: string, changedDate: string, newSchedule: Employee['schedule'], byAdmin: boolean) => void;
    onRequestWithdrawal?: (employeeId: string, amount: number, method: string) => void;
    onRedeemReward?: (employeeId: string, rewardId: string, cost: number) => void;
    onAddTransaction?: (employeeId: string, transaction: Omit<WalletTransaction, 'id' | 'date'>) => void;
    onAwardAchievement?: (employeeId: string, achievementId: string) => void;
    onSaveTimeOffRequest?: (request: Omit<TimeOffRequest, 'id' | 'status'>) => void;
}

type Tab = 'performance' | 'projects' | 'tickets' | 'ratings' | 'schedule' | 'wallet';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

export const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = (props) => {
    const { 
        employeeId, onBack, projects, employees, tickets, departments, courses,
        isMyProfile = false, isAdmin, onUpdateEmployee, onUpdateSchedule,
        onRequestWithdrawal, onRedeemReward, onAddTransaction, onSaveTimeOffRequest,
        allAchievements, onAwardAchievement
    } = props;

    const [activeTab, setActiveTab] = useState<Tab>('performance');
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const employee = useMemo(() => employees.find(e => e.id === employeeId), [employees, employeeId]);
    const [formData, setFormData] = useState<Employee | undefined>(employee);
    const [avatarUrl, setAvatarUrl] = useState(`https://i.pravatar.cc/80?u=${employeeId}`);

    useEffect(() => {
        setFormData(employee);
        setAvatarUrl(`https://i.pravatar.cc/80?u=${employeeId}`);
        setIsEditing(false); // Reset editing state when employee changes
    }, [employee, employeeId]);

    const departmentName = useMemo(() => {
        return departments.find(d => d.id === employee?.departmentId)?.name || 'N/A';
    }, [departments, employee]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!formData) return;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1] as keyof Employee['address'];
            setFormData({ ...formData, address: { ...formData.address, [addressField]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = () => {
        if (formData && onUpdateEmployee) {
            onUpdateEmployee(formData);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(employee);
        setIsEditing(false);
    };
    
    const handleAvatarChange = () => {
        // In a real app, this would open a file dialog and upload the image.
        // For this demo, we'll just cycle the avatar to show the change.
        setAvatarUrl(`https://i.pravatar.cc/80?u=${Date.now()}`);
    };

    const involvedProjects = useMemo(() => projects.filter(p => p.team.some(member => member.employeeId === employeeId)), [projects, employeeId]);
    const assignedTickets = useMemo(() => tickets.filter(t => employee && (t.ownerId === employee.id || t.assignees.some(a => a.employeeId === employee.id))), [tickets, employee]);

    const activityItems: ActivityItem[] = useMemo(() => [
        { icon: <CheckCircleIcon className="w-4 h-4 text-white" />, color: 'bg-success', text: <p>Completed task <strong>"API Integration"</strong> in Project Alpha.</p>, time: '1 day ago' },
        { icon: <TicketsIcon className="w-4 h-4 text-white" />, color: 'bg-info', text: <p>Closed ticket <strong>#TKT-03</strong> for Future Systems.</p>, time: '3 days ago' },
        { icon: <ProjectsIcon className="w-4 h-4 text-white" />, color: 'bg-accent', text: <p>Was assigned to <strong>Project Beta</strong> as UX/UI Designer.</p>, time: '1 week ago' },
    ], []);


    if (!employee || !formData) {
        return <div className="p-8">Employee not found.</div>;
    }
    
    const handleScheduleUpdate = (changedDate: string, newSchedule: Employee['schedule']) => {
        onUpdateSchedule?.(employeeId, changedDate, newSchedule, isAdmin && !isMyProfile);
    };

    const projectColumns: Column<Project>[] = [
        { header: 'Project Name', accessor: 'name' },
        { header: 'Client', accessor: 'client' },
        { header: 'Role', accessor: 'team', cell: (p) => p.team.find(m => m.employeeId === employeeId)?.role || 'N/A' },
        { header: 'Status', accessor: 'status', cell: (p) => <Badge text={p.status} color={p.status === 'Completed' ? 'info' : 'success'} /> },
    ];
    
    const ticketColumns: Column<Ticket>[] = [
        { header: 'Subject', accessor: 'title' },
        { header: 'Customer', accessor: 'requesterName' },
        { header: 'Status', accessor: 'status', cell: (t) => <Badge text={t.status} color={t.status === 'Closed' ? 'success' : 'danger'} /> },
        { header: 'Priority', accessor: 'priority', cell: (t) => <Badge text={t.priority} color={t.priority === 'High' ? 'danger' : 'warning'} /> },
    ];

    const tabs: {id: Tab, label: string, myProfileOnly?: boolean}[] = [
        { id: 'performance', label: 'Performance' },
        { id: 'wallet', label: 'Wallet & Rewards' },
        { id: 'ratings', label: 'Ratings' },
        { id: 'projects', label: 'Projects' },
        { id: 'tickets', label: 'Tickets' },
        { id: 'schedule', label: 'Schedule & Time Off' },
    ];
    
    const visibleTabs = tabs.filter(tab => !tab.myProfileOnly || isMyProfile);


    return (
        <div className="p-8 space-y-6">
            <header>
                {!isMyProfile && (
                     <button onClick={onBack} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4">
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>Back to Employees</span>
                    </button>
                )}
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <img src={avatarUrl} alt={employee.name} className="w-20 h-20 rounded-full" />
                            {isMyProfile && (
                                <button onClick={handleAvatarChange} className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-8 h-8" />
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center space-x-3">
                               <h1 className="text-3xl font-bold">{employee.name}</h1>
                               <Badge text={employee.status} color={employee.status === 'Active' ? 'success' : 'warning'} />
                            </div>
                            <p className="text-text-secondary">{employee.role} - {departmentName}</p>
                        </div>
                    </div>
                     {isMyProfile && (
                        <div className="space-x-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="text-sm font-semibold text-text-secondary hover:text-text-primary px-4 py-2 rounded-md bg-primary border border-secondary">Cancel</button>
                                    <button onClick={handleSave} className="text-sm font-semibold text-white bg-accent hover:bg-accent-hover px-4 py-2 rounded-md">Save Changes</button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 bg-primary border border-secondary text-text-primary px-4 py-2 rounded-md hover:bg-secondary">
                                    <PencilIcon className="w-5 h-5" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Contact & Personal Information">
                        {isEditing ? (
                             <div className="space-y-3 pt-2">
                                <InputField label="Name" name="name" value={formData.name} onChange={handleFormChange} />
                                <InputField label="Email" name="email" value={formData.email} onChange={handleFormChange} type="email" />
                                <InputField label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} type="tel" />
                                <InputField label="Street" name="address.street" value={formData.address.street} onChange={handleFormChange} />
                                <InputField label="City" name="address.city" value={formData.address.city} onChange={handleFormChange} />
                                <InputField label="State" name="address.state" value={formData.address.state} onChange={handleFormChange} />
                                <InputField label="Zip" name="address.zip" value={formData.address.zip} onChange={handleFormChange} />
                             </div>
                        ) : (
                            <ul className="text-sm space-y-2">
                                <li className="flex justify-between">
                                    <span className="font-semibold text-text-secondary">Email:</span>
                                    <a href={`mailto:${employee.email}`} className="text-accent hover:underline">{employee.email}</a>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-semibold text-text-secondary">Phone:</span>
                                    <span>{employee.phone}</span>
                                </li>
                                <li className="flex justify-between items-start">
                                    <span className="font-semibold text-text-secondary">Address:</span>
                                    <span className="text-right">{employee.address.street},<br/>{employee.address.city}, {employee.address.state} {employee.address.zip}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-semibold text-text-secondary">System Role:</span>
                                    <Badge text={employee.systemRole} color={employee.systemRole === 'Admin' ? 'accent' : 'primary'} size="sm" />
                                </li>
                            </ul>
                        )}
                    </Card>
                     <Card title="Key Metrics">
                        <ul className="text-sm space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Revenue Generated:</span>
                                <span className="font-bold text-lg text-success">${employee.revenueGenerated.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Projects Involved:</span>
                                <span className="font-bold text-lg">{involvedProjects.length}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Tickets Closed:</span>
                                <span className="font-bold text-lg">{assignedTickets.filter(t => t.status === 'Closed').length}</span>
                            </li>
                        </ul>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-b border-primary">
                        <nav className="-mb-px flex space-x-6 overflow-x-auto">
                            {visibleTabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === tab.id 
                                        ? 'border-accent text-accent' 
                                        : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <RadarChart kpi={employee.kpi} />
                                <CustomerSatisfactionGauge score={employee.customerRating} />
                            </div>
                            <ActivityFeed title="Recent Activity" items={activityItems} />
                        </div>
                    )}
                    {activeTab === 'wallet' && (
                        <WalletTabView 
                            employee={employee}
                            isMyProfile={isMyProfile}
                            isAdmin={isAdmin}
                            onRequestWithdrawal={onRequestWithdrawal}
                            onRedeemReward={onRedeemReward}
                            onAddTransaction={onAddTransaction}
                            allTickets={tickets}
                            allAchievements={allAchievements}
                            onAwardAchievement={onAwardAchievement}
                        />
                    )}
                    {activeTab === 'projects' && (
                        <Card title="Project History">
                            <div className="-m-6">
                                <Table columns={projectColumns} data={involvedProjects} />
                            </div>
                        </Card>
                    )}
                     {activeTab === 'tickets' && (
                        <Card title="Ticket Assignments">
                            <div className="-m-6">
                                <Table columns={ticketColumns} data={assignedTickets} />
                            </div>
                        </Card>
                    )}
                    {activeTab === 'ratings' && (
                        <div className="space-y-6">
                            <Card title="Peer Reviews">
                                {employee.peerRatings.length > 0 ? (
                                    <div className="space-y-4">
                                        {employee.peerRatings.map((rating, i) => {
                                            const reviewer = isMyProfile ? { name: 'A Colleague', id: 'anonymous-colleague' } : employees.find(e => e.id === rating.reviewerId);
                                            return (
                                                <div key={i} className="p-3 bg-primary rounded-md">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <img src={`https://i.pravatar.cc/32?u=${reviewer?.id}`} alt={reviewer?.name} className="w-8 h-8 rounded-full" />
                                                            <span className="font-semibold">{reviewer?.name}</span>
                                                        </div>
                                                        <span className="text-xs text-text-secondary">{new Date(rating.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="italic text-text-secondary mb-3">"{rating.comment}"</p>
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex justify-between"><span>Collaboration:</span> <StarRating rating={rating.criteria.collaboration} /></div>
                                                        <div className="flex justify-between"><span>Technical Skill:</span> <StarRating rating={rating.criteria.technicalSkill} /></div>
                                                        <div className="flex justify-between"><span>Creativity:</span> <StarRating rating={rating.criteria.creativity} /></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : <p className="text-center text-text-secondary py-4">No peer reviews available.</p>}
                            </Card>
                             <Card title="Customer Feedback">
                                {employee.customerFeedback.length > 0 ? (
                                    <div className="space-y-4">
                                        {employee.customerFeedback.map((fb, i) => (
                                            <div key={i} className="p-3 bg-primary rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold">{isMyProfile ? 'A Customer' : fb.customerName} <span className="font-normal text-text-secondary">({fb.projectName})</span></p>
                                                        <p className="italic text-text-secondary mt-1">"{fb.comment}"</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0 ml-4">
                                                        <StarRating rating={fb.rating} />
                                                        <p className="text-xs text-text-secondary mt-1">{new Date(fb.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center text-text-secondary py-4">No customer feedback available.</p>}
                            </Card>
                        </div>
                    )}
                    {activeTab === 'schedule' && (
                         <EmployeeScheduleCalendar 
                            employee={employee}
                            onUpdateSchedule={handleScheduleUpdate}
                            isMyProfile={isMyProfile}
                            isAdmin={isAdmin}
                            onSaveTimeOffRequest={onSaveTimeOffRequest}
                         />
                    )}
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = 
({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="text-xs font-semibold text-text-secondary">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md text-sm"
        />
    </div>
);