import React from 'react';
import type { IconProps } from './IconProps';

export const TargetIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 10-7.07 7.072m7.07-7.072l-2.122 2.122m-5.656 2.828l-2.475 2.475M12 18.75V21m-6.75-4.5H3m18 0h-2.25m-13.5-9H3m18 0h-2.25M12 5.25V3m0 18a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);