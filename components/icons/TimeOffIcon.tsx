import React from 'react';
import type { IconProps } from './IconProps';

export const TimeOffIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3.771-2.59 6.96-6.064 7.693a.75.75 0 00-.393-1.036z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 21h21M12 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 9c-2 0-2 2-2 2s0-2-2-2" />
    </svg>
);