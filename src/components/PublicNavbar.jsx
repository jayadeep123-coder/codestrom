import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
    return (
        <header className="relative z-50 glass border-b border-white/5">
            <nav className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-900/50">
                        F
                    </div>
                    <span className="text-xl font-black tracking-tight text-white">
                        Food<span className="text-green-500">Bridge</span>
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/impact" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">Live Impact</Link>
                    <Link to="/contact" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">Contact</Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                        Sign In
                    </Link>
                    <Link to="/register" className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-green-900/50">
                        Get Started
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default PublicNavbar;
