import React from 'react';
import { Card } from '../../common/Card';
import { Timeline } from '../../common/Timeline';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';

export const ProjectTimeline: React.FC = () => {
    const timelineItems = [
        {
            title: "Project Kick-off",
            description: "Initial meeting with stakeholders.",
            date: "July 1, 2024",
            icon: <CheckCircleIcon className="w-4 h-4 text-accent" />
        },
        {
            title: "Design Phase Completed",
            description: "UI/UX mockups approved.",
            date: "July 15, 2024",
            icon: <CheckCircleIcon className="w-4 h-4 text-accent" />
        }
    ];

    return (
        <Card title="Project Timeline">
            <Timeline items={timelineItems} />
        </Card>
    );
}
