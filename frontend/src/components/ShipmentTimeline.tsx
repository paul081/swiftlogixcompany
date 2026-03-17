'use client';

import React from 'react';
import { CheckCircle2, Circle, MapPin, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface ShipmentTimelineProps {
  history: TimelineEvent[];
  currentStatus: string;
}

export default function ShipmentTimeline({ history, currentStatus }: ShipmentTimelineProps) {
  const workflow = [
    'Register/Creating',
    'Sort',
    'Dispatch',
    'Transit',
    'Customs',
    'Destination Hub',
    'Out for Delivery',
    'Delivered'
  ];

  const currentIndex = workflow.indexOf(currentStatus);

  return (
    <div className="space-y-12">
      {/* Visual Progress Bar */}
      <div className="relative px-6 py-10 logistics-card overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800/10" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(Math.max(0, currentIndex) / (workflow.length - 1)) * 100}%` }}
          className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        />
        
        <div className="flex justify-between items-start">
          {workflow.map((step, i) => {
            const isCompleted = i <= currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div key={step} className="flex flex-col items-center gap-4 relative z-10 w-24">
                <div className={`transition-all duration-700 rounded-2xl w-12 h-12 flex items-center justify-center border-2 ${
                  isCurrent ? 'bg-[#FFB800] border-[#FFB800] shadow-[0_0_30px_rgba(255,184,0,0.4)] scale-110' :
                  isCompleted ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 
                  'bg-slate-900 border-slate-800'
                }`}>
                  {isCurrent ? (
                    <Clock className="w-6 h-6 text-slate-950 animate-spin-slow" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-700 fill-slate-900" />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[11px] font-black uppercase tracking-wider text-center leading-none transition-colors duration-500 ${
                    isCurrent ? 'text-[#FFB800]' :
                    isCompleted ? 'text-blue-400' : 
                    'text-slate-600'
                  }`}>
                    {step}
                  </span>
                  {isCurrent && (
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Event List */}
      <div className="space-y-10 relative pl-12 pr-4">
        <div className="absolute left-[1.375rem] top-4 bottom-4 w-px bg-gradient-to-b from-blue-600 via-slate-800 to-transparent" />
        
        {history && history.length > 0 ? (
          [...history].reverse().map((event, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`absolute -left-10 top-2 w-6 h-6 rounded-lg flex items-center justify-center z-10 border-2 transition-all duration-500 ${
                index === 0 
                  ? 'bg-[#FFB800] border-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.5)] scale-125' 
                  : 'bg-slate-900 border-slate-700 group-hover:border-blue-500'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-slate-950' : 'bg-slate-600'}`} />
              </div>
              
              <div className="logistics-card p-8 group-hover:border-blue-500/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h5 className={`font-black text-2xl tracking-tight ${index === 0 ? 'text-[#FFB800]' : 'text-white'}`}>
                        {event.status}
                      </h5>
                      {index === 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/40">
                          Latest Update
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                       <span className="flex items-center gap-1.5">
                         <MapPin className="w-3 h-3 text-blue-500" />
                         {event.location}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5 flex flex-col items-center">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Event Date</span>
                       <span className="text-sm font-mono text-blue-400 font-bold tracking-tight">
                         {new Date(event.timestamp).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-400 text-base leading-relaxed font-medium bg-black/10 p-5 rounded-2xl border border-white/5 italic">
                  "{event.description || `The package has safely transitioned to the ${event.status} stage.`}"
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="logistics-card p-12 text-center border-dashed opacity-50">
            <Info className="w-10 h-10 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Awaiting Network Telemetry</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
