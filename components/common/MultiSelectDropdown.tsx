import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedValues, onChange, placeholder = "Select...", disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = (value: string) => {
        const newSelection = selectedValues.includes(value)
            ? selectedValues.filter(item => item !== value)
            : [...selectedValues, value];
        onChange(newSelection);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const selectionText = selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md flex justify-between items-center text-left disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
                <span className={selectedValues.length > 0 ? 'text-text-primary' : 'text-text-secondary'}>
                    {selectionText}
                </span>
                <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && !disabled && (
                <div className="absolute z-10 w-full mt-1 bg-primary border border-secondary rounded-md shadow-lg">
                    <div className="p-2">
                         <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 bg-secondary border border-secondary rounded-md"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto p-2">
                        {filteredOptions.map(option => (
                            <li
                                key={option.value}
                                className="p-2 hover:bg-secondary rounded-md cursor-pointer"
                                onClick={() => handleToggle(option.value)}
                            >
                                <label className="flex items-center space-x-2 w-full cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(option.value)}
                                        readOnly
                                        className="form-checkbox h-4 w-4 text-accent rounded focus:ring-accent"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};