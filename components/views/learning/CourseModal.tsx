import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../common/Modal';
import type { Course, QuizQuestion } from '../../../types';
import { TrashIcon } from '../../icons/TrashIcon';
import { PlusIcon } from '../../icons/PlusIcon';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (course: Course) => void;
    course: Course | null;
}

const getEmptyCourse = (): Omit<Course, 'id'> => ({
    name: '',
    category: 'Development',
    duration: '',
    link: '#', // Default link, youtubeUrl is more important
    description: '',
    youtubeUrl: '',
    isRecommended: false,
    outcomes: [],
    quiz: [],
});

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
    const [formData, setFormData] = useState(getEmptyCourse());
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(course ? { ...course, outcomes: course.outcomes || [], quiz: course.quiz || [] } : getEmptyCourse());
        }
    }, [course, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleOutcomesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, outcomes: e.target.value.split('\n')}));
    };
    
    const handleQuizChange = (qIndex: number, field: keyof QuizQuestion, value: any) => {
        const newQuiz = [...(formData.quiz || [])];
        // @ts-ignore
        newQuiz[qIndex][field] = value;
        setFormData(prev => ({...prev, quiz: newQuiz}));
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuiz = [...(formData.quiz || [])];
        newQuiz[qIndex].options[oIndex] = value;
        setFormData(prev => ({...prev, quiz: newQuiz}));
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestion = { id: `Q-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswerIndex: 0 };
        setFormData(prev => ({ ...prev, quiz: [...(prev.quiz || []), newQuestion] }));
    };

    const removeQuestion = (qIndex: number) => {
        setFormData(prev => ({...prev, quiz: formData.quiz?.filter((_, i) => i !== qIndex)}));
    };

    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const newQuestions: QuizQuestion[] = lines.map((line, index) => {
                const parts = line.split(',').map(p => p.trim());
                if (parts.length < 6) return null; // question, option A, B, C, D, correct answer
                const [question, a, b, c, d, correct] = parts;
                const correctChar = correct.toUpperCase();
                const correctIndex = correctChar === 'A' ? 0 : correctChar === 'B' ? 1 : correctChar === 'C' ? 2 : 3;

                return {
                    id: `Q-CSV-${Date.now()}-${index}`,
                    question,
                    options: [a,b,c,d],
                    correctAnswerIndex: correctIndex
                };
            }).filter((q): q is QuizQuestion => q !== null);

            setFormData(prev => ({...prev, quiz: [...(prev.quiz || []), ...newQuestions]}));
        };
        reader.readAsText(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const courseToSave: Course = {
            ...formData,
            id: course?.id || `COURSE-${Date.now()}`,
            outcomes: formData.outcomes?.filter(o => o.trim() !== ''), // Clean up empty lines
        };
        onSave(courseToSave);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Edit Course' : 'Add New Course'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Course Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="YouTube URL" name="youtubeUrl" type="url" value={formData.youtubeUrl || ''} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." />
                </div>
                <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="Category" name="category" value={formData.category} onChange={handleChange}>
                        <option>Development</option><option>Design</option><option>Management</option><option>Communication</option>
                    </SelectField>
                    <InputField label="Duration (e.g., 8 hours)" name="duration" value={formData.duration} onChange={handleChange} required />
                    <div className="flex items-center pt-6">
                        <input type="checkbox" id="isRecommended" name="isRecommended" checked={formData.isRecommended} onChange={handleChange} className="h-4 w-4 text-accent border-gray-300 rounded"/>
                        <label htmlFor="isRecommended" className="ml-2 block text-sm font-medium text-text-primary">Recommended Course</label>
                    </div>
                </div>

                <TextAreaField label="Learning Outcomes (one per line)" value={formData.outcomes?.join('\n')} onChange={handleOutcomesChange} />

                <div className="border-t pt-4">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Quiz Questions</h3>
                        <div>
                             <input type="file" accept=".csv" onChange={handleCsvUpload} ref={fileInputRef} className="hidden" />
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-accent hover:underline mr-4">Upload from CSV</button>
                             <button type="button" onClick={addQuestion} className="flex items-center space-x-1 text-sm bg-secondary px-3 py-1.5 rounded-md hover:bg-primary"><PlusIcon className="w-4 h-4"/><span>Add Question</span></button>
                        </div>
                     </div>
                     <p className="text-xs text-text-secondary mb-2">CSV format: question,optionA,optionB,optionC,optionD,correctAnswerLetter (e.g., A, B, C, or D)</p>
                     <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-secondary rounded-md">
                        {(formData.quiz || []).map((q, qIndex) => (
                            <div key={q.id} className="bg-primary p-3 rounded-md relative">
                                <label className="text-xs font-semibold">Question {qIndex + 1}</label>
                                <input type="text" value={q.question} onChange={e => handleQuizChange(qIndex, 'question', e.target.value)} className="w-full p-1 text-sm border-secondary rounded mt-1 bg-white text-text-primary" />
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {q.options.map((opt, oIndex) => (
                                         <input key={oIndex} type="text" value={opt} placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full p-1 text-sm border-secondary rounded bg-white text-text-primary" />
                                    ))}
                                </div>
                                <label className="text-xs font-semibold mt-2 block">Correct Answer</label>
                                <select value={q.correctAnswerIndex} onChange={e => handleQuizChange(qIndex, 'correctAnswerIndex', Number(e.target.value))} className="p-1 text-sm border-secondary rounded mt-1">
                                    <option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option>
                                </select>
                                <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-2 right-2 p-1 text-text-secondary hover:text-danger"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Course</button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (<div><label className="block text-sm font-medium text-text-secondary">{label}</label><input {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" /></div>);
const TextAreaField: React.FC<any> = ({ label, ...props }) => (<div><label className="block text-sm font-medium text-text-secondary">{label}</label><textarea {...props} rows={3} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" /></div>);
const SelectField: React.FC<any> = ({ label, children, ...props }) => (<div><label className="block text-sm font-medium text-text-secondary">{label}</label><select {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">{children}</select></div>);
