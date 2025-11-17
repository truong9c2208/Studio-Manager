import React from 'react';
import type { IconProps } from './IconProps';

export const QrCodeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v-1.5m-3 1.5v-1.5m-3 1.5v-1.5m3-12v1.5m-3-1.5v1.5m-3-1.5v1.5M4 12h1M4 4h1v1H4V4zm2 2h1v1H6V6zm2 2h1v1H8V8zm2 2h1v1h-1v-1zm2 2h1v1h-1v-1zm2 2h1v1h-1v-1zm0-4h1v1h-1v-1zm0-4h1v1h-1V8zm-4 4h1v1H8v-1zm-4 4h1v1H4v-1zm8-8h1v1h-1V4zm4 4h1v1h-1V8zm0 4h1v1h-1v-1zm0 4h1v1h-1v-1zM6 4h1v1H6V4zm10 0h1v1h-1V4zM4 14h1v1H4v-1zm2 2h1v1H6v-1zm12-2h1v1h-1v-1z" />
    </svg>
);
