'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    MapPin, 
    Globe, 
    Home, 
    Timer, 
    Search, 
    Briefcase,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServicesModal() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleHashChange = () => {
            setIsOpen(window.location.hash === '#services');
        };
        
        // Check hash on mount
        handleHashChange();
        
        // Listen for changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const closeModal = () => {
        window.location.hash = '';
    };

    const services = [
        {
            icon: <MapPin className="w-6 h-6 text-[#FFB800]" />,
            title: "Local Delivery",
            description: "Same-day and next-day delivery within your city limits."
        },
        {
            icon: <Globe className="w-6 h-6 text-[#FFB800]" />,
            title: "Global Shipping",
            description: "Worldwide heavy freight and small package delivery."
        },
        {
            icon: <Home className="w-6 h-6 text-[#FFB800]" />,
            title: "Warehousing",
            description: "Secure storage with 24/7 inventory management."
        },
        {
            icon: <Timer className="w-6 h-6 text-[#FFB800]" />,
            title: "Express Delivery",
            description: "Urgent red-eye deliveries handled with top priority."
        },
        {
            icon: <Search className="w-6 h-6 text-[#FFB800]" />,
            title: "Real-Time Tracking",
            description: "Micro-second telemetry tracing for full visibility."
        },
        {
            icon: <Briefcase className="w-6 h-6 text-[#FFB800]" />,
            title: "Business Logistics",
            description: "Tailored continuous solutions for bulk corporations."
        }
    ];

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
                        onClick={closeModal}
                    />
                    
                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        className="relative w-full max-w-5xl bg-[#0a1222] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-[#0a1222] p-8 md:p-10 flex justify-between items-start shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-500/30">
                                    <CheckCircle2 className="w-4 h-4" /> Comprehensive Solutions
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                    Our Global <span className="text-blue-500">Logistics Services</span>
                                </h2>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="relative z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-950">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FFB800]/10 group-hover:border-[#FFB800]/30 transition-colors">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">{service.title}</h3>
                                        <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="bg-[#0a1222] p-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0">
                            <div>
                                <h4 className="text-white font-black text-lg">Need a customized delivery solution?</h4>
                                <p className="text-slate-500 text-sm">Reach out to our experts for a personalized freight quote today.</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        window.location.hash = '';
                                        router.push('/');
                                    }}
                                    className="px-6 py-3 font-bold text-slate-300 hover:text-white transition-colors"
                                >
                                    Track Package
                                </button>
                                <a 
                                    href="mailto:swift.wideworldlogistics@gmail.com"
                                    className="px-8 py-3 bg-[#FFB800] text-slate-950 font-black rounded-xl hover:bg-[#FFD600] transition-colors shadow-[0_0_20px_rgba(255,184,0,0.3)] flex items-center gap-2"
                                >
                                    Contact Support <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
