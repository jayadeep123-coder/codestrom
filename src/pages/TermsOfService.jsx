import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const TermsOfService = () => {
    return (
        <div className="page-bg min-h-screen text-white">
            <PublicNavbar />
            <div className="p-8 lg:p-16">

                <main className="max-w-4xl mx-auto bg-slate-900/50 border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
                    <h1 className="text-4xl font-black mb-8 gradient-text">Terms of Service</h1>

                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <p>Last updated: October 2026</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Agreement to Terms</h2>
                        <p>By accessing FoodBridge, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Platform Usage</h2>
                        <p>FoodBridge is a facilitation platform. We do not guarantee the quality, safety, or legality of the food items listed. Both Providers and NGOs are responsible for adhering to local food safety and handling regulations.</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Prohibited Activities</h2>
                        <p>Users may not list inappropriate items, abuse the early alert system, or engage in any activity that disrupts the platform's core mission of eliminating food waste.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TermsOfService;
