import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  Users, 
  Home, 
  FileText, 
  DollarSign, 
  Cloud,
  Wrench,
  FolderOpen,
  MessageSquare,
  Settings,
  Info
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "../../context/LanguageContext.jsx";
import { useMemo } from "react";

export default function Sidebar({ isOpen = true, isExpanded = false }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const navLinks = useMemo(() => {
    if (user?.role === "landlord") {
      return [
        { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard') },
        { to: "/properties", icon: Home, label: t('properties') },
        { to: "/tenants", icon: Users, label: t('tenants') },
        { to: "/finance", icon: DollarSign, label: t('finance') },
        { to: "/maintenance", icon: Wrench, label: t('maintenance') },
        { to: "/documents", icon: FolderOpen, label: t('documents') },
        { to: "/settings", icon: Settings, label: t('settings') },
      ];
    } else {
      return [
        { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard') },
        { to: "/payments", icon: DollarSign, label: t('payments') },
        { to: "/maintenance", icon: Wrench, label: t('maintenance') },
        { to: "/lease", icon: FileText, label: t('lease') },
        { to: "/documents", icon: FolderOpen, label: t('documents') },
        { to: "/property-info", icon: Info, label: t('propertyInfo') },
        { to: "/communication", icon: MessageSquare, label: t('communication') },
        { to: "/settings", icon: Settings, label: t('settings') },
      ];
    }
  }, [user?.role, t]);

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-logo-container">
        <Cloud size={32} className="sidebar-logo-icon" />
        {isExpanded && <span className="sidebar-app-name">LandLord App</span>}
      </div>

      {user?.role === "landlord" && (
        <button className="quick-add-btn" title="Quick Add">
          <Plus size={24} />
          {isExpanded && <span className="ml-3 font-medium">Quick Add</span>}
        </button>
      )}

      <nav className="flex flex-col w-full px-4 mt-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={!isExpanded ? link.label : undefined}
          >
            <link.icon size={20} className="shrink-0" />
            {isExpanded && <span className="sidebar-item-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
