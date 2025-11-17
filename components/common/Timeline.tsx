import React from 'react';
import type { ReactNode } from 'react';

interface TimelineItem {
    title: string;
    description: string;
    date: string;
    icon: ReactNode;
}

interface TimelineProps {
    items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div>
            <ol className="relative border-l border-secondary ml-4">                  
                {items.map((item, index) => (
                    <li key={index} className="mb-10 ml-8">            
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-secondary rounded-full -left-4 ring-4 ring-primary">
                            {item.icon}
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-text-primary">
                            {item.title}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-text-secondary">{item.date}</time>
                        <p className="mb-4 text-base font-normal text-text-secondary">{item.description}</p>
                    </li>
                ))}
            </ol>
        </div>
    );
};
