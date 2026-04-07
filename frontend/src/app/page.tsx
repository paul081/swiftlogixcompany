'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Search, Package, MapPin, Clock, CheckCircle2, 
  ArrowRight, Globe, ShieldCheck, Box, TrendingUp,
  AlertCircle, Loader2, Navigation, Info, DollarSign, Shield
} from 'lucide-react';
import { shipmentService } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import ShipmentTimeline from '@/components/ShipmentTimeline';
import { trackShipmentAction } from '@/lib/actions';

function LandingPage({ onTrack }: { onTrack: (id: string) => void }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const router = useRouter();

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-20 pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-8xl font-black text-[#005a82] leading-[0.85] tracking-tighter mb-10">
              Effortless Logistics, <br />
              <span className="text-blue-600">Every Step of the Way.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-xl mb-12 font-medium leading-relaxed">
              Manage your shipments, track in real-time, and get the best rates—all from one platform. Global coverage with millisecond precision.
            </p>
            
            <div className="max-w-xl mb-12">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const id = formData.get('trackingNumber') as string;
                  if (id) {
                    router.push(`/?id=${id.toUpperCase().trim()}`);
                  }
                }}
                className="relative group mr-4"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
                <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl p-2 focus-within:border-blue-500 transition-all">
                  <div className="pl-6 pointer-events-none">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="trackingNumber"
                    autoFocus
                    placeholder="Enter Tracking ID (e.g. SLX7890ABC12)"
                    className="block w-full bg-transparent border-0 py-4 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:ring-0 font-bold text-lg"
                  />
                  <button 
                    type="submit"
                    className="bg-[#005a82] hover:bg-[#004a6b] text-white px-8 py-4 rounded-xl font-black transition-all shadow-xl shadow-blue-900/10 active:scale-95 whitespace-nowrap"
                  >
                    Track Now
                  </button>
                </div>
              </form>
              <p className="mt-4 text-sm text-slate-400 font-medium ml-2">
                <span className="text-blue-600 font-black tracking-widest uppercase text-[10px] mr-3">Trending:</span> 
                <span className="cursor-pointer hover:text-blue-600 underline font-bold" onClick={() => setTrackingNumber('SLX7890ABC12')}>SLX7890ABC12</span>
              </p>
            </div>

            <div className="flex items-center gap-10">
              <div>
                <p className="text-4xl font-black text-[#005a82]">10k+</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Deliveries</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-4xl font-black text-[#005a82]">98%</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Success Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-blue-100 rounded-full blur-[100px] opacity-50 -z-10" />
            <img 
              src="/legacy_hero.png" 
              alt="Logistics Professional" 
              className="w-full h-auto rounded-[3rem] shadow-[0_50px_100px_rgba(0,40,80,0.1)] relative z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-[#005a82] mb-6 tracking-tighter">Premium Logistics Solutions</h2>
            <div className="w-20 h-2 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: MapPin, title: "Real-Time Tracking", desc: "Track every shipment in real-time with granular telemetry data and instant notifications." },
              { icon: Globe, title: "Global Network", desc: "Access 450+ hub locations and international carriers across 180+ countries worldwide." },
              { icon: ShieldCheck, title: "Risk Management", desc: "Every parcel is double-insured and monitored by our automated safety AI." }
            ].map((s, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/5 hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                  <s.icon className="w-8 h-8 text-[#005a82]" />
                </div>
                <h3 className="text-2xl font-black text-[#005a82] mb-4">{s.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TrackingContent({ id }: { id: string }) {
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const performTrack = async (trackId: string) => {
    if (!trackId) return;
    setLoading(true);
    setError('');
    setShipment(null);
    try {
      const { data, error: actionError } = await trackShipmentAction(trackId.toUpperCase().trim());
      
      if (actionError) {
        setError(actionError);
        return;
      }

      setShipment(data);
    } catch (err: any) {
      setError(err.message || 'Tracking number not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) performTrack(id);
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-[#005a82] mx-auto mb-6" />
        <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Scanning Global Network...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white p-6">
      <div className="text-center bg-red-50 p-12 rounded-[3rem] border border-red-100 max-w-xl w-full">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-3xl font-black text-red-900 mb-4 tracking-tighter">Tracking ID Failure</h3>
        <p className="text-red-700 font-medium mb-10">{error}</p>
        <button onClick={() => router.push('/')} className="bg-red-600 text-white px-8 py-4 rounded-xl font-black hover:bg-red-700 transition-all">Try Another ID</button>
      </div>
    </div>
  );

  if (!shipment) return null;

  return (
    <div className="bg-slate-50 py-20 px-6">
       <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl shadow-[#005a8220] border border-slate-100"
          >
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20 border-b border-slate-100 pb-16">
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4 block">Official Tracking Manifest</span>
                  <h2 className="text-4xl md:text-6xl font-black text-[#005a82] tracking-tighter">{shipment.trackingNumber}</h2>
                </div>
                <div className="bg-[#FFB800] px-10 py-6 rounded-3xl shadow-xl shadow-amber-200">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1 opacity-60">Status Dashboard</p>
                  <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{shipment.shipmentStatus}</p>
                </div>
             </div>

             <div className="mb-24 px-10">
                <ShipmentTimeline 
                  history={shipment.history || []} 
                  currentStatus={shipment.shipmentStatus} 
                />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-12">
                   <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#005a82] mb-8">Route Intelligence</h4>
                      <div className="space-y-10 relative">
                        <div className="absolute left-[1.1rem] top-2 bottom-2 w-0.5 bg-blue-200" />
                        <div className="flex gap-6 relative">
                          <div className="w-9 h-9 bg-[#005a82] rounded-xl flex items-center justify-center z-10"><MapPin className="w-5 h-5 text-white" /></div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin Node</p>
                            <p className="font-bold text-slate-900">{shipment.senderAddress}</p>
                          </div>
                        </div>
                        <div className="flex gap-6 relative">
                          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center z-10"><Navigation className="w-5 h-5 text-white" /></div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Geo-Ping</p>
                            <p className="font-bold text-slate-900">{shipment.currentLocation}</p>
                          </div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Weight</p>
                         <p className="text-2xl font-black text-[#005a82]">{shipment.packageWeight || '12.5 kg'}</p>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Package Sig</p>
                         <p className="text-2xl font-black text-[#005a82] truncate">{shipment.packageType || 'Secured Unit'}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Clock className="w-48 h-48" /></div>
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-10">Live Network Telemetry</h4>
                   <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {[...shipment.history].reverse().map((log: any, i: number) => (
                         <div key={i} className="flex gap-6 relative">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center z-10 ${i === 0 ? 'bg-[#FFB800] text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                               <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 pb-6 border-b border-white/5">
                               <div className="flex justify-between mb-2">
                                  <p className={`font-black text-lg ${i === 0 ? 'text-[#FFB800]' : 'text-white'}`}>{log.status}</p>
                                  <span className="text-[10px] text-slate-500 font-bold">{new Date(log.timestamp).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-slate-400 leading-relaxed italic opacity-80">"{log.description || 'System validated status check.'}"</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
       </div>
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        {!trackId ? (
          <LandingPage onTrack={(id) => {
            router.push(`/?id=${id}`);
          }} />
        ) : (
          <TrackingContent id={trackId} />
        )}
      </Suspense>
    </div>
  );
}
