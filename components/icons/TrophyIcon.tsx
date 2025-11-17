import React from 'react';
import type { IconProps } from './IconProps';

export const TrophyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 106.364 6.364l4.5-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);