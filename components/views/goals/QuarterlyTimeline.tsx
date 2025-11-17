import React from 'react';

interface QuarterlyTimelineProps {
  year: number;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onYearChange: (year: number) => void;
}

export const QuarterlyTimeline: React.FC<QuarterlyTimelineProps> = ({ year, selectedPeriod, onPeriodChange, onYearChange }) => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const annualPeriod = `Annual ${year}`;
  const quarterPeriods = quarters.map(q => `${q} ${year}`);

  const handlePeriodClick = (period: string) => {
      onPeriodChange(period);
  };

  return (
    <div className="bg-secondary p-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button onClick={() => onYearChange(year - 1)} className="p-1 rounded hover:bg-primary">&lt;</button>
        <span className="font-bold text-lg w-20 text-center">{year}</span>
        <button onClick={() => onYearChange(year + 1)} className="p-1 rounded hover:bg-primary">&gt;</button>
      </div>
      <div className="flex items-center space-x-2 p-1 bg-primary rounded-lg">
        {quarterPeriods.map(period => (
          <button
            key={period}
            onClick={() => handlePeriodClick(period)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              selectedPeriod === period ? 'bg-accent text-white shadow-sm' : 'hover:bg-secondary'
            }`}
          >
            {period.split(' ')[0]}
          </button>
        ))}
      </div>
      <button
        onClick={() => handlePeriodClick(annualPeriod)}
        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            selectedPeriod === annualPeriod ? 'bg-accent text-white shadow-sm' : 'bg-primary hover:bg-secondary'
        }`}
      >
        Annual
      </button>
    </div>
  );
};
