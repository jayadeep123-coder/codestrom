import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ImpactDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const data = stats?.trend || [
        { name: 'Mon', kg: 0 },
        { name: 'Tue', kg: 0 },
        { name: 'Wed', kg: 0 },
        { name: 'Thu', kg: 0 },
        { name: 'Fri', kg: 0 },
        { name: 'Sat', kg: 0 },
        { name: 'Sun', kg: 0 },
    ];

    return (
        <div className="page-bg min-h-screen text-white">
            <PublicNavbar />
            <main className="max-w-7xl mx-auto p-8 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
                    <div>
                        <h1 className="text-6xl font-black mb-6 leading-none">Making Every <br /><span className="text-green-500">Gram Count.</span></h1>
                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                            Tracking our collective effort to eliminate food waste and support communities across the globe.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-[2.5rem]">
                            <p className="text-green-500 font-bold uppercase text-xs mb-2">Food Saved</p>
                            <p className="text-4xl font-black tracking-tighter">
                                {stats?.current?.totalFoodSaved?.toLocaleString() ?? '...'}
                                <span className="text-lg ml-1 text-slate-500">KG</span>
                            </p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-[2.5rem]">
                            <p className="text-blue-500 font-bold uppercase text-xs mb-2">Meals Served</p>
                            <p className="text-4xl font-black tracking-tighter">
                                {stats?.current?.totalMealsServed?.toLocaleString() ?? '...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 p-8 rounded-[3rem] h-[400px]">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Weekly Redistribution Trend
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: '#fff' }}
                                    itemStyle={{ color: '#16a34a', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="kg" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorKg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-800 p-10 rounded-[3rem] shadow-2xl shadow-green-900/20 relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-3xl font-black mb-4 leading-tight">Environmental <br />Impact Score</h3>
                                <p className="text-green-100 font-medium">Estimated CO2 savings from redistributing surplus food instead of landfilling.</p>
                            </div>
                            <div className="mt-8">
                                <div className="text-7xl font-black tracking-tighter mb-2">
                                    {stats?.current?.co2Avoided ?? '...'}
                                    <span className="text-2xl ml-2 opacity-60">tons</span>
                                </div>
                                <div className="text-green-200 font-bold uppercase text-sm tracking-widest">CO2 Equivalent Saved</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-10 group-hover:scale-110 transition-transform">🌍</div>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Active Providers', value: stats?.current.totalProviders || '84', icon: '🏪' },
                        { label: 'NGO Partners', value: stats?.current.totalNGOs || '142', icon: '🤝' },
                        { label: 'Live Listings', value: stats?.current.activeListings || '12', icon: '🏷️' },
                        { label: 'Cities Covered', value: '18', icon: '🏙️' },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-800/20 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-colors">
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">{item.label}</p>
                            <p className="text-3xl font-black">{item.value}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ImpactDashboard;
