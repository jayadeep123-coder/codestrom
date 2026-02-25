import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchRequests = async () => {
        try {
            const endpoint = user.role === 'provider' ? '/requests/provider' : '/requests/ngo';
            const res = await api.get(endpoint);
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/requests/${id}/status`, { status });
            fetchRequests();
            alert(`Request ${status} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <DashboardLayout title={user.role === 'provider' ? "Incoming Requests" : user.role === 'student' ? "My Orders" : "My Food Requests"}>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b">
                            <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Listing</th>
                            <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">{user.role === 'provider' ? 'Requester' : 'Provider'}</th>
                            <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Quantity</th>
                            <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {requests.map((req) => (
                            <tr key={req._id} className="hover:bg-slate-50 transition-all">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-slate-900">{req.listingId?.foodName || 'Deleted Listing'}</p>
                                </td>
                                <td className="px-8 py-5 text-slate-600 font-semibold">
                                    {user.role === 'provider' ? req.ngoId?.name : req.providerId?.name}
                                </td>
                                <td className="px-8 py-5">
                                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-black">{req.requestedQuantity}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex gap-2">
                                        {req.listingId && (
                                            <button
                                                onClick={() => navigate(`/ngo/listing/${req.listingId._id}`)}
                                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                                            >
                                                View Details
                                            </button>
                                        )}
                                        {user.role === 'provider' && req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {user.role === 'provider' && req.status === 'approved' && (
                                            <button
                                                onClick={() => handleStatusUpdate(req._id, 'completed')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-all"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default MyRequests;
