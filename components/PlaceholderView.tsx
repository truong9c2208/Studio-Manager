
import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="p-8 flex items-center justify-center h-[calc(100vh-150px)]">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-500">{title}</h2>
        <p className="mt-2 text-gray-600">This feature is currently under construction.</p>
        <div className="mt-8 w-32 h-32 mx-auto border-4 border-dashed border-secondary rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
