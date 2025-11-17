import React, { useState, useEffect } from 'react';
import type { ProjectPage } from '../../../../types';
import { Card } from '../../../common/Card';
import { PlusIcon } from '../../../icons/PlusIcon';
import { DocumentTextIcon } from '../../../icons/DocumentTextIcon';
import { PencilIcon } from '../../../icons/PencilIcon';
import { TrashIcon } from '../../../icons/TrashIcon';

// A simple markdown-like renderer
const SimpleRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-3 mb-1">{line.substring(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="my-1">{line}</p>;
    });
    return <div className="prose max-w-none">{lines}</div>;
}

interface WikiViewProps {
    pages: ProjectPage[];
    onUpdatePages: (pages: ProjectPage[]) => void;
}

export const WikiView: React.FC<WikiViewProps> = ({ pages, onUpdatePages }) => {
    const [selectedPage, setSelectedPage] = useState<ProjectPage | null>(pages?.[0] || null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [editedTitle, setEditedTitle] = useState('');

    useEffect(() => {
        if (!selectedPage && pages?.length > 0) {
            setSelectedPage(pages[0]);
        } else if (pages?.length === 0) {
            setSelectedPage(null);
        }
    }, [pages, selectedPage]);

    const handleSelectPage = (page: ProjectPage) => {
        setSelectedPage(page);
        setIsEditing(false);
    };

    const handleEdit = () => {
        if (selectedPage) {
            setEditedContent(selectedPage.content);
            setEditedTitle(selectedPage.title);
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        if (selectedPage) {
            const updatedPages = pages.map(p => p.id === selectedPage.id ? { ...p, content: editedContent, title: editedTitle } : p);
            onUpdatePages(updatedPages);
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
        const updatedPages = [...pages, newPage];
        onUpdatePages(updatedPages);
        setSelectedPage(newPage);
        setEditedTitle(newPage.title);
        setEditedContent(newPage.content);
        setIsEditing(true);
    };
    
    const handleDeletePage = () => {
        if (selectedPage && window.confirm(`Are you sure you want to delete "${selectedPage.title}"?`)) {
            const updatedPages = pages.filter(p => p.id !== selectedPage.id);
            onUpdatePages(updatedPages);
            setSelectedPage(updatedPages[0] || null);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex min-h-[60vh] bg-primary border rounded-md -m-4">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-secondary p-4">
                <h3 className="text-lg font-semibold mb-2">Pages</h3>
                <ul>
                    {pages.map(page => (
                        <li key={page.id}>
                            <button 
                                onClick={() => handleSelectPage(page)}
                                className={`w-full text-left p-2 rounded-md flex items-center ${selectedPage?.id === page.id ? 'bg-accent text-white' : 'hover:bg-secondary'}`}
                            >
                               <DocumentTextIcon className="w-4 h-4 mr-2 flex-shrink-0" /> 
                               <span className="truncate">{page.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
                 <button
                    onClick={handleNewPage}
                    className="w-full flex items-center justify-center space-x-2 mt-4 px-4 py-2 text-sm bg-secondary border border-primary rounded-md hover:bg-slate-200"
                 >
                    <PlusIcon className="w-4 h-4" />
                    <span>New Page</span>
                </button>
            </div>

            {/* Content */}
            <div className="w-3/4 p-6">
                {selectedPage ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             {isEditing ? (
                                <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="text-2xl font-bold bg-secondary p-1 rounded-md" />
                            ) : (
                                <h2 className="text-2xl font-bold">{selectedPage.title}</h2>
                            )}
                            <div className="space-x-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleDeletePage} className="p-2 text-text-secondary hover:text-danger hover:bg-secondary rounded-md"><TrashIcon className="w-5 h-5"/></button>
                                        <button onClick={handleEdit} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary flex items-center space-x-2"><PencilIcon className="w-5 h-5"/><span>Edit</span></button>
                                    </>
                                )}
                            </div>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-[50vh] p-2 border border-secondary rounded-md font-mono text-sm bg-white text-text-primary"
                            />
                        ) : (
                            <div className="prose max-w-none">
                                <SimpleRenderer content={selectedPage.content} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                        <DocumentTextIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold">Welcome to the Wiki</h3>
                        <p>Create your first page to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
