import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/feed', label: 'Feed' },
  { to: '/messages', label: 'Messages' },
  { to: '/events', label: 'Events' },
  { to: '/connections', label: 'People' },
  { to: '/profile', label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-brand-navy/80 border-b border-brand-mid/30 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
        <NavLink to="/feed" className="text-lg font-bold text-brand-amber tracking-tight">
          Still Here
        </NavLink>
        <div className="flex items-center gap-3">
          {user?.isAdmin && (
            <NavLink to="/admin" className="text-xs text-brand-muted hover:text-brand-text">
              Admin
            </NavLink>
          )}
          <NavLink to="/settings" className="text-sm text-brand-muted hover:text-brand-text">
            Settings
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-brand-muted hover:text-brand-coral"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom navigation (mobile) */}
      <nav className="bg-brand-navy/90 border-t border-brand-mid/30 flex justify-around py-2 sticky bottom-0 z-50 backdrop-blur-sm md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-xs py-1 px-2 ${isActive ? 'text-brand-amber' : 'text-brand-muted'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
