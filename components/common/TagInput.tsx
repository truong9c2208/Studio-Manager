import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from '../icons/PlusIcon';
import { CloseIcon } from '../icons/CloseIcon';

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, suggestions = [], placeholder = "Add a tag..." }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onTagsChange([...tags, trimmedTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const filteredSuggestions = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
    );

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex flex-wrap gap-2 items-center p-2 bg-slate-700/50 border border-slate-600 rounded-md">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-sky-700/50 text-white text-sm font-semibold px-2 py-1 rounded-md">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-white hover:bg-white/20 rounded-full p-0.5">
                            <CloseIcon className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={placeholder}
                    className="flex-grow bg-slate-700/50 text-white focus:outline-none p-1"
                />
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => addTag(suggestion)}
                            className="w-full text-left p-2 hover:bg-slate-700 text-sm"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
