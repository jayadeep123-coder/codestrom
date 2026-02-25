import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Icons
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = createIcon('blue'); // NGO / Current User
const redIcon = createIcon('red');   // Provider / Food

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const NGOFoodMap = ({ listings, userLocation }) => {
    const defaultCenter = userLocation || [20.5937, 78.9629]; // Default to center of India if none

    return (
        <div className="h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={defaultCenter} />

                {/* User Mark */}
                {userLocation && (
                    <Marker position={userLocation} icon={blueIcon}>
                        <Popup>
                            <div className="font-bold">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {/* Food Listings */}
                {listings.map((item) => (
                    item.location?.coordinates && (
                        <Marker
                            key={item._id}
                            position={[item.location.coordinates[1], item.location.coordinates[0]]}
                            icon={redIcon}
                        >
                            <Popup className="food-popup">
                                <div className="p-2">
                                    <img
                                        src={item.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={item.foodName}
                                        className="w-full h-24 object-cover rounded-xl mb-2"
                                    />
                                    <h3 className="font-black text-slate-900">{item.foodName}</h3>
                                    <p className="text-xs text-slate-500 mb-2">{item.category} • {item.quantity} {item.unit}</p>
                                    <button
                                        onClick={() => window.location.href = `/ngo/listing/${item._id}`}
                                        className="w-full bg-green-600 text-white text-xs font-bold py-2 rounded-lg"
                                    >
                                        Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
                {/* Map Legend */}
                <div className="absolute bottom-6 left-6 z-[1000] space-y-2">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white max-w-[150px]">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-5 relative flex-shrink-0">
                                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" className="w-full relative z-10" alt="red marker" />
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Providers</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-5 relative flex-shrink-0">
                                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" className="w-full relative z-10" alt="blue marker" />
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Location</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MapContainer>
        </div>
    );
};

export default NGOFoodMap;
