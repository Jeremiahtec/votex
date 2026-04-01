import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Avatar from './Avatar';
import { LogOut, ChevronDown, Activity, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/login'); setDropdownOpen(false); };

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-glow group-hover:shadow-[0_0_24px_rgba(99,102,241,0.5)] transition-shadow">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-white">VoteX</span>
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">Beta</span>
          </Link>

          {/* Right-side controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  to="/polls/new"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 px-3 py-2 rounded-xl transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Poll
                </Link>

                {/* Avatar dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Avatar name={user.name || user.email} size="sm" />
                    <span className="hidden sm:block text-sm font-semibold text-zinc-200 max-w-[100px] truncate">
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-card overflow-hidden animate-slide-up origin-top-right">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2">
                  Sign in
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-btn">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
