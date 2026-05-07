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
import { useMemo } from "react";

export default function Sidebar({ isOpen = true, isExpanded = false }) {
  const { user } = useAuth();

  const navLinks = useMemo(() => {
    if (user?.role === "landlord") {
      return [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/properties", icon: Home, label: "Properties" },
        { to: "/tenants", icon: Users, label: "Tenants" },
        { to: "/finance", icon: DollarSign, label: "Finance" },
        { to: "/maintenance", icon: Wrench, label: "Maintenance" },
        { to: "/documents", icon: FolderOpen, label: "Documents" },
        { to: "/settings", icon: Settings, label: "Settings" },
      ];
    } else {
      return [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/payments", icon: DollarSign, label: "Rent & Payments" },
        { to: "/maintenance", icon: Wrench, label: "Maintenance" },
        { to: "/lease", icon: FileText, label: "Lease Info" },
        { to: "/documents", icon: FolderOpen, label: "Documents" },
        { to: "/property-info", icon: Info, label: "Property Info" },
        { to: "/communication", icon: MessageSquare, label: "Communication" },
        { to: "/settings", icon: Settings, label: "Settings" },
      ];
    }
  }, [user?.role]);

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
