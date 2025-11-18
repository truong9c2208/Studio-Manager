import React, { useState, useRef, useEffect } from 'react';
import type { Employee } from '../types';
import { BellIcon } from './icons/BellIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { useTranslation } from '../hooks/useTranslation';
import type { Locale } from '../i18n/LanguageContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface HeaderProps {
  title: string;
  loggedInUser: Employee;
  viewingAsUser: Employee;
  allUsers: Employee[];
  onSetViewingAsUser: (employeeId: string) => void;
  onProfileClick: () => void;
  onLogout: () => void;
  onNavigate: (id: string) => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  loggedInUser, 
  viewingAsUser, 
  allUsers, 
  onSetViewingAsUser, 
  onProfileClick,
  onLogout,
  onNavigate, 
  unreadNotificationsCount 
}) => {
  const { locale, setLocale, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center h-20 px-8 bg-slate-800 border-b border-primary">
      <h1 className="text-2xl font-bold text-[#FFFFFF]">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* Admin User Switcher */}
        {/* {loggedInUser.systemRole === 'Admin' && (
          <div>
            <label htmlFor="user-switcher" className="text-sm font-medium text-text-secondary mr-2">{t('header_viewing_as')}</label>
            <select
              id="user-switcher"
              value={viewingAsUser.id}
              onChange={(e) => onSetViewingAsUser(e.target.value)}
              className="p-2 bg-primary border border-secondary rounded-md text-sm font-semibold focus:ring-accent focus:border-accent"
            >
              {allUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.systemRole})</option>
              ))}
            </select>
          </div>
        )} */}

        {/* Language Switcher */}
        <div className="relative">
          <GlobeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F2F2] pointer-events-none" />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="pl-10 p-2 bg-slate-800 border border-slate-600 rounded-md text-[#F2F2F2] font-semibold appearance-none focus:ring-accent focus:border-accent"
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>

        <div className="w-px h-8 bg-primary"></div>
        
        {/* Notifications */}
        <button onClick={() => onNavigate('Notifications')} className="relative p-2 text-[#FFFFFF] hover:text-accent rounded-full hover:bg-primary transition-colors">
            <BellIcon className="w-6 h-6" />
            {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-danger text-white text-xs items-center justify-center">{unreadNotificationsCount}</span>
                </span>
            )}
        </button>

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center border border-slate-600 space-x-2 p-2 rounded-lg hover:bg-slate-500/20 transition-colors">
            <img
              src={`https://i.pravatar.cc/40?u=${loggedInUser.id}`}
              alt={loggedInUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm text-left text-[#FFFFFF]">{loggedInUser.name}</p>
              <p className="text-xs text-[#F2F2F2]">{loggedInUser.role}</p>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10 border border-slate-600">
              <div className="py-1">
                <button
                  onClick={() => { onProfileClick(); setIsDropdownOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-[#F2F2F2] hover:bg-slate-700"
                >
                  <UserCircleIcon className="w-5 h-5 mr-2" /> My Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-danger hover:bg-slate-700"
                >
                  <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};