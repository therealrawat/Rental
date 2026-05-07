import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  Users, 
  Home, 
  FileText, 
  DollarSign, 
  Cloud
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useMemo } from "react";

export default function Sidebar({ isOpen = true, isExpanded = false }) {
  const { user } = useAuth();

  const navLinks = useMemo(() => {
    const links = [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ];

    if (user?.role === "landlord") {
      links.push(
        { to: "/properties", icon: Home, label: "Properties" },
        { to: "/tenants", icon: Users, label: "Tenants" },
        { to: "/finance", icon: DollarSign, label: "Finance" },
      );
    } else if (user?.role === "tenant") {
      links.push(
        { to: "/tenants", icon: FileText, label: "My Lease" },
      );
    }

    return links;
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

      <nav className="flex flex-col w-full px-4 mt-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={!isExpanded ? link.label : undefined}
          >
            <link.icon size={22} className="shrink-0" />
            {isExpanded && <span className="sidebar-item-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
