import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, Heart, Trophy, Settings, LogOut, Award, ChevronRight, Crown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

import { Navbar } from './Navbar';
import { OnboardingModal } from '../dashboard/OnboardingModal';

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onboardingComplete } = useSelector((state) => state.ui);

  const handleLogout = async () => {
    // await dispatch(logoutUser());
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Scores', path: '/dashboard/scores', icon: Target },
    { name: 'My Charity', path: '/dashboard/charity', icon: Heart },
    { name: 'Draws', path: '/dashboard/draws', icon: Trophy },
    { name: 'Winnings', path: '/dashboard/winnings', icon: Award },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-obsidian flex pt-20">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-white/10 hidden md:flex flex-col fixed h-[calc(100vh-80px)] bg-gradient-to-b from-surface/95 via-surface to-surface-2/80 backdrop-blur-xl classic-frame">
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald to-gold flex items-center justify-center text-obsidian">
                <Crown size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Member suite</p>
                <h2 className="font-display font-bold text-lg mt-1">Classic Golf Club</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 py-5 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald/10 text-emerald shadow-[0_10px_30px_rgba(0,200,150,0.12)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-coral hover:bg-coral/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 lg:p-10 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <OnboardingModal open={!onboardingComplete} />
    </div>
    </>
  );
};
