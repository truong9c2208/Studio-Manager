import React from 'react';
import type { Course, LearningAssignment, QuizResult } from '../../../types';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { StarIcon } from '../../icons/StarIcon';
import { QuizView } from './QuizView';

interface CourseDetailViewProps {
    course: Course;
    assignment: LearningAssignment;
    onBack: () => void;
    onUpdateAssignment: (assignment: LearningAssignment) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, assignment, onBack, onUpdateAssignment }) => {

    const handleQuizComplete = (correctAnswers: number, totalQuestions: number) => {
        const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 100;
        // Simple logic: if you pass the quiz (or there's no quiz), you complete the course.
        const newStatus = score >= 60 ? 'Completed' : assignment.status;
        const newProgress = 100; // Completing the quiz means 100% progress on the learning part

        const newHistoryEntry: QuizResult = {
            score: correctAnswers,
            total: totalQuestions,
            date: new Date().toISOString(),
        };

        const updatedAssignment: LearningAssignment = {
            ...assignment,
            status: newStatus,
            progress: newProgress,
            quizHistory: [...(assignment.quizHistory || []), newHistoryEntry],
        };
        onUpdateAssignment(updatedAssignment);
    };
    
    const handleMarkComplete = () => {
        onUpdateAssignment({
          ...assignment,
          status: 'Completed',
          progress: 100,
        });
    };


    // If there's a video, mark as in progress immediately on view.
    React.useEffect(() => {
        if (assignment.status === 'Not Started' && course.youtubeUrl) {
            onUpdateAssignment({ ...assignment, status: 'In Progress', progress: Math.max(5, assignment.progress || 0) });
        }
    }, [assignment.status, course.youtubeUrl]);

    const youtubeId = course.youtubeUrl?.includes('embed/')
        ? course.youtubeUrl.split('embed/')[1].split('?')[0]
        : course.youtubeUrl?.split('v=')[1]?.split('&')[0];
    
    const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '';

    return (
        <div className="p-8 space-y-6">
            <header>
                <button onClick={onBack} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>Back to Learning</span>
                </button>
                <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">{course.name}</h1>
                    {course.isRecommended && <StarIcon className="w-6 h-6 text-yellow-500" />}
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-text-secondary">
                    <Badge text={course.category} color="info" />
                    <span>Duration: {course.duration}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {embedUrl ? (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                title={course.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="p-8 bg-secondary rounded-lg text-center text-text-secondary">
                            <p>No video content for this course.</p>
                        </div>
                    )}
                    <Card title="Course Description">
                        <p>{course.description}</p>
                    </Card>

                    {course.quiz && course.quiz.length > 0 && (
                        <Card title="Knowledge Check">
                            <QuizView
                                questions={course.quiz}
                                assignment={assignment}
                                onUpdateAssignment={onUpdateAssignment}
                                onQuizComplete={handleQuizComplete}
                            />
                        </Card>
                    )}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Learning Outcomes">
                        <ul className="space-y-3">
                            {(course.outcomes || []).map((outcome, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {course.quiz && course.quiz.length > 0 && assignment.quizHistory && assignment.quizHistory.length > 0 && (
                        <Card title="Quiz History">
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {assignment.quizHistory.slice().reverse().map((result, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-primary rounded-md">
                                        <div>
                                            <p className="font-semibold text-sm">Attempt {assignment.quizHistory!.length - index}</p>
                                            <p className="text-xs text-text-secondary">{new Date(result.date).toLocaleString()}</p>
                                        </div>
                                        <p className="font-bold text-lg">{result.score}/{result.total}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {(!course.quiz || course.quiz.length === 0) && assignment.status !== 'Completed' && (
                        <button 
                            onClick={handleMarkComplete} 
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-white rounded-md hover:bg-accent-hover font-semibold"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Mark as Complete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};