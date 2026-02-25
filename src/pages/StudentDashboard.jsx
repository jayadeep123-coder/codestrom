import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ activeClaims: 0, totalSaved: 0, rewards: 0 });
    const [recentDeals, setRecentDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const params = { targetAudience: 'student' };
                if (user?.location?.coordinates) {
                    params.lng = user.location.coordinates[0];
                    params.lat = user.location.coordinates[1];
                    params.radius = 10000000; // 10000km
                }

                const [dealsRes, requestsRes] = await Promise.all([
                    api.get('/listings', { params }),
                    api.get('/requests/ngo')
                ]);
                setRecentDeals(dealsRes.data.slice(0, 4));
                setStats({
                    activeClaims: requestsRes.data.filter(r => r.status === 'approved').length,
                    totalSaved: requestsRes.data.filter(r => r.status === 'completed').length * 2.5, // 2.5kg per meal deal
                    rewards: requestsRes.data.length * 15
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <header>
                    <h2 className="text-4xl font-black text-white mb-2">Student Portal</h2>
                    <p className="text-slate-400">Exclusive meal deals and surplus savings.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-green-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">🎓</div>
                        <div className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Active Claims</div>
                        <div className="text-5xl font-black text-white">{stats.activeClaims}</div>
                    </div>
                    <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">🥗</div>
                        <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Food Saved</div>
                        <div className="text-5xl font-black text-white">{stats.totalSaved.toFixed(1)} <span className="text-xl">kg</span></div>
                    </div>
                    <div className="glass p-8 rounded-[2.5rem] border border-purple-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">✨</div>
                        <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Bridge Points</div>
                        <div className="text-5xl font-black text-white">{stats.rewards}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="glass rounded-[3rem] p-10 border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-white">Live Student Deals</h3>
                            <Link to="/student/marketplace" className="text-green-400 font-bold hover:text-green-300">View All →</Link>
                        </div>
                        <div className="space-y-4">
                            {recentDeals.map(deal => (
                                <Link key={deal._id} to={`/student/listing/${deal._id}`} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform overflow-hidden">
                                        {deal.imageUrl ? (
                                            <img src={getImageUrl(deal.imageUrl)} alt={deal.foodName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>🍔</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold mb-0.5">{deal.foodName}</h4>
                                        <div className="text-slate-500 text-xs">{deal.listingType} • {deal.category}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-black text-lg">₹{deal.price}</div>
                                        <div className="text-slate-500 text-[10px] line-through">₹{deal.originalPrice}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="glass rounded-[3rem] p-10 border border-white/10 bg-gradient-to-br from-green-600/10 to-emerald-900/5">
                        <h3 className="text-2xl font-black text-white mb-4">Verification Required</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">Ensure you have your physical or digital university ID card ready. Providers will ask for it during pickup for all Student Privilege deals.</p>
                        <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px] font-bold">✓</span>
                                Valid University ID
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px] font-bold">✓</span>
                                Instant Reservation
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
