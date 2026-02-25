import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="page-bg min-h-screen text-white">
            <PublicNavbar />
            <div className="p-8 lg:p-16">

                <main className="max-w-4xl mx-auto bg-slate-900/50 border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
                    <h1 className="text-4xl font-black mb-4 gradient-text">Contact Us</h1>
                    <p className="text-slate-400 mb-10">Have questions about the platform, partnerships, or need technical support? We're here to help.</p>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-6">Get in Touch</h2>
                            <div className="space-y-4 text-slate-300">
                                <p className="flex items-center gap-3"><span className="text-green-500">📧</span> support@foodbridge.app</p>
                                <p className="flex items-center gap-3"><span className="text-green-500">📞</span> 1-800-SURPLUS</p>
                                <p className="flex items-center gap-3"><span className="text-green-500">📍</span> Global HQ - EcoTech Park</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Your Name" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
                            <input type="email" placeholder="Email Address" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
                            <textarea placeholder="How can we help?" required rows="4" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"></textarea>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                {submitted ? 'Message Sent! ✅' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Contact;
