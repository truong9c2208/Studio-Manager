
import React from 'react';
import type { IconProps } from './IconProps';

export const LicencesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3a2 2 0 012 2M5 5a2 2 0 00-2 2v3a2 2 0 002 2M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2m-14 0h14a2 2 0 012 2v3a2 2 0 01-2 2M5 19a2 2 0 01-2-2v-3a2 2 0 012-2m14 0h-3l-4-4-4 4H5" />
    </svg>
);
