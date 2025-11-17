import React from 'react';
import type { Employee, Course } from '../../../../types';
import { Card } from '../../../common/Card';
import { MostPopularCoursesChart } from './charts/MostPopularCoursesChart';
import { EmployeeEngagementTable } from './charts/EmployeeEngagementTable';

interface LearningDashboardViewProps {
  allEmployees: Employee[];
  courses: Course[];
}

export const LearningDashboardView: React.FC<LearningDashboardViewProps> = ({ allEmployees, courses }) => {
    const stats = React.useMemo(() => {
        const allAssignments = allEmployees.flatMap(e => e.learningPaths);
        const totalEnrollments = allAssignments.length;
        const completedEnrollments = allAssignments.filter(a => a.status === 'Completed').length;
        const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

        return {
            totalCourses: courses.length,
            totalEnrollments,
            completionRate,
        };
    }, [allEmployees, courses]);

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Courses" value={stats.totalCourses.toString()} />
                <Card title="Total Enrollments" value={stats.totalEnrollments.toString()} />
                <Card title="Overall Completion Rate" value={`${stats.completionRate.toFixed(1)}%`} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MostPopularCoursesChart courses={courses} allEmployees={allEmployees} />
                <EmployeeEngagementTable allEmployees={allEmployees} />
            </section>
        </div>
    );
};
