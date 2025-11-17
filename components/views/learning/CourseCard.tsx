import React from 'react';
import type { Course, LearningAssignment } from '../../../types';
import { Card } from '../../common/Card';
import { ProgressBar } from '../../common/ProgressBar';
import { StarIcon } from '../../icons/StarIcon';
import { Badge } from '../../common/Badge';

interface CourseCardProps {
    course: Course;
    assignment: LearningAssignment;
    onView: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, assignment, onView }) => {
    const youtubeId = course.youtubeUrl?.includes('embed/') 
        ? course.youtubeUrl.split('embed/')[1].split('?')[0] 
        : course.youtubeUrl?.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : 'https://via.placeholder.com/300x150?text=No+Video';

    return (
        <Card>
            <div className="flex flex-col h-full">
                <div className="relative">
                    <img src={thumbnailUrl} alt={course.name} className="w-full h-32 object-cover rounded-md"/>
                    {course.isRecommended && (
                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md">
                             <StarIcon className="w-5 h-5 text-yellow-500" />
                        </div>
                    )}
                </div>
                <div className="mt-4 flex-grow">
                    <h3 className="font-bold text-lg leading-tight">{course.name}</h3>
                    <div className="mt-2">
                        <Badge text={course.category} color="info" size="sm" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
                        <span>Progress</span>
                        <span>{assignment.progress || 0}%</span>
                    </div>
                    <ProgressBar progress={assignment.progress || 0} />
                </div>
                <button
                    onClick={onView}
                    className="w-full mt-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover font-semibold text-sm"
                >
                    {assignment.status === 'Completed' ? 'Review' : (assignment.progress || 0) > 0 ? 'Continue' : 'Start Course'}
                </button>
            </div>
        </Card>
    );
};
