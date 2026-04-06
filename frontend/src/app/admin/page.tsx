'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Package, TrendingUp, Clock, CheckCircle2,
  MapPin, Search, Plus, Trash2, Edit2, Shield,
  ChevronRight, LogOut, LayoutDashboard, History,
  AlertCircle, ArrowUpRight, Filter, Globe, Navigation,
  DollarSign, ShieldCheck
} from 'lucide-react';
import { shipmentService, adminService, authService } from '@/services/api';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data State
  const [shipments, setShipments] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'status' | 'user' | 'billing'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    senderName: '', senderAddress: '',
    receiverName: '', receiverEmail: '', receiverAddress: '',
    packageWeight: '', packageType: 'Standard',
    originCountry: '', destinationCountry: '', currentLocation: '',
    status: 'Register/Creating', location: '', description: '',
    // User fields
    userName: '', userEmail: '', userPhone: '',
    userAddress: '', userRole: 'user', userActive: true,
    userPassword: '',
    // Financials
    customsFees: 0, insuranceFees: 0, deliveryCharges: 0,
    storageFees: 0, showFinancials: false
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shipData = await shipmentService.getAllShipments() as any[];
      const userData = await adminService.getUsers() as any[];

      setShipments(shipData);
      setUsersList(userData);

      // Calculate Stats
      const stats = {
        total: shipData.length,
        inTransit: shipData.filter((s: any) => s.shipmentStatus === 'In Transit').length,
        delivered: shipData.filter((s: any) => s.shipmentStatus === 'Delivered').length,
        pending: shipData.filter((s: any) => s.shipmentStatus === 'Pending').length
      };
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shipmentService.createShipment(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to create shipment');
    }
  };

  const handleDeleteShipment = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      await shipmentService.deleteShipment(id);
      fetchData();
    }
  };

  const suggestNextStage = (currentStatus: string) => {
    const workflow = ['Register/Creating', 'Sort', 'Dispatch', 'Transit', 'Customs', 'Destination Hub', 'Out for Delivery', 'Delivered'];
    const currentIndex = workflow.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < workflow.length - 1) {
      return workflow[currentIndex + 1];
    }
    return currentStatus;
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shipmentService.updateStatus(selectedItem.id, {
        status: formData.status,
        location: formData.location || 'Hub Processing',
        description: formData.description || `Package moved to ${formData.status} at ${formData.location || 'Lagos Hub'}`
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedItem.id, {
        name: formData.userName,
        email: formData.userEmail,
        phone: formData.userPhone,
        address: formData.userAddress,
        role: formData.userRole,
        isActive: formData.userActive,
        password: formData.userPassword || undefined
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleUpdateFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shipmentService.updateFinancials(selectedItem.id, {
        customsFees: formData.customsFees,
        insuranceFees: formData.insuranceFees,
        deliveryCharges: formData.deliveryCharges,
        storageFees: formData.storageFees,
        showFinancials: formData.showFinancials
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to update financials');
    }
  };

  const renderStatCard = (title: string, value: number, icon: any, color: string) => (
    <div className="logistics-card p-8 group hover:border-blue-500/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color.replace('bg-', 'bg-')}/10 shadow-lg border border-white/5`}>
          {React.createElement(icon, { className: `w-7 h-7 ${color.replace('bg-', 'text-')}` })}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Live Telemetry</span>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tight leading-none">Healthy</span>
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      {/* Sidebar */}
      <aside className="w-80 glass-panel p-8 hidden lg:flex flex-col gap-10 border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">SwiftLogix</span>
            <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest leading-none">Admin Command</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Systems Hub' },
            { id: 'shipments', icon: Package, label: 'Registry' },
            { id: 'simulator', icon: Navigation, label: 'Simulator' },
            { id: 'users', icon: Users, label: 'Personnel' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-14 overflow-y-auto max-h-screen custom-scrollbar bg-dot-pattern">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Administrator Session: High Authority</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 gradient-text">Network Overview</h1>
            <p className="text-slate-400 text-lg font-medium">Monitoring <span className="text-blue-500 font-black">{statistics.total}</span> active nodes across the global supply chain.</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { setModalType('create'); setFormData({ ...formData, senderName: '' }); setIsModalOpen(true); }}
              className="bg-[#FFB800] hover:bg-[#FFD600] text-slate-950 px-8 py-5 rounded-2xl font-black transition-all flex items-center gap-3 shadow-[0_10px_40px_rgba(255,184,0,0.3)] group active:scale-95"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Register New Shipment
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {renderStatCard('Total Volume', statistics.total, Package, 'bg-blue-600')}
              {renderStatCard('In-Transit', statistics.inTransit, TrendingUp, 'bg-[#FFB800]')}
              {renderStatCard('Delivered', statistics.delivered, CheckCircle2, 'bg-emerald-600')}
              {renderStatCard('Pending Prep', statistics.pending, Clock, 'bg-slate-700')}
            </div>

            {/* Recent Activity / Mini Table placeholder */}
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">System Overview</h3>
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic">
                Live traffic visualization module coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Manage Shipments</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  placeholder="Filter tracking ID..."
                  className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-800/20 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Tracking ID</th>
                  <th className="px-6 py-4">Sender/Receiver</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="px-6 py-6">
                      <div className="font-mono text-blue-400 font-bold">{s.trackingNumber}</div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Created {new Date(s.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm">
                        <span className="text-slate-500">From:</span> {s.senderName}
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-slate-500">To:</span> {s.receiverName} ({s.receiverEmail})
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.shipmentStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          s.shipmentStatus === 'In Transit' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        {s.shipmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="w-3 h-3 text-blue-500" /> {s.currentLocation}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const next = suggestNextStage(s.shipmentStatus);
                            setSelectedItem(s);
                            setModalType('status');
                            setFormData({
                              ...formData,
                              status: next,
                              location: s.currentLocation,
                              description: `Package arrived at ${next}`
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all"
                          title="Move Shipment"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(s);
                            setModalType('billing');
                            setFormData({
                              ...formData,
                              customsFees: s.customsFees || 0,
                              insuranceFees: s.insuranceFees || 0,
                              deliveryCharges: s.deliveryCharges || 0,
                              storageFees: s.storageFees || 0,
                              showFinancials: s.showFinancials || false
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-[#FFB800]/10 hover:bg-[#FFB800] text-[#FFB800] hover:text-slate-900 rounded-lg transition-all"
                          title="Financial Oversight"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShipment(s.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div className="bg-[#0a1222] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                <Navigation className="w-64 h-64 rotate-45" />
              </div>

              <header className="mb-12 relative z-10">
                <h2 className="text-4xl font-black tracking-tighter mb-4">Operations <span className="text-[#FFB800]">Simulator</span></h2>
                <p className="text-slate-400 font-medium max-w-2xl">High-authority override tool for manual shipment traversal. Direct telemetry injection into the global tracking registry.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Selection Area */}
                <div className="space-y-8">
                  <div className="logistics-card p-8 !bg-slate-900/40">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 block">Select Node for Simulation</label>
                    <select
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 font-black text-white focus:ring-2 focus:ring-[#FFB800] transition-all"
                      onChange={(e) => {
                        const s = shipments.find(ship => ship.id === e.target.value);
                        setSelectedItem(s);
                        if (s) {
                          setFormData({
                            ...formData,
                            status: suggestNextStage(s.shipmentStatus),
                            location: s.currentLocation,
                            description: `Automated trajectory update: Package entering ${suggestNextStage(s.shipmentStatus)} phase.`
                          });
                        }
                      }}
                      value={selectedItem?.id || ''}
                    >
                      <option value="">-- Active Waybills --</option>
                      {shipments.map(s => (
                        <option key={s.id} value={s.id}>{s.trackingNumber} | {s.shipmentStatus}</option>
                      ))}
                    </select>
                  </div>

                  {selectedItem && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="logistics-card p-8 border-l-4 border-l-blue-600"
                    >
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Target Telemetry</h4>
                      <div className="space-y-3">
                        <p className="font-black text-2xl text-white">{selectedItem.trackingNumber}</p>
                        <div className="flex gap-4">
                          <span className="text-xs font-bold text-slate-400">Status: <span className="text-blue-400 font-black">{selectedItem.shipmentStatus}</span></span>
                          <span className="text-xs font-bold text-slate-400">Node: <span className="text-emerald-400 font-black">{selectedItem.currentLocation}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Controls Area */}
                <div className="space-y-8">
                  {selectedItem ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateStatus(e); }} className="logistics-card p-8 space-y-6 !bg-[#FFB800]/5 border-[#FFB800]/20">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest">Injected Trajectory Status</label>
                        <select
                          className="modal-input !bg-slate-950/80 !border-[#FFB800]/30 font-black"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="Register/Creating">Register/Creating</option>
                          <option value="Sort">Sort</option>
                          <option value="Dispatch">Dispatch</option>
                          <option value="Transit">Transit</option>
                          <option value="Customs">Customs</option>
                          <option value="Destination Hub">Destination Hub</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest">Override Location</label>
                        <input
                          className="modal-input !bg-slate-950/80 !border-[#FFB800]/30"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="New Hub Location..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest">Ops Log Entry</label>
                        <textarea
                          className="modal-input !bg-slate-950/80 !border-[#FFB800]/30 h-24 pt-4 text-xs font-medium"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#FFB800] hover:bg-[#FFD600] text-slate-950 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,184,0,0.2)] active:scale-95"
                      >
                        <Navigation className="w-5 h-5 fill-current" /> Execute Movement
                      </button>
                    </form>
                  ) : (
                    <div className="h-full logistics-card flex items-center justify-center border-dashed opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Awaiting Target Selection</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold">Registered Users</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-800/20 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Name/Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="px-6 py-6">
                      <div className="font-bold">{u.name}</div>
                      <div className="text-slate-500 text-sm">{u.email}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.status === false || u.isActive === false
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                        {u.status === false || u.isActive === false ? 'Deactivated' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {u.role === 'admin' ? <Shield className="w-3 h-3 text-blue-500" /> : <div className="w-3 h-3 rounded-full bg-slate-600" />}
                        <span className={`text-xs font-bold uppercase ${u.role === 'admin' ? 'text-blue-400' : 'text-slate-500'}`}>{u.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(u);
                            setModalType('user');
                            setFormData({
                              ...formData,
                              userName: u.name,
                              userEmail: u.email,
                              userPhone: u.phone || '',
                              userAddress: u.address || '',
                              userRole: u.role,
                              userActive: u.isActive !== false,
                              userPassword: ''
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-2xl w-full p-8 rounded-[40px] z-50 shadow-2xl relative border border-slate-700/50"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 capitalize">
                {modalType === 'create' && <><Plus className="text-blue-500" /> Create Shipment</>}
                {modalType === 'status' && <><History className="text-blue-500" /> Update Movement</>}
                {modalType === 'billing' && <><DollarSign className="text-[#FFB800]" /> Financial Oversight</>}
                {modalType === 'user' && <><Users className="text-blue-500" /> Edit User Account</>}
              </h2>

              <form onSubmit={
                modalType === 'create' ? handleCreateShipment :
                  modalType === 'status' ? handleUpdateStatus :
                    modalType === 'billing' ? handleUpdateFinancials :
                      handleUpdateUser
              } className="space-y-6">
                {modalType === 'create' ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                      <h4 className="text-blue-400 font-bold text-xs uppercase">Sender Info</h4>
                      <input
                        placeholder="Sender Name"
                        className="modal-input"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        required
                      />
                      <input
                        placeholder="Sender Address"
                        className="modal-input"
                        value={formData.senderAddress}
                        onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-4 col-span-2 md:col-span-1">
                      <h4 className="text-blue-400 font-bold text-xs uppercase">Receiver Info</h4>
                      <input
                        placeholder="Receiver Name"
                        className="modal-input"
                        value={formData.receiverName}
                        onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                        required
                      />
                      <input
                        placeholder="Receiver Email (for User Dashboard)"
                        className="modal-input"
                        value={formData.receiverEmail}
                        onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                        required
                      />
                      <input
                        placeholder="Receiver Address"
                        className="modal-input"
                        value={formData.receiverAddress}
                        onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Package Weights</label>
                        <input
                          placeholder="e.g. 5kg"
                          className="modal-input"
                          value={formData.packageWeight}
                          onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                        <select
                          className="modal-input appearance-none"
                          value={formData.packageType}
                          onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                        >
                          <option>Standard</option>
                          <option>Express</option>
                          <option>Priority</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Origin Country</label>
                        <input
                          placeholder="Nigeria"
                          className="modal-input"
                          value={formData.originCountry}
                          onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Destination</label>
                        <input
                          placeholder="United States"
                          className="modal-input"
                          value={formData.destinationCountry}
                          onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Starting Hub</label>
                        <input
                          placeholder="Lagos Warehouse"
                          className="modal-input"
                          value={formData.currentLocation}
                          onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : modalType === 'status' ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Updating Shipment</p>
                      <p className="font-mono text-xl text-blue-400">{selectedItem?.trackingNumber}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">New Status</label>
                        <select
                          className="modal-input"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="Register/Creating">Register/Creating</option>
                          <option value="Sort">Sort</option>
                          <option value="Dispatch">Dispatch</option>
                          <option value="Transit">Transit</option>
                          <option value="Customs">Customs</option>
                          <option value="Destination Hub">Destination Hub</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Current Location</label>
                        <input
                          placeholder="Distribution Center / City"
                          className="modal-input"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Description (Optional)</label>
                      <textarea
                        placeholder="Details about the movement..."
                        className="modal-input h-24 pt-4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                ) : modalType === 'billing' ? (
                  <div className="space-y-8">
                    <div className="p-6 bg-[#FFB800]/5 rounded-[2rem] border border-[#FFB800]/20 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Waybill</p>
                        <p className="font-black text-2xl text-white tracking-tight">{selectedItem?.trackingNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest mb-1">Global Visibility</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, showFinancials: !formData.showFinancials })}
                          className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all border ${formData.showFinancials
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-white/5'
                            }`}
                        >
                          {formData.showFinancials ? 'Live For Users' : 'Hidden From Users'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customs Fees ($)</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={formData.customsFees}
                          onChange={(e) => setFormData({ ...formData, customsFees: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurance ($)</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={formData.insuranceFees}
                          onChange={(e) => setFormData({ ...formData, insuranceFees: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delivery Charges ($)</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={formData.deliveryCharges}
                          onChange={(e) => setFormData({ ...formData, deliveryCharges: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Storage Fees ($)</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={formData.storageFees}
                          onChange={(e) => setFormData({ ...formData, storageFees: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-3 h-3" /> Audit Information
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Any changes to financial fields will be logged and timestamped. Users will be notified if visibility is strictly toggled on.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                        <input
                          className="modal-input"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                        <input
                          className="modal-input"
                          value={formData.userEmail}
                          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                        <input
                          className="modal-input"
                          value={formData.userPhone}
                          onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Account Role</label>
                        <select
                          className="modal-input"
                          value={formData.userRole}
                          onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                        >
                          <option value="user">Regular User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Shipping Address</label>
                      <textarea
                        className="modal-input h-20 pt-3"
                        value={formData.userAddress}
                        onChange={(e) => setFormData({ ...formData, userAddress: e.target.value })}
                      />
                    </div>

                    <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 space-y-4">
                      <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> Security & Status
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Reset Password (leave blank to keep current)</label>
                          <input
                            type="password"
                            placeholder="New password..."
                            className="modal-input"
                            value={formData.userPassword}
                            onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Account Status</label>
                          <select
                            className="modal-input"
                            value={formData.userActive ? 'active' : 'inactive'}
                            onChange={(e) => setFormData({ ...formData, userActive: e.target.value === 'active' })}
                          >
                            <option value="active">Active Account</option>
                            <option value="inactive">Deactivated</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-700 hover:bg-slate-800 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/30"
                  >
                    Confirm Action
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
