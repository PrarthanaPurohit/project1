import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { authService } from '../services/authService';
import '../styles/AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/projects', label: 'Projects', icon: '🎨' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/contacts', label: 'Contacts', icon: '📧' },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: '📬' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            {isSidebarOpen ? 'Admin Panel' : 'AP'}
          </h2>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && (
                <span className="nav-label">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-button"
            title="Logout"
          >
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Top Header */}
        <header className="admin-header">
          <button
            onClick={toggleSidebar}
            className="menu-button"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="page-title">Showcase Platform Admin</h1>
          <div className="header-actions">
            <button onClick={handleLogout} className="header-logout-button">
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}



