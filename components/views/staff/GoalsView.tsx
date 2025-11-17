import React, { useState, useMemo } from 'react';
import type { Goal, Employee, Department, GoalCheckIn, KeyResult } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { GoalModal } from '../goals/GoalModal';
import { GoalCard } from '../goals/GoalCard';
import { QuarterlyTimeline } from '../goals/QuarterlyTimeline';
import { CircularProgress } from '../../common/CircularProgress';
import { Card } from '../../common/Card';
import { UserIcon } from '../../icons/UserIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { InformationCircleIcon } from '../../icons/InformationCircleIcon';
import { GoalCheckInModal } from '../goals/GoalCheckInModal';

interface GoalsViewProps {
  goals: Goal[];
  employees: Employee[];
  departments: Department[];
  onUpdateGoal: (goal: Goal) => void;
  currentUser: Employee;
  isAdmin: boolean;
}

const GoalNode: React.FC<{
  goal: Goal;
  allGoals: Goal[];
  allEmployees: Employee[];
  level: number;
  onEdit: (goal: Goal) => void;
  onAddSubGoal: (parentGoal: Goal) => void;
  onUpdateProgress: (goal: Goal) => void;
}> = ({ goal, allGoals, allEmployees, level, onEdit, onAddSubGoal, onUpdateProgress }) => {
  const children = allGoals.filter(g => g.parentGoalId === goal.id);
  const assignee = allEmployees.find(e => e.id === goal.employeeId);
  const assigner = allEmployees.find(e => e.id === goal.assignerId);

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <GoalCard
        goal={goal}
        assignee={assignee}
        assigner={assigner}
        onEdit={() => onEdit(goal)}
        onAddSubGoal={() => onAddSubGoal(goal)}
        onUpdateProgress={() => onUpdateProgress(goal)}
      />
      {children.length > 0 && (
        <div className="mt-2 pl-4 border-l-2 border-secondary">
          {children.map(child => (
            <GoalNode
              key={child.id}
              goal={child}
              allGoals={allGoals}
              allEmployees={allEmployees}
              level={level + 1}
              onEdit={onEdit}
              onAddSubGoal={onAddSubGoal}
              onUpdateProgress={onUpdateProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, employees, departments, onUpdateGoal, currentUser, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [parentGoal, setParentGoal] = useState<Goal | null>(null);
  const [year, setYear] = useState(2024);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q4 2024');
  
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkingInGoal, setCheckingInGoal] = useState<Goal | null>(null);
  
  const isManager = useMemo(() => departments.some(d => d.managerId === currentUser.id), [departments, currentUser.id]);
  const canViewTeamGoals = isAdmin || isManager;
  const [activeTab, setActiveTab] = useState<'my-goals' | 'team-goals'>(canViewTeamGoals ? 'team-goals' : 'my-goals');

  // FIX: Create a memoized list of all goals for the selected period to be used for hierarchy traversal.
  const goalsForPeriod = useMemo(() => goals.filter(g => g.period === selectedPeriod), [goals, selectedPeriod]);

  const myGoals = useMemo(() => goalsForPeriod.filter(g => g.employeeId === currentUser.id), [goalsForPeriod, currentUser.id]);
  
  const teamGoals = useMemo(() => {
    if (!canViewTeamGoals) return [];
    return goalsForPeriod.filter(g => g.parentGoalId === null);
  }, [goalsForPeriod, canViewTeamGoals]);
  
  const goalsByDepartment = useMemo(() => {
    const grouped: { [key: string]: Goal[] } = {};
    teamGoals.forEach(goal => {
      const deptId = goal.departmentId || 'unassigned';
      if (!grouped[deptId]) {
        grouped[deptId] = [];
      }
      grouped[deptId].push(goal);
    });
    return grouped;
  }, [teamGoals]);

  const { onTrackCount, achievedCount, overallProgress } = useMemo(() => {
    if (myGoals.length === 0) return { onTrackCount: 0, achievedCount: 0, overallProgress: 0 };
    const onTrack = myGoals.filter(g => g.status === 'On Track').length;
    const achieved = myGoals.filter(g => g.status === 'Achieved').length;
    const totalProgress = myGoals.reduce((sum, g) => sum + g.progress, 0);
    const avgProgress = myGoals.length > 0 ? totalProgress / myGoals.length : 0;
    return { onTrackCount: onTrack, achievedCount: achieved, overallProgress: avgProgress };
  }, [myGoals]);


  const handleOpenModal = (goal: Goal | null = null, parent: Goal | null = null) => {
    setEditingGoal(goal);
    setParentGoal(parent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setParentGoal(null);
  };

  const handleSaveGoal = (goalToSave: Omit<Goal, 'id' | 'status' | 'progress'>) => {
    let finalGoal: Goal;
    if (editingGoal) {
      finalGoal = { ...editingGoal, ...goalToSave };
    } else {
      finalGoal = {
        ...goalToSave,
        id: `GOAL-${Date.now()}`,
        status: 'On Track',
        progress: 0,
        assignerId: parentGoal ? parentGoal.employeeId : (isAdmin ? currentUser.id : null),
        parentGoalId: parentGoal ? parentGoal.id : null,
      };
    }
    onUpdateGoal(finalGoal);
    handleCloseModal();
  };
  
  const handleOpenCheckInModal = (goal: Goal) => {
    setCheckingInGoal(goal);
    setIsCheckInModalOpen(true);
  };
  
  const handleSaveCheckIn = (updates: { keyResultId: string; newValue: number }[], comment: string) => {
    if (!checkingInGoal) return;
    
    const newCheckIn: GoalCheckIn = {
        id: `CI-${Date.now()}`,
        updaterId: currentUser.id,
        date: new Date().toISOString(),
        comment,
        updates: [],
    };
    
    const updatedKeyResults = checkingInGoal.keyResults.map(kr => {
        const update = updates.find(u => u.keyResultId === kr.id);
        if (update) {
            newCheckIn.updates.push({
                keyResultId: kr.id,
                previousValue: kr.currentValue,
                newValue: update.newValue,
            });
            return { ...kr, currentValue: update.newValue };
        }
        return kr;
    });
    
    // Recalculate progress based on average of KR progress
    const totalKrProgress = updatedKeyResults.reduce((sum, kr) => {
        // This logic is imperfect for 'decrease' goals but matches the display for consistency
        const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0;
        return sum + Math.min(100, Math.max(0, progress));
    }, 0);
    const newProgress = updatedKeyResults.length > 0 ? Math.round(totalKrProgress / updatedKeyResults.length) : 0;

    const updatedGoal: Goal = {
        ...checkingInGoal,
        keyResults: updatedKeyResults,
        progress: newProgress,
        checkIns: [...(checkingInGoal.checkIns || []), newCheckIn],
    };

    // Auto-update status
    if (newProgress >= 100) {
        updatedGoal.status = 'Achieved';
    }

    onUpdateGoal(updatedGoal);
    setIsCheckInModalOpen(false);
    setCheckingInGoal(null);
  };
  
  const assignableEmployees = useMemo(() => {
    if (isAdmin) return employees;
    // A manager can assign to their direct reports
    return employees.filter(e => e.reportsTo === currentUser.id);
  }, [employees, isAdmin, currentUser.id]);

  return (
    <>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Goals & OKRs</h1>
        <QuarterlyTimeline
          year={year}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onYearChange={setYear}
        />

        <div className="border-b border-secondary">
            <nav className="-mb-px flex space-x-6">
                <button onClick={() => setActiveTab('my-goals')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'my-goals' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    <UserIcon className="w-5 h-5" />
                    <span>My Goals</span>
                </button>
                {canViewTeamGoals && (
                    <button onClick={() => setActiveTab('team-goals')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'team-goals' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                    >
                        <UsersIcon className="w-5 h-5"/>
                        <span>Team Goals</span>
                    </button>
                )}
            </nav>
        </div>

        {activeTab === 'my-goals' && (
            <div className="space-y-6">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Overall Progress">
                        <div className="flex items-center justify-center h-full">
                            <CircularProgress progress={overallProgress} />
                        </div>
                    </Card>
                    <Card title="Objectives On Track" value={onTrackCount.toString()} />
                    <Card title="Objectives Achieved" value={achievedCount.toString()} />
                </section>
                {myGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      assignee={currentUser}
                      assigner={employees.find(e => e.id === goal.assignerId)}
                      onEdit={() => handleOpenModal(goal)}
                      onAddSubGoal={() => handleOpenModal(null, goal)}
                      onUpdateProgress={() => handleOpenCheckInModal(goal)}
                    />
                ))}
                {myGoals.length === 0 && <p className="text-center text-text-secondary py-8">No goals set for this period.</p>}
            </div>
        )}
        
        {activeTab === 'team-goals' && canViewTeamGoals && (
             <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="bg-blue-50 border-l-4 border-info text-info-dark p-4 rounded-md flex space-x-3">
                        <InformationCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold">How to Use Team Goals</h3>
                            <p className="text-sm">
                                1. <span className="font-semibold">Admins & Managers:</span> Click 'New Objective' to set high-level goals for a Department.<br/>
                                2. <span className="font-semibold">Managers & Leads:</span> Click 'Add Sub-goal' on an objective to break it down and assign smaller, focused goals to your team members.<br/>
                                3. <span className="font-semibold">Everyone:</span> Track how individual contributions align with company-wide targets.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal(null, null)}
                        className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>New Objective</span>
                    </button>
                </div>
                {/* FIX: Replaced Object.entries().map() with Object.keys().map() to work around a potential type inference issue where departmentTopLevelGoals was inferred as 'unknown'. */}
                {Object.keys(goalsByDepartment).map((deptId) => {
                    const departmentTopLevelGoals = goalsByDepartment[deptId];
                    const department = departments.find(d => d.id === deptId);
                    const manager = department ? employees.find(e => e.id === department.managerId) : null;
                    return (
                        <div key={deptId} className="bg-secondary p-4 rounded-lg">
                            <h2 className="text-xl font-bold text-text-primary">{department?.name || 'Unassigned / Personal'}</h2>
                            {manager && <p className="text-sm text-text-secondary mb-4">Managed by {manager.name}</p>}
                            <div className="space-y-4">
                                {departmentTopLevelGoals.map(goal => (
                                    <GoalNode
                                    key={goal.id}
                                    goal={goal}
                                    allGoals={goalsForPeriod}
                                    allEmployees={employees}
                                    level={0}
                                    onEdit={handleOpenModal}
                                    onAddSubGoal={(parent) => handleOpenModal(null, parent)}
                                    onUpdateProgress={handleOpenCheckInModal}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
                {teamGoals.length === 0 && <p className="text-center text-text-secondary py-8">No top-level objectives have been set for this period.</p>}
            </div>
        )}

      </div>
      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        goal={editingGoal}
        parentGoal={parentGoal}
        assignableEmployees={assignableEmployees}
        currentUser={currentUser}
        isAdmin={isAdmin}
        departments={departments}
        selectedPeriod={selectedPeriod}
      />
       <GoalCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => { setIsCheckInModalOpen(false); setCheckingInGoal(null); }}
        onSave={handleSaveCheckIn}
        goal={checkingInGoal}
        employeeName={currentUser.name}
      />
    </>
  );
};