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

const navLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/properties", icon: Home, label: "Properties" },
  { to: "/transactions", icon: FileText, label: "Transactions" },
  { to: "/tenants", icon: Users, label: "Tenants" },
  { to: "/finance", icon: DollarSign, label: "Finance" },
];

export default function Sidebar({ isOpen = true, isExpanded = false }) {
  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-logo-container">
        <Cloud size={32} className="sidebar-logo-icon" />
        {isExpanded && <span className="sidebar-app-name">LandLord App</span>}
      </div>

      <button className="quick-add-btn" title="Quick Add">
        <Plus size={24} />
        {isExpanded && <span className="ml-3 font-medium">Quick Add</span>}
      </button>

      <nav className="flex flex-col w-full px-4">
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
