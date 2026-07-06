import { useState, useEffect, useRef } from 'react';

const NOTIFICATIONS = [
  {
    id: 1,
    icon: '🍿',
    title: 'New Release',
    message: "'Motu Patlu in the Game of Zones' is now available to watch!",
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    icon: '🔥',
    title: 'Trending For You',
    message: 'Because you watched action movies, check out the Top 10 list today.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 3,
    icon: '✅',
    title: 'Added to Watchlist',
    message: "'Interstellar' was successfully saved to your My List.",
    time: '3h ago',
    unread: true,
  },
  {
    id: 4,
    icon: '🎬',
    title: 'New Season Alert',
    message: 'Season 2 of your watchlisted show just dropped — watch it now!',
    time: 'Yesterday',
    unread: false,
  },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissOne = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex-shrink-0"
      >
        {/* Bell SVG icon — no external dependency required */}
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

        {/* Red badge */}
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

      {/* Dropdown panel */}
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
          {/* Header */}
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

          {/* Notification list */}
          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="text-3xl">🔔</span>
                <p className="text-muted text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`group relative flex items-start gap-3.5 px-5 py-4 border-b border-white/5 transition-all duration-150 ${
                    notif.unread
                      ? 'bg-violet/[0.06] hover:bg-violet/[0.10]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {notif.unread && (
                    <span
                      style={{ top: '50%', transform: 'translateY(-50%)', left: '14px' }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-violet"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      notif.unread ? 'bg-violet/15 ring-1 ring-violet/20' : 'bg-white/5'
                    }`}
                  >
                    {notif.icon}
                  </div>

                  {/* Content */}
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
                    <p className="text-[10px] text-muted mt-1">{notif.time}</p>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={(e) => dismissOne(notif.id, e)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 transition-all duration-150 text-xs cursor-pointer"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-white/8">
              <button
                onClick={() => setNotifications([])}
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
