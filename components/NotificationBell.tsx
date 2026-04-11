'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, BellRing, X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'alert_triggered' | 'trade_executed' | 'deposit' | 'info';
    read: boolean;
    timestamp: Date;
};

const typeConfig = {
    alert_triggered: { icon: BellRing, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    trade_executed: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    deposit: { icon: TrendingDown, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    info: { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

// Simple in-memory store. In production, use DB or WebSocket.
let globalNotifications: Notification[] = [];

export function pushNotification(notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) {
    const newNotif: Notification = {
        ...notif,
        id: Math.random().toString(36).slice(2),
        read: false,
        timestamp: new Date(),
    };
    globalNotifications = [newNotif, ...globalNotifications].slice(0, 50);

    // Browser notification if supported and permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notif.title, {
            body: notif.message,
            icon: '/assets/images/logo.png',
            tag: newNotif.id,
        });
    }

    // Dispatch custom event for the bell to pick up
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('alphalens-notification', { detail: newNotif }));
    }
}

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [permissionState, setPermissionState] = useState<NotificationPermission | 'default'>('default');

    const unreadCount = notifications.filter(n => !n.read).length;

    const requestPermission = async () => {
        if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            setPermissionState(perm);
        }
    };

    const handleNewNotification = useCallback((e: Event) => {
        const custom = e as CustomEvent<Notification>;
        setNotifications(prev => [custom.detail, ...prev].slice(0, 50));
    }, []);

    useEffect(() => {
        if ('Notification' in window) {
            setPermissionState(Notification.permission);
        }
        setNotifications(globalNotifications);

        window.addEventListener('alphalens-notification', handleNewNotification);
        return () => window.removeEventListener('alphalens-notification', handleNewNotification);
    }, [handleNewNotification]);

    const markAllRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        globalNotifications = updated;
    };

    const clearAll = () => {
        setNotifications([]);
        globalNotifications = [];
    };

    return (
        <div className="relative">
            <Button
                onClick={() => setOpen(!open)}
                className="relative bg-transparent hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 p-2 rounded-lg"
                size="sm"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-80 max-h-[480px] rounded-xl border border-gray-600 bg-gray-800 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-600/50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-200">Notifications</h3>
                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-xs text-teal-400 hover:text-teal-300 px-2 py-1 rounded">
                                        <Check className="h-3 w-3 inline mr-1" />Mark read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-400 px-2 py-1 rounded">
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Permission request */}
                        {permissionState === 'default' && (
                            <div className="px-4 py-3 bg-teal-500/5 border-b border-gray-600/50">
                                <button
                                    onClick={requestPermission}
                                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-2"
                                >
                                    <BellRing className="h-3.5 w-3.5" />
                                    Enable browser notifications
                                </button>
                            </div>
                        )}

                        {/* Notifications list */}
                        <div className="max-h-[360px] overflow-y-auto scrollbar-hide">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const config = typeConfig[notif.type];
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 border-b border-gray-600/30 hover:bg-gray-700/30 transition-colors ${!notif.read ? 'bg-gray-700/10' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-1.5 rounded-lg ${config.bg} mt-0.5`}>
                                                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-200">{notif.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-600 mt-1">
                                                        {new Date(notif.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
