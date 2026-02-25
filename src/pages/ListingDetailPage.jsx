import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import NGOFoodMap from '../components/NGOFoodMap';
import api, { getImageUrl } from '../api/axios';

const ListingDetailPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [requestedQuantity, setRequestedQuantity] = useState(1);
    const [scheduledPickupTime, setScheduledPickupTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // TODO: Replace these placeholders with the pictures you want!
    const carouselImages = [
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=2067",
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=2070"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [carouselImages.length]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${id}`);
                const fetchedListing = res.data;

                setListing(fetchedListing);
                setRequestedQuantity(1);
                setScheduledPickupTime(fetchedListing.pickupTime ? new Date(fetchedListing.pickupTime).toISOString().slice(0, 16) : '');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleRequest = async () => {
        if (!scheduledPickupTime) {
            alert('Please select a pickup time');
            return;
        }

        try {
            await api.post('/requests', {
                listingId: id,
                requestedQuantity,
                scheduledPickupTime,
                notes
            });
            alert('Request sent successfully!');
            navigate('/ngo/requests');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        }
    };

    if (loading) return <DashboardLayout title="Loading Details..."></DashboardLayout>;
    if (!listing) return <DashboardLayout title="Not Found">Listing not found.</DashboardLayout>;

    return (
        <DashboardLayout title="Food Item Details">
            <div className={`grid grid-cols-1 ${user?.role === 'ngo' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-10`}>
                {/* Left Column: Details and Map */}
                <div className={`${user?.role === 'ngo' ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-8`}>
                    {/* Main Details Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300">
                        <img
                            src={getImageUrl(listing.imageUrl)}
                            className="w-full h-[400px] object-cover"
                            alt={listing.foodName}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=Image+Not+Found' }}
                        />
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight italic">{listing.foodName}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                        <span className="text-xl grayscale opacity-50">🏠</span> Distributed by {listing.providerId?.name}
                                    </p>
                                </div>
                                {new Date(listing.expiryTime) < new Date() ? (
                                    <span className="px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50">
                                        Spoiled
                                    </span>
                                ) : (
                                    <span className={`px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border ${listing.status === 'available' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' :
                                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                        {listing.status}
                                    </span>
                                )}
                            </div>

                            {/* Auto-Playing Image Carousel */}
                            <div className="relative w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-10 shadow-xl border border-white/5 group bg-slate-100 dark:bg-slate-800">
                                {carouselImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Slide ${idx + 1}`}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                ))}
                                {/* Carousel Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                                {/* Carousel Indicators */}
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                                    {carouselImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Listing Description</h5>
                                <p className="text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">"{listing.description || "Fresh surplus food ready for redistribution."}"</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Category</p>
                                    <p className="font-black text-slate-900 dark:text-white capitalize">{listing.category}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Available Inventory</p>
                                    <span className="text-2xl font-black text-slate-900">{listing.quantity} {listing.unit}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Window</p>
                                    <p className="font-black text-slate-900 dark:text-white">
                                        {new Date(listing.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-red-50 dark:border-red-900/20">
                                    <p className="text-[10px] font-black text-red-400/80 dark:text-red-500/80 uppercase tracking-widest mb-1">Expires By</p>
                                    <p className="font-black text-red-600 dark:text-red-400">
                                        {new Date(listing.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {listing.isConsumerSurplus && (
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">🏠 Household Surplus</span>
                            )}
                            {listing.bulkQuantity && (
                                <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-800/50">📦 Bulk Quantity</span>
                            )}
                            {listing.advanceListing && (
                                <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-800/50">⏰ Advance Posting</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Interaction */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="text-3xl">📍</span> Pickup Logistics
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{listing.providerId?.address?.split(',')[0]} Area</p>
                    </div>
                    {listing.location?.coordinates && (
                        <div className="h-[450px] rounded-[2.5rem] overflow-hidden mb-6 border-8 border-slate-50 dark:border-slate-800 shadow-inner group relative">
                            <NGOFoodMap
                                listings={[listing]}
                                userLocation={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                            />
                            <div className="absolute inset-0 pointer-events-none border border-black/5 dark:border-white/5 rounded-[2rem]"></div>
                        </div>
                    )}
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400 ml-2 italic">"{listing.providerId?.address || "Location details provided upon request approval."}"</p>
                </div>

                {/* Right Column: Interaction Hub (NGO Only) */}
                {user?.role === 'ngo' && new Date(listing.expiryTime) >= new Date() && (
                    <div className="space-y-8">
                        <div className="bg-slate-900 dark:bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none transition-all duration-500 border border-white/5">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                                <span className="text-3xl">📥</span>
                                <h3 className="text-2xl font-black tracking-tight">Acquisition Hub</h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Volume Selection</label>
                                    <div className="flex items-center gap-4 bg-white/5 dark:bg-black/20 rounded-[1.75rem] p-3 border border-white/5">
                                        <button
                                            onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
                                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-emerald-600 transition-all font-black text-2xl"
                                        >-</button>
                                        <div className="flex-1 text-center">
                                            <input
                                                type="number"
                                                className="w-full bg-transparent text-center font-black text-3xl outline-none"
                                                value={requestedQuantity}
                                                onChange={(e) => {
                                                    setRequestedQuantity(Math.min(listing.quantity, parseInt(e.target.value) || 1));
                                                }}
                                            />
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{listing.unit} UNIT</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setRequestedQuantity(Math.min(listing.quantity, requestedQuantity + 1));
                                            }}
                                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-emerald-600 transition-all font-black text-2xl"
                                        >+</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Arrival Window</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">📅</span>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-white/5 dark:bg-black/20 border border-white/5 rounded-[1.75rem] pl-14 pr-6 py-5 font-black text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={scheduledPickupTime}
                                            onChange={(e) => setScheduledPickupTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Manifest Notes</label>
                                    <textarea
                                        className="w-full bg-white/5 dark:bg-black/20 border border-white/5 rounded-[1.75rem] p-6 font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[140px] resize-none"
                                        placeholder="Specify transport requirements or distribution plan..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                                        <span>Current Stock Level</span>
                                        <span>{listing.quantity} {listing.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-black">
                                        <span className="text-slate-400 italic">Allocation</span>
                                        <span className="text-green-500">{requestedQuantity} {listing.unit}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequest}
                                    className="w-full bg-green-600 hover:bg-emerald-500 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-green-900/40 uppercase tracking-[0.2em] text-xs disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                                    disabled={listing.status !== 'available' || listing.quantity <= 0}
                                >
                                    {(listing.status === 'available' && listing.quantity > 0) ? (
                                        <span className="flex items-center justify-center gap-3">
                                            Initialize Request <span className="translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
                                        </span>
                                    ) : 'Supply Exhausted'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-green-100 dark:border-green-800/50">🛡️</div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Food Integrity Protocol</h4>
                            </div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                Provider warrants that all surplus items are curated, stored, and staged under strict compliance with regional health standards and cold-chain integrity protocols.
                            </p>
                        </div>
                    </div>
                )}
                {/* Right Column: Interaction Hub (Student Only) */}
                {user?.role === 'student' && listing.status === 'available' && new Date(listing.expiryTime) >= new Date() && (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-10 rounded-[3rem] shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-white">Student Privilege</h3>
                                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">Verified</span>
                            </div>
                            <p className="text-indigo-200/80 text-sm font-medium mb-8 leading-relaxed">
                                You are claiming a highly discounted surplus deal reserved exclusively for students. <strong className="text-white">You must present a valid Student ID upon pickup.</strong> Failure to do so may result in your account being suspended.
                            </p>

                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 mb-8">
                                <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Quantity Needed</span>
                                    <span>Max {listing.quantity} {listing.unit}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))} className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black text-xl hover:bg-indigo-500 hover:text-white transition-colors">-</button>
                                    <input type="number" readOnly className="flex-1 bg-transparent text-center font-black text-3xl text-white outline-none" value={requestedQuantity} />
                                    <button onClick={() => setRequestedQuantity(Math.min(listing.quantity, requestedQuantity + 1))} className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black text-xl hover:bg-indigo-500 hover:text-white transition-colors">+</button>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mb-8 flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per unit</div>
                                    <div className="text-3xl font-black text-white">₹{listing.price}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Price</div>
                                    <div className="text-lg font-bold text-slate-500 line-through">₹{listing.originalPrice}</div>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        await api.post('/requests/student-claim', {
                                            listingId: id,
                                            requestedQuantity,
                                            scheduledPickupTime: listing.pickupTime
                                        });
                                        alert('Deal claimed successfully!');
                                        navigate('/student/requests');
                                    } catch (err) {
                                        alert(err.response?.data?.message || 'Failed to claim deal');
                                    }
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-widest text-sm"
                            >
                                Claim Deal Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ListingDetailPage;
