import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const StudentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get('/requests/ngo');
                setRequests(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <header>
                    <h2 className="text-4xl font-black text-white mb-2">My Active Claims</h2>
                    <p className="text-slate-400">Track and manage your reserved surplus deals.</p>
                </header>

                <div className="space-y-6">
                    {requests.length > 0 ? requests.map(request => (
                        <div key={request._id} className="glass rounded-[2rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🥡</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-black text-white">{request.listingId?.foodName || 'Deleted Listing'}</h4>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="text-slate-500 text-sm flex gap-6">
                                    <span>🏪 Provided by: <strong className="text-slate-300">{request.providerId?.name}</strong></span>
                                    <span>📦 Quantity: <strong className="text-slate-300">{request.requestedQuantity}</strong></span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Scheduled Pickup</div>
                                <div className="text-white font-black text-lg">{new Date(request.scheduledPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div className="text-slate-500 text-xs">{new Date(request.scheduledPickupTime).toLocaleDateString()}</div>
                            </div>
                            <div className="md:pl-8 md:border-l border-white/5 flex gap-4">
                                <button className="glass px-6 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-colors">View Ticket</button>
                                {request.status === 'approved' && (
                                    <button className="bg-red-500/20 text-red-500 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Cancel</button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center glass rounded-[3rem]">
                            <div className="text-6xl mb-6">🥪</div>
                            <h3 className="text-2xl font-black text-white mb-2">Hungry?</h3>
                            <p className="text-slate-500 text-sm">You haven't claimed any surplus deals yet.</p>
                            <Link to="/student/marketplace" className="mt-8 inline-block bg-green-500 hover:bg-green-400 text-white font-black px-10 py-4 rounded-[1.5rem] transition-all">
                                Explore Deals
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentRequests;
