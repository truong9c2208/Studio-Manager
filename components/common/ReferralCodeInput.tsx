import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Employee } from '../../../types';
import { SearchIcon } from '../icons/SearchIcon';

interface ReferralCodeInputProps {
    value: string;
    onSelect: (code: string) => void;
    employees: Employee[];
    disabled?: boolean;
}

export const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({ value, onSelect, employees, disabled }) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<Employee[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredEmployees = useMemo(() => {
        if (!inputValue) return [];
        const lowercasedInput = inputValue.toLowerCase();
        return employees.filter(emp =>
            emp.name.toLowerCase().includes(lowercasedInput) ||
            emp.referralCode?.toLowerCase().includes(lowercasedInput)
        );
    }, [employees, inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputValue(text);
        onSelect(text); // Allow direct input
    };

    const handleSuggestionClick = (employee: Employee) => {
        if (employee.referralCode) {
            setInputValue(employee.referralCode);
            onSelect(employee.referralCode);
        }
        setIsFocused(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Enter name or code"
                    disabled={disabled}
                    className="w-full p-2 bg-secondary border-secondary rounded-md text-sm pr-8"
                />
                <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            </div>

            {isFocused && filteredEmployees.length > 0 && inputValue && (
                <div className="absolute z-10 w-full mt-1 bg-primary border border-secondary rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredEmployees.map(employee => (
                        <button
                            key={employee.id}
                            type="button"
                            onMouseDown={() => handleSuggestionClick(employee)}
                            className="w-full text-left p-2 hover:bg-secondary flex justify-between items-center"
                        >
                            <div className="flex items-center space-x-2">
                                <img src={`https://i.pravatar.cc/24?u=${employee.id}`} alt={employee.name} className="w-6 h-6 rounded-full" />
                                <span className="text-sm">{employee.name}</span>
                            </div>
                            <span className="text-xs font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{employee.referralCode}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
