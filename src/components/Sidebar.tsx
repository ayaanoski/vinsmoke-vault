import React from 'react';
import { Shield, LayoutDashboard, CreditCard, History as HistoryIcon, Settings, Plus } from 'lucide-react';
import { motion } from 'motion/react';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard },
        { id: 'vaults', icon: CreditCard },
        { id: 'history', icon: HistoryIcon },
        { id: 'sentinel', icon: Settings },
    ];

    return (
        <>
            {/* Desktop Sidebar (Rail style from reference) */}
            <div className="hidden lg:flex w-20 bg-main-bg min-h-screen flex-col items-center py-10 gap-10 border-r border-border relative z-20 transition-all duration-500">
                {/* Logo - Matches White/Black circle in reference */}
                <div className="w-12 h-12 bg-white rounded-[1.2rem] flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform shadow-2xl">
                    <Shield className="w-6 h-6 text-black fill-black" />
                </div>

                {/* Navigation Icons gathered in a rail */}
                <nav className="flex flex-col gap-5">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 relative group
                                ${activeTab === item.id ? 'bg-surface text-white' : 'text-text-muted hover:text-white hover:bg-surface/50'}`}
                        >
                            <item.icon className="w-5 h-5 transition-transform group-active:scale-90" />
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebarActiveIndicator"
                                    className="absolute -left-1 w-1.5 h-6 bg-accent rounded-full shadow-[0_0_15px_rgba(174,255,0,0.5)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer Plus Action */}
                <div className="mt-auto">
                    <button className="w-12 h-12 bg-surface border border-border rounded-[1.2rem] flex items-center justify-center text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 shadow-xl group">
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar (Ultra Premium Blur) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#0F0F0F]/80 backdrop-blur-3xl border border-white/10 z-[100] px-4 py-3 flex items-center justify-between rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative
                            ${activeTab === item.id ? 'bg-accent text-black scale-110 shadow-[0_0_20px_rgba(174,255,0,0.4)]' : 'text-text-muted'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="mobileActiveGlow"
                                className="absolute inset-0 rounded-full border-2 border-accent/20"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
                <div className="w-px h-6 bg-border mx-1 opacity-20" />
                <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </>
    );
};

export default Sidebar;
