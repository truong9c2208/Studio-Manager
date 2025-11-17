import React from 'react';
import type { IconProps } from './IconProps';

export const GitBranchIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3v4a2 2 0 002 2h4 M10 3v4a2 2 0 01-2 2H4m6 11v-4a2 2 0 00-2-2H4m6 11v-4a2 2 0 012-2h4m-6-4h.01" />
        <circle cx="4" cy="9" r="2" />
        <circle cx="10" cy="3" r="2" />
        <circle cx="10" cy="21" r="2" />
        <circle cx="18" cy="9" r="2" />
    </svg>
);
