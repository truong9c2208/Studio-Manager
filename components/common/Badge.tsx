import React from 'react';

type BadgeColor = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'accent';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  text: string;
  color?: BadgeColor;
  size?: BadgeSize;
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'primary', size = 'md' }) => {
  const colorClasses: Record<BadgeColor, string> = {
    primary: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    accent: 'bg-indigo-100 text-indigo-800',
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        ${colorClasses[color]}
        ${sizeClasses[size]}
      `}
    >
      {text}
    </span>
  );
};
