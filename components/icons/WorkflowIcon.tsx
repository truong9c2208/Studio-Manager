import React from 'react';
import type { IconProps } from './IconProps';

export const WorkflowIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14-4a2 2 0 00-2-2H7a2 2 0 00-2 2m14 0l-2 4m-2-4l2 4m-6-4v4m0 0l-2-4m2 4l2-4" />
    </svg>
);