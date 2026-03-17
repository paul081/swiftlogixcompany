'use client';

import React, { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Join SwiftLogix</h1>
          <p className="text-slate-400">Create an account to track your shipments</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input
                  required
                  className="auth-input pl-10"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
              <div className="relative">
                <input
                  required
                  className="auth-input pl-10"
                  placeholder="+1 234..."
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                className="auth-input pl-10"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Default Shipping Address</label>
            <div className="relative">
              <input
                required
                className="auth-input pl-10"
                placeholder="123 Logistics Way..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                className="auth-input pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 shadow-xl shadow-blue-900/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Already have an account? <Link href="/login" className="text-blue-400 hover:underline font-bold">Sign In</Link>
            </p>
          </div>
        </form>
      </motion.div>

      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          color: white;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .auth-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}
