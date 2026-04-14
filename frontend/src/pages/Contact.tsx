import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { contactAPI } from '../services/api';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | Contact";
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate captcha
        if (!captchaToken) {
            setCaptchaError(true);
            return;
        }

        setCaptchaError(false);
        setIsSubmitting(true);

        try {
            await contactAPI.submit({ ...formData, captchaToken });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
            setCaptchaToken(null);
            recaptchaRef.current?.reset();

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again.');
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        if (token) setCaptchaError(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Get in <span className="text-maroon-700">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Questions or feedback? We're here to listen.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Let's Connect
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-8">
                                    Business Talk brings together thought leaders in academia and research scholars
                                    for meaningful conversations. Have something to ask or share? We'd love to hear from you.
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                                        <a 
                                            href="mailto:hellomrbhatt@gmail.com"
                                            className="text-maroon-700 hover:text-maroon-800 hover:underline transition-colors cursor-pointer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            hellomrbhatt@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                                        <a
                                            href="https://www.deepakbbhatt.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-maroon-700 hover:text-maroon-800 transition-colors"
                                        >
                                            www.deepakbbhatt.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                        <p className="text-gray-700">Ahmedabad, Gujarat (India)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Send a Message
                                </h2>

                                {submitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6"
                                    >
                                        Thank you for your message! We'll get back to you soon.
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {/* reCAPTCHA */}
                                    <div>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                            onChange={handleCaptchaChange}
                                            onExpired={() => setCaptchaToken(null)}
                                        />
                                        {captchaError && (
                                            <p className="mt-2 text-sm text-red-600">
                                                Please complete the CAPTCHA verification.
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
