import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentMarketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const params = { targetAudience: 'student' };
                if (user?.location?.coordinates) {
                    params.lng = user.location.coordinates[0];
                    params.lat = user.location.coordinates[1];
                    params.radius = 10000000; // 10000km
                }
                const res = await api.get('/listings', { params });
                setListings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [user]);

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">Campus Deals</h2>
                        <p className="text-slate-400">Fresh surplus food from nearby restaurants at student prices.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.length > 0 ? (
                        listings.map(listing => (
                            <Link to={`/student/listing/${listing._id}`} key={listing._id} className="glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-green-500/50 transition-all group flex flex-col">
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src={getImageUrl(listing.imageUrl || listing.images?.[0])} alt={listing.foodName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                        {listing.category}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
                                        -{Math.round((1 - listing.price / (listing.originalPrice || 1)) * 100)}% OFF
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xl font-black text-white group-hover:text-green-400 transition-colors">{listing.foodName}</h4>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-white">₹{listing.price}</div>
                                            <div className="text-slate-500 text-xs line-through font-bold">₹{listing.originalPrice}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm mb-8">
                                        <span>🏪 {listing.providerId?.name || 'Local Store'}</span>
                                        <span>•</span>
                                        <span>📦 {listing.quantity} {listing.unit} left</span>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expires in {Math.floor((new Date(listing.expiryTime) - new Date()) / (1000 * 60 * 60))}h</div>
                                        <div className="text-green-400 font-black text-sm group-hover:translate-x-1 transition-transform">Claim Now →</div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass rounded-[3rem]">
                            <div className="text-6xl mb-6">🏜️</div>
                            <h3 className="text-2xl font-black text-white mb-2">No Student Deals Found</h3>
                            <p className="text-slate-500 text-sm">Check back later for fresh surplus listings.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentMarketplace;
