import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Bell, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ onToggleMobileNav, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayRole = useMemo(() => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }, [user?.role]);

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
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-48 lg:w-64 pl-10 pr-3 py-2 bg-gray-100 border-transparent rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Search here..."
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="hidden sm:block text-right mr-1">
                <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{displayRole}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {initials}
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 profile-dropdown rounded-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
