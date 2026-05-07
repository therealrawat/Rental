import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppShell({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  // Breadcrumb logic
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((name) => name.charAt(0).toUpperCase() + name.slice(1));

  return (
    <div className="layout-wrapper">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        isExpanded={isSidebarExpanded} 
      />
      
      {/* Overlay for mobile sidebar - stays until hamburger is clicked again */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-10 md:hidden backdrop-blur-sm" />
      )}

      <div className="main-container">
        <Header 
          onToggleMobileNav={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
          onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
        
        <main className="content-area">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs section below header */}
            <nav className="mb-6 flex items-center text-sm font-medium">
              <span className="text-emerald-600">Dashboard</span>
              {breadcrumbs.length > 0 && (
                <>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-900">{breadcrumbs[breadcrumbs.length - 1]}</span>
                </>
              )}
            </nav>

            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
