import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ title, children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const providerNav = [
        { label: 'Overview', path: '/provider/dashboard', icon: '🏠' },
        { label: 'My Listings', path: '/provider/listings', icon: '📋' },
        { label: 'Add Food', path: '/provider/add-listing', icon: '➕' },
        { label: 'NGO Network', path: '/ngo/discovery', icon: '📡' },
        { label: 'Requests', path: '/provider/requests', icon: '🔔' },
        { label: 'History', path: '/provider/history', icon: '📜' },
        { label: 'Surplus Forecast', path: '/provider/forecast', icon: '🔮' },
        { label: 'Settings', path: '/profile', icon: '⚙️' },
    ];
    const ngoNav = [
        { label: 'Map View', path: '/ngo/discovery', icon: '🗺️' },
        { label: 'Browse Food', path: '/ngo/browse', icon: '🍔' },
        { label: 'Surplus Alerts', path: '/ngo/alerts', icon: '🚨' },
        { label: 'My Requests', path: '/ngo/requests', icon: '📦' },
        { label: 'Settings', path: '/profile', icon: '⚙️' },
    ];
    const adminNav = [
        { label: 'Admin Panel', path: '/admin/dashboard', icon: '🛡️' },
        { label: 'Settings', path: '/profile', icon: '⚙️' },
    ];
    const staffNav = [
        { label: 'Operations', path: '/staff/dashboard', icon: '🔧' },
        { label: 'Settings', path: '/profile', icon: '⚙️' },
    ];
    const studentNav = [
        { label: 'Portal Home', path: '/student/dashboard', icon: '🎓' },
        { label: 'Discount Deals', path: '/student/marketplace', icon: '💸' },
        { label: 'My Orders', path: '/student/requests', icon: '📦' },
        { label: 'Profile', path: '/profile', icon: '⚙️' },
    ];

    const navMap = { provider: providerNav, ngo: ngoNav, admin: adminNav, staff: staffNav, student: studentNav };
    const navItems = navMap[user?.role] || [];

    return (
        <div className="flex h-screen page-bg overflow-hidden transition-colors duration-300">

            {/* Sidebar */}
            <aside className="w-64 hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-shrink-0 transition-colors duration-300">
                {/* Logo */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center text-white font-black">F</div>
                        <span className="text-lg font-black text-slate-900 dark:text-white">Food<span className="text-green-600">Bridge</span></span>
                    </div>
                </div>

                {/* User badge */}
                <div className="px-4 py-6">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-green-200 dark:shadow-none">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user?.name}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm ${isActive
                                    ? 'bg-green-50 dark:bg-green-600/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-white hover:bg-green-50 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl font-bold text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all text-sm"
                    >
                        <span>🚪</span>
                        <span>Logout Account</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10 transition-colors duration-300">
                    <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-black text-slate-900 dark:text-white">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
