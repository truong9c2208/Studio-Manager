import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-accent h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
