import { useState, useMemo, useRef, useEffect } from "react";
import { Bell, Menu, LogOut, User, ChevronDown, CheckCircle2, Clock, X, Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "../../context/LanguageContext.jsx";
import { notificationsApi } from "../../services/api.js";

export default function Header({ onToggleMobileNav, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const data = await notificationsApi.list();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const markAllRead = async () => {
    try {
      await notificationsApi.markAsRead();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const initials = useMemo(() => {
    const name = (user?.name || "").trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  }, [user?.name]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayRole = useMemo(() => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }, [user?.role]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const { lang, setLang, t } = useTranslation();

  return (
    <header className="header-container">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={onToggleMobileNav}
        >
          <Menu size={20} />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button 
          className="hidden md:flex p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'hi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            हिन्दी
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notifRef}>
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl relative transition-colors"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen && unreadCount > 0) markAllRead();
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-6 py-2 border-b border-gray-50 flex justify-between items-center mb-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Notifications</h4>
                  {unreadCount > 0 && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                      <Clock size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className={`px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-indigo-50/20' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'payment_received' ? 'bg-emerald-100 text-emerald-600' : 
                            n.type === 'payment_approved' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {n.type === 'payment_approved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{n.title}</p>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                            <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="hidden sm:block text-right mr-1">
                <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{displayRole}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={16} className="text-gray-400" />
                  My Profile
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
