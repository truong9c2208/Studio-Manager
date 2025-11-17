import React, { useMemo } from 'react';
import type { Course, Employee } from '../../../../../types';
import { Card } from '../../../../common/Card';

interface MostPopularCoursesChartProps {
  courses: Course[];
  allEmployees: Employee[];
}

export const MostPopularCoursesChart: React.FC<MostPopularCoursesChartProps> = ({ courses, allEmployees }) => {
    const enrollmentData = useMemo(() => {
        const counts = new Map<string, number>();
        allEmployees.flatMap(e => e.learningPaths).forEach(lp => {
            counts.set(lp.courseId, (counts.get(lp.courseId) || 0) + 1);
        });

        return courses
            .map(course => ({
                name: course.name,
                enrollments: counts.get(course.id) || 0,
            }))
            .filter(c => c.enrollments > 0)
            .sort((a, b) => b.enrollments - a.enrollments)
            .slice(0, 7); // Show top 7
    }, [courses, allEmployees]);

    const maxEnrollments = Math.max(...enrollmentData.map(c => c.enrollments), 1);

    return (
        <Card title="Most Popular Courses">
            <div className="space-y-4 pt-2 h-64 overflow-y-auto">
                {enrollmentData.map(course => (
                    <div key={course.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-text-primary truncate" title={course.name}>{course.name}</span>
                            <span className="text-text-secondary">{course.enrollments} enrollments</span>
                        </div>
                        <div className="w-full bg-primary rounded-full h-3 relative overflow-hidden border border-secondary">
                            <div 
                                className="h-3 rounded-full bg-accent"
                                style={{ width: `${(course.enrollments / maxEnrollments) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
