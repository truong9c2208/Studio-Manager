import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../common/Modal';
import type { Task, Employee, Project, Comment, Document, Subtask } from '../../../types';
import { CalendarIcon } from '../../icons/CalendarIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { PaperclipIcon } from '../../icons/PaperclipIcon';
import { AtSymbolIcon } from '../../icons/AtSymbolIcon';
import { mockEmployees } from '../../../data/mockData';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import { ClipboardListIcon } from '../../icons/ClipboardListIcon';

const ContentRenderer: React.FC<{ text: string, project: Project }> = ({ text, project }) => {
    const employeeNames = mockEmployees.map(e => e.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    const combinedRegex = new RegExp(`(@(?:${employeeNames}))(?![\\w])|\\[doc:(DOC-\\d+)\\]`, 'g');
    
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
        // Add the text before the match
        if (match.index > lastIndex) {
            tokens.push(text.substring(lastIndex, match.index));
        }

        const [fullMatch, mention, docId] = match;
        const mentionName = mention?.substring(1);

        if (mentionName && mockEmployees.some(e => e.name === mentionName)) {
            tokens.push({ type: 'mention', value: mentionName });
        } else if (docId) {
            tokens.push({ type: 'doc', value: docId });
        } else {
             tokens.push(fullMatch); // Not a valid mention, treat as plain text
        }
        
        lastIndex = combinedRegex.lastIndex;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
        tokens.push(text.substring(lastIndex));
    }

    return (
        <React.Fragment>
            {tokens.map((token, i) => {
                if (typeof token === 'string') {
                    return <React.Fragment key={i}>{token}</React.Fragment>;
                }
                if (token.type === 'mention') {
                    return <span key={i} className="font-semibold text-accent">@{token.value}</span>;
                }
                if (token.type === 'doc') {
                    const doc = project.documents?.find(d => d.id === token.value);
                    return doc ? (
                         <a href={doc.link} key={i} className="inline-flex items-center bg-indigo-100 text-accent font-medium px-2 py-0.5 rounded-md text-sm hover:bg-indigo-200">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            {doc.name}
                        </a>
                    ) : `[doc:${token.value}]`;
                }
                return null;
            })}
        </React.Fragment>
    );
};


const CommentView: React.FC<{ comment: Comment; project: Project }> = ({ comment, project }) => {
    const author = mockEmployees.find(e => e.id === comment.authorId);
    return (
        <div className="flex items-start space-x-3 py-2">
            <img src={`https://i.pravatar.cc/32?u=${author?.id}`} alt={author?.name} className="w-8 h-8 rounded-full flex-shrink-0" />
            <div>
                <div className="bg-secondary rounded-lg px-3 py-2 text-sm">
                    <span className="font-semibold text-sm block">{author?.name || 'Unknown User'}</span>
                    <div className="text-text-primary whitespace-pre-wrap">
                        <ContentRenderer text={comment.content} project={project} />
                    </div>
                </div>
                 {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-2 ml-1 max-w-xs space-y-2">
                        {comment.attachments.map((att, index) => (
                             <a key={index} href={att.link} target="_blank" rel="noopener noreferrer" className="block bg-primary border border-secondary p-2 rounded-lg hover:bg-secondary transition-colors">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 bg-secondary p-2 rounded-md">
                                        <PaperclipIcon className="w-5 h-5 text-text-secondary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold truncate text-text-primary" title={att.name}>{att.name}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
                <time className="text-xs text-text-secondary px-1 mt-1 block">{new Date(comment.createdAt).toLocaleString()}</time>
            </div>
        </div>
    );
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    onDelete: (taskId: string) => void;
    task: Task;
    project: Project;
    onUpdateProject: (project: Project) => void;
    teamMembers: Employee[];
    currentUser: Employee;
    isProjectLeader: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, task, project, onUpdateProject, teamMembers, currentUser, isProjectLeader }) => {
    const [formData, setFormData] = useState<Task>(task);
    const [newComment, setNewComment] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showDocSuggestions, setShowDocSuggestions] = useState(false);
    const [docSuggestionQuery, setDocSuggestionQuery] = useState('');
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isNewTask = !project.tasks.some(t => t.id === task.id);

    const isAssignee = formData.assigneeId === currentUser.id;
    const canEditDetails = isProjectLeader;
    const canManageSubtasksAndComments = isProjectLeader || isAssignee;

    useEffect(() => {
        setFormData({ ...task, subtasks: task.subtasks || [] });
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNewComment(text);

        const lastAtIndex = text.lastIndexOf('@');
        const lastSlashIndex = text.lastIndexOf('/');
        const lastSpaceIndex = text.lastIndexOf(' ');

        // Reset suggestions
        setShowMentions(false);
        setShowDocSuggestions(false);

        if (lastAtIndex > lastSpaceIndex && lastAtIndex > lastSlashIndex) {
            const query = text.substring(lastAtIndex + 1);
            if (!query.includes(' ')) {
                setMentionQuery(query);
                setShowMentions(true);
            }
        } else if (lastSlashIndex > lastSpaceIndex && lastSlashIndex > lastAtIndex) {
            const query = text.substring(lastSlashIndex + 1);
             if (!query.includes(' ')) {
                setDocSuggestionQuery(query);
                setShowDocSuggestions(true);
            }
        }
    };

    const handleMentionSelect = (name: string) => {
        const lastAt = newComment.lastIndexOf('@');
        const textBefore = newComment.substring(0, lastAt);
        setNewComment(`${textBefore}@${name} `);
        setShowMentions(false);
    };
    
    const handleDocSelect = (doc: Document) => {
        const lastSlash = newComment.lastIndexOf('/');
        const textBefore = newComment.substring(0, lastSlash);
        setNewComment(`${textBefore}[doc:${doc.id}] `);
        setShowDocSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        const newCommentObject: Comment = {
            id: `C-${Date.now()}`,
            authorId: currentUser.id,
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
        };
        const updatedTask = { ...formData, comments: [...(formData.comments || []), newCommentObject] };
        
        if (isNewTask) {
            setFormData(updatedTask);
        } else {
            const updatedTasks = project.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
            onUpdateProject({ ...project, tasks: updatedTasks });
            setFormData(updatedTask);
        }

        setNewComment('');
    };
    
    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim() || !canManageSubtasksAndComments) return;
        const newSubtask: Subtask = {
            id: `SUB-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false,
        };
        setFormData(prev => ({ ...prev, subtasks: [...(prev.subtasks || []), newSubtask] }));
        setNewSubtaskTitle('');
    };

    const handleToggleSubtask = (subtaskId: string) => {
        if (!canManageSubtasksAndComments) return;
        setFormData(prev => ({
            ...prev,
            subtasks: (prev.subtasks || []).map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
            ),
        }));
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        if (!canManageSubtasksAndComments) return;
        setFormData(prev => ({
            ...prev,
            subtasks: (prev.subtasks || []).filter(subtask => subtask.id !== subtaskId),
        }));
    };

    const handleSubtaskTitleChange = (subtaskId: string, newTitle: string) => {
        if (!canManageSubtasksAndComments) return;
        setFormData(prev => ({
            ...prev,
            subtasks: (prev.subtasks || []).map(subtask =>
                subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask
            ),
        }));
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newDocument: Document = {
            id: `DOC-${Date.now()}`, name: file.name, type: file.type || 'File',
            added: new Date().toISOString(), link: '#'
        };
        const commentContent = ``;
        const newCommentObject: Comment = {
            id: `C-${Date.now()}`, authorId: currentUser.id, content: commentContent,
            createdAt: new Date().toISOString(), attachments: [{ name: file.name, link: '#' }]
        };
        
        const updatedTask = { ...formData, comments: [...(formData.comments || []), newCommentObject] };
        const updatedTasks = project.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        if (isNewTask) {
             setFormData(updatedTask);
        } else {
            updatedTasks.push(updatedTask);
        }
        const updatedDocuments = [...(project.documents || []), newDocument];

        onUpdateProject({ ...project, tasks: updatedTasks, documents: updatedDocuments });
        if (!isNewTask) {
          setFormData(updatedTask);
        }
    };

    const filteredMembers = teamMembers.filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()));
    const filteredDocs = (project.documents || []).filter(d => d.name.toLowerCase().includes(docSuggestionQuery.toLowerCase()));

    const completedSubtasks = (formData.subtasks || []).filter(s => s.completed).length;
    const totalSubtasks = (formData.subtasks || []).length;
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNewTask ? 'Add New Task' : 'Task Details'} size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="title" type="text" value={formData.title} onChange={handleChange}
                            className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 disabled:bg-slate-100 disabled:cursor-not-allowed rounded-md" placeholder="Task Title" disabled={!canEditDetails} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails}>
                                    <option>To Do</option><option>In Progress</option><option>Done</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Assignee</label>
                                <select name="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails}>
                                    <option value="">Unassigned</option>
                                    {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails}>
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="points" className="block text-sm font-medium text-text-secondary mb-1">Story Points</label>
                                    <input id="points" name="points" type="number" min="0" value={formData.points || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">AI Suggested Role</label>
                                <input type="text" value={formData.suggestedRole || 'N/A'} readOnly className="w-full p-2 bg-secondary border border-secondary rounded-md cursor-not-allowed" />
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                                <div className="relative">
                                    <input id="startDate" name="startDate" type="date" value={formData.startDate?.split('T')[0] || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
                                <div className="relative">
                                    <input id="deadline" name="deadline" type="date" value={formData.deadline?.split('T')[0] || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} placeholder="Add a description..." className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />

                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">Optimistic Duration (days)</label>
                                <input name="optimisticDuration" type="number" min="0" value={formData.optimisticDuration || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">Most Likely Duration (days)</label>
                                <input name="mostLikelyDuration" type="number" min="0" value={formData.mostLikelyDuration || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">Pessimistic Duration (days)</label>
                                <input name="pessimisticDuration" type="number" min="0" value={formData.pessimisticDuration || ''} onChange={handleChange} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed" disabled={!canEditDetails} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Dependencies</label>
                            <div className="text-sm p-2 bg-secondary rounded-md min-h-[40px] flex flex-wrap gap-2">
                                {(formData.dependencies && formData.dependencies.length > 0) ? (
                                    formData.dependencies.map(depId => {
                                        const depTask = project.tasks.find(t => t.id === depId);
                                        return (
                                            <span key={depId} className="bg-primary px-2 py-1 rounded-md border border-secondary inline-flex items-center text-sm" title={depTask ? depTask.title : `Task ID: ${depId}`}>
                                                <span className="font-mono text-xs bg-slate-200 text-slate-600 px-1 rounded-sm mr-2">{depId.replace('TASK-', '')}</span>
                                                {depTask ? depTask.title : 'Unknown Task'}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-text-secondary italic">None</span>
                                )}
                            </div>
                        </div>
                        
                        {/* Subtasks Section */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg mb-2 flex items-center">
                                <ClipboardListIcon className="w-5 h-5 mr-2 text-text-secondary" />
                                Checklist
                            </h3>
                            
                            {totalSubtasks > 0 && (
                                <div className="mb-2">
                                    <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div className="bg-accent h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {(formData.subtasks || []).map(subtask => (
                                    <div key={subtask.id} className="flex items-center group bg-primary hover:bg-secondary p-2 rounded-md">
                                        <input
                                            type="checkbox"
                                            checked={subtask.completed}
                                            onChange={() => handleToggleSubtask(subtask.id)}
                                            disabled={!canManageSubtasksAndComments}
                                            className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent flex-shrink-0 disabled:cursor-not-allowed"
                                        />
                                        <input
                                            type="text"
                                            value={subtask.title}
                                            onChange={(e) => handleSubtaskTitleChange(subtask.id, e.target.value)}
                                            disabled={!canManageSubtasksAndComments}
                                            className={`ml-3 flex-grow bg-transparent border-none focus:ring-0 p-0 text-sm ${subtask.completed ? 'line-through text-text-secondary' : 'text-text-primary'} disabled:cursor-not-allowed`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                            disabled={!canManageSubtasksAndComments}
                                            className="ml-2 text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 flex items-center">
                                <input
                                    type="text"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                    placeholder="Add an item"
                                    disabled={!canManageSubtasksAndComments}
                                    className="flex-grow bg-secondary border-none focus:ring-accent focus:ring-1 p-2 rounded-md text-sm disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    disabled={!canManageSubtasksAndComments}
                                    className="ml-2 px-3 py-2 text-sm bg-primary border border-secondary rounded-md hover:bg-secondary disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                            {(!isNewTask && canEditDetails) && (
                                <button type="button" onClick={() => onDelete(task.id)} className="text-danger hover:underline flex items-center space-x-1">
                                    <TrashIcon className="w-4 h-4" /><span>Delete Task</span>
                                </button>
                            )}
                            <div className="flex-grow"></div>
                            <div className="space-x-2">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-secondary pt-4 lg:pt-0 lg:pl-4">
                    <h3 className="font-semibold text-lg mb-2">Activity</h3>
                    <div className="space-y-2 h-64 overflow-y-auto pr-2">
                        {formData.comments?.slice().reverse().map(c => <CommentView key={c.id} comment={c} project={project} />)}
                    </div>
                     <div className="mt-4 relative">
                        <div className="bg-secondary rounded-lg p-2">
                            <textarea value={newComment} onChange={handleCommentChange} placeholder={canManageSubtasksAndComments ? "Add a comment... (@mention, /doc)" : "You do not have permission to comment."} rows={3}
                                className="w-full bg-transparent border-none focus:ring-0 p-1" disabled={!canManageSubtasksAndComments} />
                            <div className="flex justify-between items-center mt-1">
                                <div className="space-x-1">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-1 text-text-secondary hover:text-accent rounded-full hover:bg-primary disabled:cursor-not-allowed" disabled={!canManageSubtasksAndComments}>
                                        <PaperclipIcon className="w-5 h-5" />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                                    <button className="p-1 text-text-secondary hover:text-accent rounded-full hover:bg-primary disabled:cursor-not-allowed" disabled={!canManageSubtasksAndComments}>
                                        <AtSymbolIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <button onClick={handlePostComment} className="px-3 py-1 bg-accent text-white rounded-md text-sm hover:bg-accent-hover disabled:bg-gray-400" disabled={!canManageSubtasksAndComments || !newComment.trim()}>Post Note</button>
                            </div>
                        </div>
                        {showMentions && filteredMembers.length > 0 && (
                            <div className="absolute bottom-full mb-2 w-full bg-primary border border-secondary rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                                {filteredMembers.map(member => (
                                    <button key={member.id} onClick={() => handleMentionSelect(member.name)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center space-x-2">
                                        <img src={`https://i.pravatar.cc/24?u=${member.id}`} alt={member.name} className="w-6 h-6 rounded-full" />
                                        <span>{member.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {showDocSuggestions && filteredDocs.length > 0 && (
                            <div className="absolute bottom-full mb-2 w-full bg-primary border border-secondary rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                                {filteredDocs.map(doc => (
                                    <button key={doc.id} onClick={() => handleDocSelect(doc)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center space-x-2">
                                        <DocumentTextIcon className="w-5 h-5 text-text-secondary" />
                                        <span className="truncate">{doc.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};