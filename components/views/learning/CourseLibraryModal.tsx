import React, { useState, useMemo } from 'react';
import type { Course, Employee } from '../../../types';
import { Modal } from '../../common/Modal';
import { SearchIcon } from '../../icons/SearchIcon';
import { StarIcon } from '../../icons/StarIcon';
import { Badge } from '../../common/Badge';

interface CourseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  currentUser: Employee;
  onEnroll: (courseId: string) => void;
}

const LibraryCourseCard: React.FC<{ course: Course, isEnrolled: boolean, onEnroll: (id: string) => void }> = ({ course, isEnrolled, onEnroll }) => {
    const youtubeId = course.youtubeUrl?.includes('embed/') 
        ? course.youtubeUrl.split('embed/')[1].split('?')[0] 
        : course.youtubeUrl?.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : 'https://via.placeholder.com/300x150?text=No+Preview';

    return (
        <div className="bg-secondary rounded-lg p-3 flex flex-col justify-between border border-transparent hover:border-accent transition-colors">
            <div>
                <div className="relative mb-2">
                    <img src={thumbnailUrl} alt={course.name} className="w-full h-24 object-cover rounded"/>
                    {course.isRecommended && <div className="absolute top-1 right-1 bg-white/70 backdrop-blur-sm p-1 rounded-full"><StarIcon className="w-4 h-4 text-yellow-500" /></div>}
                </div>
                <h3 className="font-bold text-md leading-tight">{course.name}</h3>
                <div className="mt-1">
                    <Badge text={course.category} color="info" size="sm" />
                </div>
                <p className="text-xs text-text-secondary mt-1 h-10 overflow-hidden">{course.description}</p>
            </div>
            <div className="mt-2">
                {isEnrolled ? (
                    <button disabled className="w-full py-1.5 bg-slate-300 text-slate-500 rounded-md font-semibold text-sm cursor-not-allowed">
                        Enrolled
                    </button>
                ) : (
                    <button onClick={() => onEnroll(course.id)} className="w-full py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover font-semibold text-sm">
                        Enroll
                    </button>
                )}
            </div>
        </div>
    );
};

export const CourseLibraryModal: React.FC<CourseLibraryModalProps> = ({ isOpen, onClose, courses, currentUser, onEnroll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  const enrolledCourseIds = useMemo(() => currentUser.learningPaths.map(lp => lp.courseId), [currentUser]);

  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category);
    });
  }, [courses, searchTerm, sortBy]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Library" size="xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="relative w-full sm:w-2/3">
                <input
                    type="search"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 bg-primary border border-secondary rounded-md"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-secondary">Sort by:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'category')} className="text-sm bg-primary border-secondary rounded-md p-2">
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2 -m-2">
            {filteredAndSortedCourses.map(course => (
                <LibraryCourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={enrolledCourseIds.includes(course.id)}
                    onEnroll={onEnroll}
                />
            ))}
        </div>
    </Modal>
  );
};
