import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PrivacyPolicy = () => {
    return (
        <div className="page-bg min-h-screen text-white">
            <PublicNavbar />
            <div className="p-8 lg:p-16">

                <main className="max-w-4xl mx-auto bg-slate-900/50 border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
                    <h1 className="text-4xl font-black mb-8 gradient-text">Privacy Policy</h1>

                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <p>Last updated: October 2026</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
                        <p>When you register as an NGO or Provider, we collect necessary business information including names, addresses, contacts, and relevant operational zones to facilitate surplus food logistics.</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use It</h2>
                        <p>Your data is used strictly for platform operations: matching food surplus with local needs, routing notifications, and calculating environmental impact metrics.</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Sharing</h2>
                        <p>We do not sell data to third parties. Limited provider information is visible to verified NGOs strictly for successful food collection coordination.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
