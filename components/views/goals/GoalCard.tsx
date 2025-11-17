import React from 'react';
import type { Goal, Employee, KeyResult } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { Badge } from '../../common/Badge';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import { TrendingUpIcon } from '../../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../../icons/TrendingDownIcon';
import { TimeProgressBar } from './TimeProgressBar';
import { ClipboardDocumentCheckIcon } from '../../icons/ClipboardDocumentCheckIcon';

interface GoalCardProps {
  goal: Goal;
  assignee?: Employee;
  assigner?: Employee;
  onEdit: () => void;
  onAddSubGoal: () => void;
  onUpdateProgress: () => void;
}

const KeyResultRow: React.FC<{ kr: KeyResult }> = ({ kr }) => {
  const isDecrease = kr.targetDirection === 'decrease';
  const rawProgress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0;
  const progress = Math.min(100, Math.max(0, rawProgress));
  
  return (
    <div className="py-2">
      <div className="flex justify-between items-center text-sm">
        <p className="flex-1 pr-4">{kr.description}</p>
        <div className="flex items-center space-x-2 font-semibold w-32 justify-end">
            {isDecrease ? <TrendingDownIcon className="w-4 h-4 text-info"/> : <TrendingUpIcon className="w-4 h-4 text-success"/>}
            <span>{kr.currentValue} / {kr.targetValue} {kr.unit}</span>
        </div>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, assignee, assigner, onEdit, onAddSubGoal, onUpdateProgress }) => {
  const statusMap = {
    'On Track': 'success',
    'At Risk': 'warning',
    'Achieved': 'info',
    'Missed': 'danger',
  } as const;

  return (
    <div className="bg-primary p-4 rounded-lg border border-secondary shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-lg text-text-primary">{goal.title}</h3>
            <Badge text={goal.status} color={statusMap[goal.status]} size="sm" />
            {goal.type === 'Personal' && <Badge text="Personal" color="primary" size="sm" />}
          </div>
          <div className="text-xs text-text-secondary mt-1 flex items-center space-x-4">
            {assignee && (
              <div className="flex items-center space-x-1">
                <img src={`https://i.pravatar.cc/16?u=${assignee.id}`} alt={assignee.name} className="w-4 h-4 rounded-full"/>
                <span>{assignee.name}</span>
              </div>
            )}
            {assigner && <span>Assigned by {assigner.name}</span>}
          </div>
        </div>
        <div className="flex items-center space-x-1">
            <button onClick={onAddSubGoal} className="p-2 hover:bg-secondary rounded-full" title="Add Sub-goal">
                <PlusIcon className="w-4 h-4"/>
            </button>
            <button onClick={onEdit} className="p-2 hover:bg-secondary rounded-full" title="Edit Goal">
                <PencilIcon className="w-4 h-4" />
            </button>
            <button onClick={onUpdateProgress} className="flex items-center space-x-1 text-sm bg-accent text-white px-3 py-1.5 rounded-md hover:bg-accent-hover font-semibold">
                <ClipboardDocumentCheckIcon className="w-4 h-4"/>
                <span>Check-in</span>
            </button>
        </div>
      </div>

      <div className="mt-4 pl-5">
        <div className="divide-y divide-secondary">
          {goal.keyResults.map(kr => <KeyResultRow key={kr.id} kr={kr} />)}
        </div>
      </div>
      
      <div className="mt-4">
          <TimeProgressBar period={goal.period} goalProgress={goal.progress} />
      </div>

    </div>
  );
};