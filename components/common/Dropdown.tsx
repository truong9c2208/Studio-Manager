import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} type="button">
                {trigger}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-lg z-10 border border-secondary">
                    <div className="py-1" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DropdownItem: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        type="button"
        className={`w-full text-left flex items-center px-4 py-2 text-sm text-text-primary hover:bg-secondary ${className}`}
    >
        {children}
    </button>
);