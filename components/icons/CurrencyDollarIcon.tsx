import React from 'react';
import type { IconProps } from './IconProps';

export const CurrencyDollarIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v1m0-1v-.01M12 6a1 1 0 00-1 1v1h2V7a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v1h2v-1a1 1 0 00-1-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18" />
    </svg>
);