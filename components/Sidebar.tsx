import React, { useMemo } from 'react';
import { NAV_ITEMS } from '../constants';
import type { NavItem } from '../types';
import { Logo } from './icons/Logo';
import { useTranslation } from '../hooks/useTranslation';

interface SidebarProps {
  activeItem: string;
  onNavItemClick: (id: string) => void;
  isAdmin: boolean;
  unreadNotificationsCount: number;
  onLogoClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavItemClick, isAdmin, unreadNotificationsCount, onLogoClick }) => {
  const { t } = useTranslation();

  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.map(item => {
      let label = t(item.labelKey as any);
      if (!isAdmin && item.id === 'Dashboard') {
        label = t('nav_my_day');
      }

      const isVisible = item.visibility === 'all' ||
                        (isAdmin && item.visibility === 'admin') ||
                        (!isAdmin && item.visibility === 'staff');

      return { ...item, label, isVisible };
    }).filter(item => item.isVisible);
  }, [isAdmin, t]);

  return (
    <aside className="w-64 bg-[#234C6A] flex-shrink-0">
      <div className="h-20 px-4 border-b border-primary">
        <button onClick={onLogoClick} className="w-full h-full flex items-center justify-center" aria-label="Go to dashboard">
          <Logo className="h-10" />
        </button>
      </div>
      <nav className="p-4">
        <ul>
          {visibleNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavItemClick(item.id)}
                className={`
                  w-full flex items-center p-3 my-1 rounded-lg transition-colors relative
                  ${
                    activeItem === item.id
                      ? 'bg-[#1B3C53] text-white'
                      : 'text-text-secondary hover:bg-[#1B3C53]'
                  }
                `}
              >
                <item.icon className="w-6 h-6 mr-3 text-[#F2F2F2]" />
                <span className="font-medium text-[#F2F2F2]">{item.label}</span>
                {item.id === 'Notifications' && unreadNotificationsCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-secondary"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};