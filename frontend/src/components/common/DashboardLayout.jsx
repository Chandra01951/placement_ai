import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/resume', icon: '📄', label: 'Resume Analyzer' },
  { to: '/interview', icon: '🎤', label: 'Mock Interview' },
  { to: '/coding', icon: '💻', label: 'Coding Practice' },
  { to: '/aptitude', icon: '🧠', label: 'Aptitude Tests' },
  { to: '/career', icon: '🚀', label: 'Career Advisor' },
  { to: '/jobs', icon: '💼', label: 'Job Recommendations' },
  { to: '/companies', icon: '🏢', label: 'Company Prep' },
  { to: '/chatbot', icon: '🤖', label: 'AI Chatbot' },
  { to: '/analytics', icon: '📊', label: 'Analytics' },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { sidebarOpen } = useSelector(s => s.ui);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-lg font-bold">P</div>
          <div>
            <h1 className="text-white font-bold font-display text-lg leading-none">PlacementAI</h1>
            <p className="text-gray-500 text-xs mt-0.5">Ace Your Placement</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="text-lg">⚙️</span>
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <NavLink to="/profile" className="text-gray-400 hover:text-white transition-colors text-xs">Edit</NavLink>
        </div>
        <button onClick={handleLogout} className="mt-2 w-full text-left nav-link text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-surface-900 border-r border-white/[0.06] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface-900 border-r border-white/[0.06]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-surface-900/50 backdrop-blur border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0">
          <button onClick={() => { dispatch(toggleSidebar()); setMobileOpen(!mobileOpen); }} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          
          {/* Streak */}
          {user?.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
              <span>🔥</span>
              <span className="text-orange-400 text-sm font-semibold">{user.streak} day streak</span>
            </div>
          )}

          {/* Readiness */}
          <div className="hidden sm:flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full">
            <span className="text-primary-400 text-sm font-semibold">{user?.placementReadiness || 0}% Ready</span>
          </div>

          <NavLink to="/profile" className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user?.name?.charAt(0).toUpperCase()}
          </NavLink>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
