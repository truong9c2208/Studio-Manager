import React from 'react';
import type { IconProps } from './IconProps';

export const BugIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-1.5 1.5M7 7l1.5 1.5M17 17l-1.5-1.5M7 17l1.5-1.5" />
    </svg>
);