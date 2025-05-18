import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFooter } from '@/hooks/useFooter';
import { Loader2 } from 'lucide-react';

/**
 * Footer Component
 * 
 * This component displays the website footer with:
 * - Dynamic content from API
 * - Animated elements using Framer Motion
 * - Company information
 * - Navigation links
 * - Loading and error states
 * 
 * @returns {JSX.Element} The rendered footer
 */
const Footer = () => {
    const { data, isLoading, error } = useFooter();

    if (isLoading) {
        return (
            <footer className="bg-[#EEF7FF] pt-20 pb-6 relative z-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </div>
            </footer>
        );
    }

    if (error || !data) {
        return (
            <footer className="bg-[#EEF7FF] pt-20 pb-6 relative z-0">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500">
                        {error || 'Failed to load footer content'}
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-[#EEF7FF] pt-20 pb-6 relative z-0">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-full -z-10 bg-gradient-to-t from-[#BEDCF8] via-[#BEDCF8]/60 to-[#D6C0FF]"
            />
            <div className="container mx-auto px-4">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="md:col-span-4"
                    >
                        <Link to="/" className="block mb-4">
                            <img
                                src="/icons/logo.svg"
                                alt="Rocketry Box"
                                className="h-12"
                            />
                        </Link>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-sm text-gray-600 space-y-2"
                        >
                            <p className="font-semibold">{data.company.name}</p>
                            <p>
                                <span className="font-medium text-foreground">
                                    Registered Office:
                                </span>
                                {data.company.address}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">
                                    CIN:
                                </span> {data.company.cin}</p>
                            <p>
                                <span className="font-medium text-foreground">
                                    Email:
                                </span>
                                {data.company.emails.map((email, index) => (
                                    <span key={email}>
                                        <a href={`mailto:${email}`} className="hover:text-gray-900">
                                            {email}
                                        </a>
                                        {index < data.company.emails.length - 1 ? ' | ' : ''}
                                    </span>
                                ))}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">
                                    Website:
                                </span>
                                {data.company.websites.map((website, index) => (
                                    <span key={website}>
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                                            {website.replace(/^https?:\/\//, '')}
                                        </a>
                                        {index < data.company.websites.length - 1 ? ' | ' : ''}
                                    </span>
                                ))}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Footer Sections */}
                    {Object.entries(data.sections).map(([key, section], sectionIndex) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 * (sectionIndex + 1) }}
                            className="md:col-span-2"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link, index) => (
                                    <motion.li
                                        key={`${link.to}-${link.label}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link to={link.to} className="text-gray-600 hover:text-gray-900 transition-colors">
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            @ {new Date().getFullYear()} {data.company.name}. All Rights Reserved
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">
                                Design & Developed By
                            </span>
                            <Link to="https://www.aerwok.com/" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/icons/aerwok.png"
                                    alt="Aerwok"
                                    className="h-6"
                                />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer; 