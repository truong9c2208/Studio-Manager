import React, { useState } from 'react';
import type { ProjectPage, Project } from '../../../types';
import { Card } from '../../common/Card';
import { PlusIcon } from '../../icons/PlusIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';

// A simple markdown-like renderer
const SimpleRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-3 mb-1">{line.substring(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="my-1">{line}</p>;
    });
    return <>{lines}</>;
}

interface ProjectPagesProps {
    project: Project;
    onUpdateProject: (project: Project) => void;
}

export const ProjectPages: React.FC<ProjectPagesProps> = ({ project, onUpdateProject }) => {
    const [selectedPage, setSelectedPage] = useState<ProjectPage | null>(project.pages?.[0] || null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    const handleSelectPage = (page: ProjectPage) => {
        setSelectedPage(page);
        setIsEditing(false);
    };

    const handleEdit = () => {
        if (selectedPage) {
            setEditedContent(selectedPage.content);
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        if (selectedPage) {
            const updatedPages = project.pages?.map(p => p.id === selectedPage.id ? { ...p, content: editedContent } : p) || [];
            onUpdateProject({ ...project, pages: updatedPages });
            setSelectedPage(updatedPages.find(p => p.id === selectedPage.id) || null);
            setIsEditing(false);
        }
    };

    const handleNewPage = () => {
        const newPage: ProjectPage = {
            id: `PAGE-${Date.now()}`,
            title: 'Untitled Page',
            content: '# New Page\n\nStart writing here.'
        };
        const updatedPages = [...(project.pages || []), newPage];
        onUpdateProject({ ...project, pages: updatedPages });
        setSelectedPage(newPage);
        setEditedContent(newPage.content);
        setIsEditing(true);
    };

    return (
        <Card>
            <div className="flex -m-6 min-h-[60vh]">
                {/* Sidebar */}
                <div className="w-1/4 border-r border-secondary p-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#F2F2F2]">Pages</h3>
                    <ul>
                        {project.pages?.map(page => (
                            <li key={page.id}>
                                <button 
                                    onClick={() => handleSelectPage(page)}
                                    className={`w-full text-left p-2 rounded-md flex items-center ${selectedPage?.id === page.id ? 'bg-accent text-white' : 'hover:bg-primary'}`}
                                >
                                   <DocumentTextIcon className="w-4 h-4 mr-2 flex-shrink-0" /> 
                                   <span className="truncate">{page.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                     <button
                        onClick={handleNewPage}
                        className="w-full flex items-center justify-center space-x-2 mt-4 px-4 py-2 text-sm bg-primary border border-secondary rounded-md hover:bg-secondary"
                     >
                        <PlusIcon className="w-4 h-4" />
                        <span>New Page</span>
                    </button>
                </div>

                {/* Content */}
                <div className="w-3/4 p-6">
                    {selectedPage ? (
                        <div>
                            <div className="flex justify-between items-center mb-4 text-[#F2F2F2]">
                                <h2 className="text-2xl font-bold">{selectedPage.title}</h2>
                                {isEditing ? (
                                    <div className="space-x-2">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save</button>
                                    </div>
                                ) : (
                                    <button onClick={handleEdit} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Edit</button>
                                )}
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full h-[50vh] p-2 border border-secondary rounded-md font-mono text-sm bg-white text-[#FFFFFF]"
                                />
                            ) : (
                                <div className="prose max-w-none text-[#FFFFFF]">
                                    <SimpleRenderer content={selectedPage.content} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            <p>Select a page to view or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};