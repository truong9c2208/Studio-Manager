import React from 'react';
import type { Notification } from '../../types';
import { Card } from '../common/Card';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface NotificationsViewProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    return (
        <div className="p-8">
            <Card>
                <div className="flex justify-between items-center mb-4 -mt-2">
                    <h1 className="text-2xl text-white font-bold">Notifications</h1>
                    <button 
                        onClick={onMarkAllAsRead}
                        className="text-sm font-semibold text-gray-300 hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>
                <div className="space-y-2">
                    {notifications.map(notif => (
                        <div 
                            key={notif.id}
                            className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                                !notif.read ? 'bg-sky-800/50' : 'bg-slate-500/50'
                            } ${!notif.read ? 'cursor-pointer hover:bg-sky-600/50' : ''}`}
                            onClick={() => !notif.read && onMarkAsRead(notif.id)}
                        >
                            <div className={`relative flex-shrink-0 mt-1 ${notif.read ? 'text-gray-400' : 'text-pink-400'}`}>
                                <CheckCircleIcon className="w-6 h-6" />
                                {!notif.read && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-400"></span>
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-white">{notif.title}</h2>
                                <p className="text-sm text-gray-300 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{timeSince(notif.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
