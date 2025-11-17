import React, { useState, useMemo } from 'react';
import type { Employee, Course, LearningAssignment } from '../../../types';
import { Card } from '../../common/Card';
import { BookOpenIcon } from '../../icons/BookOpenIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { CourseModal } from '../learning/CourseModal';
import { Table, type Column } from '../../common/Table';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { CourseCard } from '../learning/CourseCard';
import { CourseLibraryModal } from '../learning/CourseLibraryModal';
import { LearningDashboardView } from '../learning/admin/LearningDashboardView';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import { ClipboardListIcon } from '../../icons/ClipboardListIcon';

interface LearningViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  courses: Course[];
  isAdmin: boolean;
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onSaveEmployee: (employee: Employee) => void;
  onViewCourse: (data: { course: Course, assignment: LearningAssignment }) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ currentUser, allEmployees, courses, isAdmin, onSaveCourse, onDeleteCourse, onSaveEmployee, onViewCourse }) => {
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [adminTab, setAdminTab] = useState<'dashboard' | 'manage'>('dashboard');

    const handleNewCourse = () => {
        setEditingCourse(null);
        setIsCourseModalOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setIsCourseModalOpen(true);
    };

    const handleDelete = (courseId: string) => {
        if (window.confirm("Are you sure you want to delete this course? All employee assignments for it will be removed.")) {
            onDeleteCourse(courseId);
        }
    }

    const handleEnroll = (courseId: string) => {
        const newAssignment: LearningAssignment = {
            courseId: courseId,
            status: 'Not Started',
            assignedDate: new Date().toISOString().split('T')[0],
            progress: 0,
        };
        const updatedUser = {
            ...currentUser,
            learningPaths: [...currentUser.learningPaths, newAssignment],
        };
        onSaveEmployee(updatedUser);
        setIsLibraryModalOpen(false); // Close modal after enrolling
    };

    const myAssignedCourses = useMemo(() => {
        return currentUser.learningPaths.map(assignment => {
            const courseDetails = courses.find(c => c.id === assignment.courseId);
            return { assignment, course: courseDetails };
        }).filter((item): item is { assignment: LearningAssignment; course: Course } => !!item.course);
    }, [currentUser.learningPaths, courses]);
    
    const userLearningStats = useMemo(() => ({
        completed: myAssignedCourses.filter(c => c.assignment.status === 'Completed').length,
        inProgress: myAssignedCourses.filter(c => c.assignment.status === 'In Progress').length,
        notStarted: myAssignedCourses.filter(c => c.assignment.status === 'Not Started').length,
    }), [myAssignedCourses]);

    const courseColumns: Column<Course>[] = [
        { header: 'Course Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'Duration', accessor: 'duration' },
        {
            header: 'Actions',
            accessor: 'id',
            sortable: false,
            cell: (course) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEditCourse(course)} className="p-1 hover:bg-slate-200 rounded"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(course.id)} className="p-1 hover:bg-slate-200 rounded text-danger"><TrashIcon className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    if (isAdmin) {
        return (
            <>
                <div className="p-8 space-y-6">
                    <h1 className="text-3xl font-bold">Learning & Development</h1>
                    <div className="border-b border-secondary">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setAdminTab('dashboard')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${adminTab === 'dashboard' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                                <ChartBarIcon className="w-5 h-5"/>
                                <span>Dashboard</span>
                            </button>
                            <button onClick={() => setAdminTab('manage')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${adminTab === 'manage' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                                <ClipboardListIcon className="w-5 h-5"/>
                                <span>Manage Courses</span>
                            </button>
                        </nav>
                    </div>

                    {adminTab === 'dashboard' && <LearningDashboardView allEmployees={allEmployees} courses={courses} />}

                    {adminTab === 'manage' && (
                        <Card>
                            <div className="flex justify-end mb-4 -mt-2">
                                <button onClick={handleNewCourse} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>New Course</span>
                                </button>
                            </div>
                            <div className="-m-6">
                                <Table columns={courseColumns} data={courses} />
                            </div>
                        </Card>
                    )}
                </div>
                <CourseModal
                    isOpen={isCourseModalOpen}
                    onClose={() => setIsCourseModalOpen(false)}
                    onSave={onSaveCourse}
                    course={editingCourse}
                />
            </>
        );
    }

    return (
        <>
            <div className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Learning Path</h1>
                    <button onClick={() => setIsLibraryModalOpen(true)} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                        <BookOpenIcon className="w-5 h-5" />
                        <span>Browse Course Library</span>
                    </button>
                </div>
                
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Completed" value={String(userLearningStats.completed)} />
                    <Card title="In Progress" value={String(userLearningStats.inProgress)} />
                    <Card title="Not Started" value={String(userLearningStats.notStarted)} />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAssignedCourses.map(({ course, assignment }) => (
                        <CourseCard key={course.id} course={course} assignment={assignment} onView={() => onViewCourse({ course, assignment })} />
                    ))}
                </div>
                {myAssignedCourses.length === 0 && (
                    <div className="text-center py-16 text-text-secondary bg-secondary rounded-lg">
                        <BookOpenIcon className="w-12 h-12 mx-auto text-slate-400" />
                        <h3 className="mt-2 text-lg font-semibold">No Courses Enrolled</h3>
                        <p>Click 'Browse Course Library' to find and enroll in new courses.</p>
                    </div>
                )}
            </div>
            <CourseLibraryModal
                isOpen={isLibraryModalOpen}
                onClose={() => setIsLibraryModalOpen(false)}
                courses={courses}
                currentUser={currentUser}
                onEnroll={handleEnroll}
            />
        </>
    );
};