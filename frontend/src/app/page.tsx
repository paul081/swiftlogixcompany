'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Search, Package, MapPin, Clock, CheckCircle2, 
  ArrowRight, Globe, ShieldCheck, Box, TrendingUp,
  AlertCircle, Loader2, Navigation, Info, DollarSign, Shield
} from 'lucide-react';
import { shipmentService } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ShipmentTimeline from '@/components/ShipmentTimeline';

function TrackingContent({ hideHero = false }: { hideHero?: boolean }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  const performTrack = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setShipment(null);
    try {
      const data = await shipmentService.track(id.toUpperCase().trim());
      setShipment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tracking number not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(trackingNumber);
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingNumber(id);
      performTrack(id);
    }
  }, [searchParams]);

  const getWorkflowProgress = (status: string) => {
    const workflow = ['Pending', 'Transit', 'Sorting Hub', 'Warehouse', 'Pending Pickup', 'Delivered'];
    const index = workflow.indexOf(status);
    return Math.max(0, ((index + 1) / workflow.length) * 100);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero Section */}
      {!hideHero && (
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <img 
               src="/logistics_hero_concept_1773424622872.png" 
               alt="Global Logistics Hub"
               className="w-full h-full object-cover opacity-40 scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/60 to-transparent" />
             <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-5xl mx-auto w-full"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Globe className="w-4 h-4 animate-pulse" /> Global Supply Chain Excellence
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tight leading-[0.9] gradient-text">
              Real-time Global <br />
              <span className="text-blue-500">Logistics Control</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Experience pinpoint accuracy with SwiftLogix. Track your international shipments across 180+ countries with millisecond status updates.
            </p>
            
            <form onSubmit={handleTrack} className="relative max-w-3xl mx-auto group mb-20 px-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., SLX7890ABC12)"
                    className="w-full bg-[#0a1222]/90 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[2rem] py-6 px-8 pl-14 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all text-xl shadow-2xl"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 w-6 h-6 z-20" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FFB800] hover:bg-[#FFD600] text-slate-950 px-12 py-6 rounded-2xl md:rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,184,0,0.3)] disabled:opacity-50 active:scale-95 text-lg whitespace-nowrap"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-950" /> : <><Navigation className="w-5 h-5 fill-slate-950" /> Trace Now</>}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-16 mt-10">
              {[
                { label: 'Shipments Tracked', value: '4.2M+' },
                { label: 'Delivery Accuracy', value: '99.9%' },
                { label: 'Global Carriers', value: '450+' },
                { label: 'Uptime Reliability', value: '100%' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            
            {error && <p className="text-red-400 mt-12 font-bold flex items-center justify-center gap-2 bg-red-500/10 py-3 px-6 rounded-full w-fit mx-auto border border-red-500/20"><AlertCircle className="w-4 h-4" /> {error}</p>}
          </motion.div>
        </section>
      )}

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {shipment ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Main Status Card */}
              <div className="logistics-card p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Package className="w-80 h-80 -rotate-12 translate-x-32 -translate-y-32" />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20 border-b border-white/5 pb-16">
                   <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Telemetry Active</span>
                        <div className="h-px w-12 bg-blue-500/30" />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase font-sans">
                        {shipment.trackingNumber}
                      </h2>
                   </div>
                   <div className="bg-[#FFB800] rounded-[2rem] p-8 flex items-center gap-8 shadow-[0_15px_50px_rgba(255,184,0,0.2)] group transition-all hover:scale-105">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">Live Shipment Status</span>
                        <span className="text-3xl font-black text-slate-950 leading-none uppercase tracking-tighter">{shipment.shipmentStatus}</span>
                      </div>
                      <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl">
                         <TrendingUp className="w-7 h-7 text-[#FFB800]" />
                      </div>
                   </div>
                </div>

                {/* Custom Shipment Timeline Component */}
                <div className="mb-24">
                   <div className="flex items-center gap-4 mb-12">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                         <Navigation className="w-5 h-5 text-blue-500" />
                      </div>
                      <h4 className="text-2xl font-black tracking-tight">Supply Chain Workflow</h4>
                   </div>
                   <ShipmentTimeline 
                     history={shipment.history || []} 
                     currentStatus={shipment.shipmentStatus} 
                   />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                   {/* Logistics Details */}
                   <div className="space-y-10">
                      <div className="bg-[#0a1222]/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-2xl">
                         <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                           <Globe className="w-4 h-4" /> Global Routing Path
                         </h5>
                         <div className="space-y-12 relative">
                            <div className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 to-emerald-500" />
                            <div className="flex gap-8 relative group">
                               <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                                  <MapPin className="w-5 h-5 text-white" />
                               </div>
                               <div>
                                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Origin Hub</p>
                                  <p className="font-black text-2xl text-white leading-tight">{shipment.senderAddress}</p>
                               </div>
                            </div>
                            <div className="flex gap-8 relative group">
                               <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                                  <Navigation className="w-5 h-5 text-white" />
                               </div>
                               <div>
                                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Geo-Location</p>
                                  <p className="font-black text-2xl text-emerald-400 leading-tight">{shipment.currentLocation}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="bg-[#0a1222]/40 rounded-3xl p-8 border border-white/5 hover:border-blue-500/20 transition-all">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Certified Weight</p>
                            <p className="text-3xl font-black font-mono text-white">{shipment.packageWeight || '12.5 kg'}</p>
                         </div>
                         <div className="bg-[#0a1222]/40 rounded-3xl p-8 border border-white/5 hover:border-blue-500/20 transition-all">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Freight Class</p>
                            <p className="text-3xl font-black text-white truncate">{shipment.packageType || 'Secured Box'}</p>
                         </div>
                      </div>
                   </div>

                   {/* Activity Timeline */}
                   <div className="bg-[#0a1222]/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-2xl">
                      <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                        <Clock className="w-4 h-4" /> Live Network Telemetry
                      </h5>
                      <div className="space-y-12 relative max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                         <div className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-slate-800/50" />
                         {shipment.history && [...shipment.history].reverse().map((log: any, i: number) => (
                           <div key={i} className="flex gap-8 relative group">
                             <div className={`w-11 h-11 rounded-2xl flex items-center justify-center z-10 border-2 transition-all duration-300 ${i === 0 ? 'bg-[#FFB800] border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.3)] scale-110' : 'bg-slate-900 border-slate-800'}`}>
                                <CheckCircle2 className={`w-5 h-5 ${i === 0 ? 'text-slate-950' : 'text-slate-600'}`} />
                             </div>
                             <div className="flex-1 pb-6 border-b border-white/5">
                                <div className="flex justify-between items-start mb-3">
                                   <p className={`font-black text-xl leading-none tracking-tight uppercase ${i === 0 ? 'text-[#FFB800]' : 'text-white'}`}>{log.status}</p>
                                   <span className="text-[10px] text-blue-400 font-black font-mono tracking-tighter bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                                     {new Date(log.timestamp).toLocaleDateString()}
                                   </span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                   <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{log.location}</p>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed italic bg-black/10 p-4 rounded-xl border border-white/5">
                                   "{log.description || `Automatic log entry for network transition to ${log.status}.`}"
                                </p>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Financial Visibility Section */}
              {shipment.showFinancials && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16 p-10 bg-[#FFB800]/5 rounded-[3rem] border border-[#FFB800]/20 relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                      <DollarSign className="w-64 h-64" />
                   </div>

                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-16 h-16 bg-[#FFB800] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#FFB800]/40">
                         <DollarSign className="w-8 h-8 text-slate-900" />
                      </div>
                      <div>
                         <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Fiscal Telemetry Hub</h4>
                         <p className="text-xs font-black text-[#FFB800] uppercase tracking-[0.4em]">Official Financial Node Entry</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                         { label: 'Customs Duties', value: shipment.customsFees, icon: ShieldCheck },
                         { label: 'Asset Insurance', value: shipment.insuranceFees, icon: Shield },
                         { label: 'Operational Charges', value: shipment.deliveryCharges, icon: Navigation },
                         { label: 'Storage Node Fees', value: shipment.storageFees, icon: Box }
                      ].map((fee, idx) => (
                         <div key={idx} className="bg-[#0a1222]/80 p-8 rounded-[2rem] border border-white/5 group hover:border-[#FFB800]/30 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                               <fee.icon className="w-4 h-4 text-[#FFB800]" />
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{fee.label}</span>
                            </div>
                            <p className="text-3xl font-black text-white tracking-tighter">${Number(fee.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                         </div>
                      ))}
                   </div>

                   <div className="mt-12 pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-4 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10">
                         <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                         <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Validated Fiscal Registry</p>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aggregate Liability:</p>
                         <p className="text-5xl font-black text-[#FFB800] tracking-tighter">
                           ${(
                             Number(shipment.customsFees || 0) + 
                             Number(shipment.insuranceFees || 0) + 
                             Number(shipment.deliveryCharges || 0) + 
                             Number(shipment.storageFees || 0)
                           ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </p>
                      </div>
                   </div>
                </motion.div>
              )}

              {/* Company Info Footer Support */}
              <div className="bg-blue-600 rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                 <h4 className="text-3xl font-black mb-4">Need help with this shipment?</h4>
                 <p className="text-blue-100 mb-8 max-w-xl mx-auto font-medium">Contact our 24/7 Global Logistics Support Team for real-time human assistance with your delivery.</p>
                 <button className="bg-white text-blue-600 px-12 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl shadow-blue-900/40">
                    Contact Support
                 </button>
              </div>
            </motion.div>
          ) : (
            !hideHero && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12"
              >
                {[
                  { icon: ShieldCheck, title: "Secured Global Network", desc: "Every package is insured and tracked via our encrypted backbone." },
                  { icon: Clock, title: "Precision Scheduling", desc: "Real-time ETA adjustments based on weather and customs data." },
                  { icon: Box, title: "Eco-Friendly Logistics", desc: "Optimized routing to reduce carbon footprint on every delivery." }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] hover:bg-slate-800/30 transition-all hover:translate-y-[-5px]">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                      <item.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <h5 className="text-xl font-black mb-3">{item.title}</h5>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

export default function Home(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>}>
      <TrackingContent {...props} />
    </Suspense>
  );
}
