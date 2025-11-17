import React from 'react';
import type { IconProps } from './IconProps';

export const TableIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M4 6h16M4 14h16M4 18h16" />
    </svg>
);
