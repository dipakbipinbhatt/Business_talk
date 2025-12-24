import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Youtube, Linkedin, Twitter, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 heading-serif">
                            Get in <span className="text-maroon-700">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Have a question, want to be a guest on our podcast, or interested in collaboration?
                            We'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 px-4">
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
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 heading-serif">
                                    Let's Connect
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    Business Talk brings together thought leaders, academics, and industry experts
                                    for meaningful conversations. Whether you're interested in being a guest,
                                    have feedback, or want to explore partnership opportunities, reach out to us.
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
                                        <p className="text-gray-600">contact@businesstalk.com</p>
                                        <p className="text-gray-600">deepak@deepakbbhatt.com</p>
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
                                        <p className="text-gray-600">Global - Virtual Studio</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pt-8 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a
                                        href="https://www.youtube.com/@businesstalkwithdeepakbhatt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        <Youtube className="w-6 h-6" />
                                    </a>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                                    >
                                        <Twitter className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>

                            {/* Guest Pitch Box */}
                            <div className="bg-gradient-to-br from-maroon-50 to-maroon-100 rounded-xl p-6 mt-8">
                                <h3 className="font-bold text-maroon-900 mb-3">Want to Be a Guest?</h3>
                                <p className="text-maroon-700 text-sm leading-relaxed">
                                    We're always looking for thought leaders, researchers, and industry experts
                                    to share their insights on Business Talk. If you have expertise in business,
                                    technology, leadership, or academia, we'd love to hear from you!
                                </p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 heading-serif">
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
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="guest">Guest Inquiry</option>
                                            <option value="partnership">Partnership Opportunity</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="sponsorship">Sponsorship</option>
                                            <option value="other">Other</option>
                                        </select>
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

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 heading-serif text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'How can I become a guest on Business Talk?',
                                a: 'Send us a message through our contact form with the subject "Guest Inquiry". Include your background, expertise, and potential topics you can discuss. Our team reviews all submissions and will reach out if there\'s a fit.',
                            },
                            {
                                q: 'Where can I watch or listen to the podcast?',
                                a: 'Business Talk is available on YouTube, Spotify, Apple Podcasts, and Amazon Music. You can also find all episodes on our main website.',
                            },
                            {
                                q: 'Do you accept sponsorships?',
                                a: 'Yes, we partner with brands that align with our mission of bringing valuable business insights to our audience. Contact us with the subject "Sponsorship" for more information.',
                            },
                            {
                                q: 'How often are new episodes released?',
                                a: 'We release new episodes weekly, typically on Wednesdays. Subscribe to our newsletter or YouTube channel to get notified about new releases.',
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-md"
                            >
                                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
