import React, { useState } from 'react';
import type { Employee, TimeOffRequest } from '../../../types';
import { Card } from '../../common/Card';
import { Table, type Column } from '../../common/Table';
import { Badge } from '../../common/Badge';

interface TimeOffTabViewProps {
  employee: Employee;
  onSaveRequest: (request: Omit<TimeOffRequest, 'id'>) => void;
}

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-primary p-4 rounded-lg shadow-sm border border-secondary">
    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-text-primary mt-1">{value} <span className="text-lg">days</span></p>
  </div>
);

export const TimeOffTabView: React.FC<TimeOffTabViewProps> = ({ employee, onSaveRequest }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'Vacation' as TimeOffRequest['type'],
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.startDate && formData.endDate) {
      onSaveRequest({ ...formData, status: 'Pending' });
      // Reset form
      setFormData({ startDate: '', endDate: '', type: 'Vacation', reason: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns: Column<TimeOffRequest>[] = [
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => {
        const colorMap = {
          Pending: 'warning',
          Approved: 'success',
          Rejected: 'danger',
        } as const;
        return <Badge text={item.status} color={colorMap[item.status]} size="sm" />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Annual Leave" value={employee.leaveBalances.annual} />
        <StatCard title="Sick Leave" value={employee.leaveBalances.sick} />
        <StatCard title="Personal Days" value={employee.leaveBalances.personal} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Request Time Off">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary">Start Date</label>
                  <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary">End Date</label>
                  <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-secondary">Leave Type</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
                  <option>Vacation</option>
                  <option>Sick Leave</option>
                  <option>Personal</option>
                </select>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">Reason (Optional)</label>
                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={3} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover font-semibold">
                Submit Request
              </button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Request History">
            <div className="-m-6">
                <Table columns={columns} data={employee.timeOffRequests} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};