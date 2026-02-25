import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NGODiscoveryPage = () => {
    const { user } = useAuth();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ ngos: 0, providers: 0 });

    const userLng = user?.location?.coordinates?.[0] || -74.006;
    const userLat = user?.location?.coordinates?.[1] || 40.7128;

    // Custom Icons
    const createIcon = (color) => new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const blueIcon = createIcon('blue');
    const redIcon = createIcon('red');

    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const params = { lat: userLat, lng: userLng, radius: 25000 };

                let ngoRes = { data: [] };
                let providerRes = { data: [] };

                if (user?.role === 'provider') {
                    ngoRes = await api.get('/discovery/ngos', { params });
                } else if (user?.role === 'ngo' || user?.role === 'student') {
                    providerRes = await api.get('/discovery/providers', { params });
                } else {
                    [ngoRes, providerRes] = await Promise.all([
                        api.get('/discovery/ngos', { params }),
                        api.get('/discovery/providers', { params })
                    ]);
                }

                const combined = [
                    ...ngoRes.data.map(n => ({ ...n, type: 'ngo' })),
                    ...providerRes.data.map(p => ({ ...p, type: 'provider' }))
                ].filter(p => p._id !== user?.id && p._id !== user?._id);

                setPartners(combined);
                setStats({
                    ngos: ngoRes.data.length,
                    providers: providerRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [userLat, userLng, user?.role, user?.id, user?._id]);

    return (
        <DashboardLayout title="Map View">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl border border-white/5">
                        <div className="space-y-6">
                            {user?.role !== 'ngo' && (
                                <div>
                                    <p className="text-slate-400 text-xs font-black uppercase mb-2">Verified NGOs</p>
                                    <h3 className="text-4xl font-black text-blue-400">{stats.ngos}</h3>
                                </div>
                            )}
                            {user?.role !== 'provider' && (
                                <div className={user?.role !== 'ngo' ? "pt-6 border-t border-white/10" : ""}>
                                    <p className="text-slate-400 text-xs font-black uppercase mb-2">Active Providers</p>
                                    <h3 className="text-4xl font-black text-red-400">{stats.providers}</h3>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 px-2">Network Directory</h4>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {partners.length === 0 ? (
                                <p className="text-sm text-slate-400 px-2">No partners found in your area.</p>
                            ) : partners.map(partner => (
                                <div key={partner._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${partner.type === 'ngo' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{partner.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate capitalize">{partner.type} • {partner.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="lg:col-span-3">
                    <div className="h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative text-slate-900">
                        <MapContainer
                            key={`${userLat}-${userLng}`}
                            center={[userLat, userLng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Current User Marker */}
                            {(user?.location?.coordinates) && (
                                <Marker
                                    position={[user.location.coordinates[1], user.location.coordinates[0]]}
                                    icon={createIcon('green')}
                                >
                                    <Popup>
                                        <div className="font-black text-slate-900 text-center">
                                            📍 You are here
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {partners.map(partner => (
                                partner.location?.coordinates && (
                                    <Marker
                                        key={partner._id}
                                        position={[partner.location.coordinates[1], partner.location.coordinates[0]]}
                                        icon={partner.type === 'ngo' ? blueIcon : redIcon}
                                    >
                                        <Popup>
                                            <div className="p-2 min-w-[150px]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`w-2 h-2 rounded-full ${partner.type === 'ngo' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.type}</span>
                                                </div>
                                                <h3 className="font-black text-slate-900 mb-1">{partner.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2 truncate">{partner.address}</p>
                                                {partner.type === 'provider' && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 italic">
                                                            🎓 Student Deals
                                                        </div>
                                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">
                                                            💎 Up to 70% Off
                                                        </div>
                                                    </div>
                                                )}
                                                <a
                                                    href={`tel:${partner.phone}`}
                                                    className={`inline-block w-full text-white text-center text-xs font-bold py-2 rounded-xl transition-transform active:scale-95 ${partner.type === 'ngo' ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-red-600 shadow-lg shadow-red-200'}`}
                                                >
                                                    Contact {partner.type === 'ngo' ? 'NGO' : 'Provider'}
                                                </a>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>

                        {/* Map Overlay Button */}
                        <div className="absolute top-6 right-6 z-[1000]">
                            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl font-bold text-slate-900 flex items-center gap-3 border border-white">
                                <span className="animate-pulse">📡</span>
                                <span className="text-sm tracking-tight">Active Map</span>
                            </div>
                        </div>

                        {/* Map Legend */}
                        <div className="absolute bottom-10 left-6 z-[1000] space-y-2">
                            <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-white max-w-[180px]">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Map Legend</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-4 h-6 relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-green-500 rounded-full blur-[8px] opacity-40"></div>
                                            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" className="w-full relative z-10" alt="green marker" />
                                        </div>
                                        <span className="text-sm font-black text-slate-700">You</span>
                                    </div>
                                    {user?.role === 'ngo' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-6 relative flex-shrink-0">
                                                <div className="absolute inset-0 bg-red-500 rounded-full blur-[8px] opacity-40"></div>
                                                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" className="w-full relative z-10" alt="red marker" />
                                            </div>
                                            <span className="text-sm font-black text-slate-700">Providers</span>
                                        </div>
                                    )}
                                    {user?.role !== 'ngo' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-6 relative flex-shrink-0">
                                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-[8px] opacity-40"></div>
                                                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" className="w-full relative z-10" alt="blue marker" />
                                            </div>
                                            <span className="text-sm font-black text-slate-700">NGOs</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NGODiscoveryPage;
