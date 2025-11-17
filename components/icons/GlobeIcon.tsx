import React from 'react';
import type { IconProps } from './IconProps';

export const GlobeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9.3l.065.055a2 2 0 012.828 0l.065-.055m-4.243 4.242l.065.056a2 2 0 012.828 0l.065-.056m-5.657-5.657l.065.055a2 2 0 012.828 0l.065-.055M12 22a10 10 0 110-20 10 10 0 010 20z" />
    </svg>
);
