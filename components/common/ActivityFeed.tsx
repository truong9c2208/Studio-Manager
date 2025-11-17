import React from 'react';
import { Card } from './Card';

export interface ActivityItem {
    icon: React.ReactNode;
    color: string; // Tailwind bg color class
    text: React.ReactNode;
    time: string;
}

interface ActivityFeedProps {
    title: string;
    items: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ title, items }) => {
    return (
        <Card title={title}>
            <div className="space-y-4 -m-2 h-full">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-text-primary">{item.text}</div>
                            <p className="text-xs text-text-secondary mt-0.5">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
