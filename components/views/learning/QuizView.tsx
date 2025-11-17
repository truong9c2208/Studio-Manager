import React, { useState, useMemo } from 'react';
import type { QuizQuestion, LearningAssignment } from '../../../types';
import { Badge } from '../../common/Badge';

interface QuizViewProps {
    questions: QuizQuestion[];
    assignment: LearningAssignment;
    onUpdateAssignment: (assignment: LearningAssignment) => void;
    onQuizComplete: (correctAnswers: number, totalQuestions: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, assignment, onUpdateAssignment, onQuizComplete }) => {
    const [currentAnswers, setCurrentAnswers] = useState<{ [key: string]: number }>(assignment.quizAnswers || {});
    const [submitted, setSubmitted] = useState(Object.keys(assignment.quizAnswers || {}).length === questions.length);

    const score = useMemo(() => {
        if (!submitted) return null;
        const correct = questions.reduce((count, q) => {
            return currentAnswers[q.id] === q.correctAnswerIndex ? count + 1 : count;
        }, 0);
        return { correct, total: questions.length };
    }, [submitted, currentAnswers, questions]);

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        if (submitted) return;
        setCurrentAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = () => {
        const updatedAssignment = { ...assignment, quizAnswers: currentAnswers };
        onUpdateAssignment(updatedAssignment);
        setSubmitted(true);
        const correct = questions.reduce((count, q) => {
            return currentAnswers[q.id] === q.correctAnswerIndex ? count + 1 : count;
        }, 0);
        onQuizComplete(correct, questions.length);
    };

    const handleRetake = () => {
        setCurrentAnswers({});
        setSubmitted(false);
        onUpdateAssignment({ ...assignment, quizAnswers: {} });
    };

    return (
        <div className="space-y-6">
            {questions.map((q, qIndex) => (
                <div key={q.id}>
                    <p className="font-semibold">{qIndex + 1}. {q.question}</p>
                    <div className="mt-2 space-y-2">
                        {q.options.map((option, oIndex) => {
                            const isSelected = currentAnswers[q.id] === oIndex;
                            const isCorrect = q.correctAnswerIndex === oIndex;

                            let optionClass = 'bg-primary hover:bg-secondary';
                            if (submitted) {
                                if (isCorrect) {
                                    optionClass = 'bg-green-100 border-green-500';
                                } else if (isSelected && !isCorrect) {
                                    optionClass = 'bg-red-100 border-red-500';
                                }
                            } else if (isSelected) {
                                optionClass = 'bg-indigo-100 border-accent';
                            }

                            return (
                                <button
                                    key={oIndex}
                                    onClick={() => handleAnswerSelect(q.id, oIndex)}
                                    disabled={submitted}
                                    className={`w-full text-left p-3 rounded-md border-2 transition-colors ${optionClass} ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <span className={`font-mono mr-3 font-semibold ${isSelected ? 'text-accent' : ''}`}>{String.fromCharCode(65 + oIndex)}</span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div className="mt-6 pt-4 border-t border-secondary">
                {submitted ? (
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-bold">
                            Your Score: <span className={score && score.correct >= score.total/2 ? 'text-success' : 'text-danger'}>{score?.correct} / {score?.total}</span>
                        </div>
                        <button onClick={handleRetake} className="px-4 py-2 bg-secondary rounded-md font-semibold text-sm hover:bg-primary">
                            Retake Quiz
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(currentAnswers).length !== questions.length}
                        className="w-full px-4 py-2 bg-accent text-white rounded-md font-semibold disabled:bg-gray-400"
                    >
                        Submit Answers
                    </button>
                )}
            </div>
        </div>
    );
};
