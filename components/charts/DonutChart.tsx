import React from 'react';
import { Card } from '../common/Card';

export const DonutChart = () => {
  return (
    <Card title="Project Status">
        <div className="flex items-center justify-center relative h-64">
            <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#374151" strokeWidth="12" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset="101.787" /> 
                <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset="203.575" transform="rotate(108 60 60)" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset="271.433" transform="rotate(216 60 60)" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">12</span>
                <span className="text-text-secondary">Projects</span>
            </div>
        </div>
         <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-info mr-2"></span>
                    <span>In Progress</span>
                </div>
                <span className="font-semibold">4</span>
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-success mr-2"></span>
                    <span>Completed</span>
                </div>
                <span className="font-semibold">6</span>
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-warning mr-2"></span>
                    <span>On Hold</span>
                </div>
                <span className="font-semibold">2</span>
            </div>
        </div>
    </Card>
  );
};
