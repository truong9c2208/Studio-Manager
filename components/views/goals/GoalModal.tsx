import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../common/Modal';
import type { Goal, Employee, Department, KeyResult } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'status' | 'progress'>) => void;
  goal: Goal | null;
  parentGoal: Goal | null;
  assignableEmployees: Employee[];
  currentUser: Employee;
  isAdmin: boolean;
  departments: Department[];
  selectedPeriod: string;
}

const getEmptyGoal = (currentUser: Employee, period: string): Omit<Goal, 'id' | 'status' | 'progress'> => ({
  employeeId: currentUser.id,
  assignerId: null,
  parentGoalId: null,
  title: '',
  period: period as Goal['period'],
  type: 'Objective',
  keyResults: [{ id: `KR-${Date.now()}`, description: '', targetValue: 100, currentValue: 0, unit: '%' }],
});

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, goal, parentGoal, assignableEmployees, currentUser, isAdmin, departments, selectedPeriod }) => {
  const [formData, setFormData] = useState(getEmptyGoal(currentUser, selectedPeriod));
  const [assignTo, setAssignTo] = useState<'person' | 'department'>('person');

  useEffect(() => {
    if (goal) {
      setFormData(goal);
      if (goal.departmentId) setAssignTo('department');
      else setAssignTo('person');
    } else if (parentGoal) {
      const newGoal = getEmptyGoal(currentUser, parentGoal.period);
      newGoal.parentGoalId = parentGoal.id;
      newGoal.employeeId = ''; // Default to unassigned for sub-goals
      setFormData(newGoal);
      setAssignTo('person');
    } else {
      const newGoal = getEmptyGoal(currentUser, selectedPeriod);
      if (isAdmin) {
          newGoal.employeeId = undefined; // Unset it for admins creating top-level goals
      }
      setFormData(newGoal);
      setAssignTo(isAdmin ? 'department' : 'person');
    }
  }, [goal, parentGoal, isOpen, currentUser, selectedPeriod, isAdmin]);

  const managedDepartments = useMemo(() => {
    if (isAdmin) return departments;
    return departments.filter(d => d.managerId === currentUser.id);
  }, [departments, isAdmin, currentUser.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKrChange = (index: number, field: keyof Omit<KeyResult, 'id'>, value: string | number) => {
    const newKrs = [...formData.keyResults];
    // @ts-ignore
    newKrs[index][field] = value;
    setFormData(prev => ({ ...prev, keyResults: newKrs }));
  };

  const addKr = () => {
    const newKr: KeyResult = { id: `KR-${Date.now()}`, description: '', targetValue: 100, currentValue: 0, unit: '%' };
    setFormData(prev => ({ ...prev, keyResults: [...prev.keyResults, newKr] }));
  };
  
  const removeKr = (id: string) => {
    if (formData.keyResults.length > 1) {
      setFormData(prev => ({ ...prev, keyResults: prev.keyResults.filter(kr => kr.id !== id) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (assignTo === 'person') {
        dataToSave.departmentId = undefined;
    } else {
        dataToSave.employeeId = undefined;
    }
    onSave(dataToSave);
  };
  
  const isSubGoal = !!parentGoal;
  const isTopLevelObjective = !parentGoal && !goal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goal ? 'Edit Objective' : (parentGoal ? 'Add Sub-goal' : 'New Objective')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Objective / Goal Title" name="title" value={formData.title} onChange={handleChange} required />
        
        {isTopLevelObjective && (
            <div className="p-3 bg-secondary rounded-md">
                <label className="block text-sm font-medium text-text-secondary mb-2">Assign To</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center"><input type="radio" name="assignTo" value="department" checked={assignTo === 'department'} onChange={() => setAssignTo('department')} className="mr-2"/> A Department</label>
                    <label className="flex items-center"><input type="radio" name="assignTo" value="person" checked={assignTo === 'person'} onChange={() => setAssignTo('person')} className="mr-2"/> A Person</label>
                </div>
                 {assignTo === 'department' && (
                    <SelectField name="departmentId" value={formData.departmentId || ''} onChange={handleChange} required className="mt-2">
                        <option value="" disabled>Select a department</option>
                        {managedDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </SelectField>
                )}
                {assignTo === 'person' && (
                    <SelectField name="employeeId" value={formData.employeeId || ''} onChange={handleChange} required className="mt-2">
                        <option value="" disabled>Select an employee</option>
                        {assignableEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </SelectField>
                )}
            </div>
        )}

        {isSubGoal && (
             <SelectField label="Assignee" name="employeeId" value={formData.employeeId || ''} onChange={handleChange} required>
                <option value="" disabled>Select an employee</option>
                {assignableEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </SelectField>
        )}

        <div>
            <h3 className="text-md font-semibold mb-2">Key Results</h3>
            <div className="space-y-3">
                {formData.keyResults.map((kr, index) => (
                    <div key={kr.id} className="p-3 bg-secondary rounded-md grid grid-cols-12 gap-2 items-end relative">
                        <div className="col-span-12 sm:col-span-6"><InputField label="Description" value={kr.description} onChange={(e: any) => handleKrChange(index, 'description', e.target.value)} /></div>
                        <div className="col-span-4 sm:col-span-2"><InputField label="Target" type="number" value={kr.targetValue} onChange={(e: any) => handleKrChange(index, 'targetValue', Number(e.target.value))} /></div>
                        <div className="col-span-4 sm:col-span-2"><InputField label="Unit" value={kr.unit} onChange={(e: any) => handleKrChange(index, 'unit', e.target.value)} placeholder="e.g. %, $, tasks"/></div>
                        <div className="col-span-4 sm:col-span-2"><SelectField label="Direction" value={kr.targetDirection || 'increase'} onChange={(e: any) => handleKrChange(index, 'targetDirection', e.target.value)}><option value="increase">Increase</option><option value="decrease">Decrease</option></SelectField></div>
                        {formData.keyResults.length > 1 && <button type="button" onClick={() => removeKr(kr.id)} className="absolute top-1 right-1 p-1 text-text-secondary hover:text-danger"><TrashIcon className="w-4 h-4" /></button>}
                    </div>
                ))}
            </div>
            <button type="button" onClick={addKr} className="flex items-center space-x-1 text-sm text-accent hover:underline mt-2">
                <PlusIcon className="w-4 h-4" />
                <span>Add Key Result</span>
            </button>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Objective</button>
        </div>
      </form>
    </Modal>
  );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-text-secondary">{label}</label>
        <input {...props} className="w-full mt-1 p-2 text-sm bg-primary border border-secondary rounded-md" />
    </div>
);
const SelectField: React.FC<any> = ({ label, children, ...props }) => (
    <div>
        {label && <label className="block text-xs font-medium text-text-secondary">{label}</label>}
        <select {...props} className="w-full mt-1 p-2 text-sm bg-primary border border-secondary rounded-md">
            {children}
        </select>
    </div>
);
