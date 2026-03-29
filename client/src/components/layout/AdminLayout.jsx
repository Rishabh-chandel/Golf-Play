import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Heart, Trophy, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { Navbar } from './Navbar';

export const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Draws', path: '/admin/draws', icon: Trophy },
    { name: 'Charities', path: '/admin/charities', icon: Heart },
    { name: 'System', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-obsidian flex pt-20">
      <aside className="w-64 border-r border-border hidden md:flex flex-col bg-surface-1 fixed h-[calc(100vh-80px)]">
        <div className="py-4 px-6 border-b border-border">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Admin Portal</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-text-secondary hover:text-red-400 hover:bg-red-400/10 w-full transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-[calc(100vh-80px)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
};
