import React from 'react';

interface CardProps {
  title?: string;
  value?: string;
  change?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, value, change, children }) => {
  const isMetricCard = !!value;

  return (
    <div className="bg-[#1B3C53] p-6 rounded-lg shadow-md h-full flex flex-col">
      {title && (
        <div className={children && !isMetricCard ? "border-b border-primary pb-4 mb-4" : (isMetricCard ? "mb-2" : "")}>
          <h3 className="text-sm font-medium text-[#FFFFFF]">{title}</h3>
        </div>
      )}
      {isMetricCard && (
        <>
          <p className="text-3xl font-bold text-[#F2F2F2]">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </>
      )}
      {/* This wrapper allows the children to take up remaining vertical space */}
      {children && <div className="flex-grow min-h-0">{children}</div>}
    </div>
  );
};