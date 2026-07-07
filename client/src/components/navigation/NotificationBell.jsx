import { useState, useEffect, useRef } from 'react';
import {
  getNotifications,
  markAllRead as markAllReadApi,
  dismissNotification as dismissNotificationApi,
  clearAllNotifications as clearAllApi,
} from '../../services/notificationService';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s so new notifications (from other actions) appear without a refresh
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await markAllReadApi();
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const dismissOne = async (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await dismissNotificationApi(id);
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const clearAll = async () => {
    setNotifications([]);
    try {
      await clearAllApi();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              minWidth: '16px',
              height: '16px',
              lineHeight: '16px',
            }}
            className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-md shadow-red-900/50 ring-1 ring-base"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 14px)',
            right: 0,
            zIndex: 50,
            width: '340px',
          }}
          className="bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet/20 text-violet ring-1 ring-violet/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-cyan hover:text-white transition cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-muted text-sm animate-pulse">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="text-3xl">🔔</span>
                <p className="text-muted text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`group relative flex items-start gap-3.5 px-5 py-4 border-b border-white/5 transition-all duration-150 ${
                    notif.unread
                      ? 'bg-violet/[0.06] hover:bg-violet/[0.10]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {notif.unread && (
                    <span
                      style={{ top: '50%', transform: 'translateY(-50%)', left: '14px' }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-violet"
                    />
                  )}

                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      notif.unread ? 'bg-violet/15 ring-1 ring-violet/20' : 'bg-white/5'
                    }`}
                  >
                    {notif.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <p
                      className={`text-[12px] font-semibold mb-0.5 ${
                        notif.unread ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted mt-1">{timeAgo(notif.createdAt)}</p>
                  </div>

                  <button
                    onClick={(e) => dismissOne(notif._id, e)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 transition-all duration-150 text-xs cursor-pointer"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-white/8">
              <button
                onClick={clearAll}
                className="w-full text-center text-[11px] text-muted hover:text-white/70 transition cursor-pointer"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;