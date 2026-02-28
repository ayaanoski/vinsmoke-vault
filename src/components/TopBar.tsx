import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Search, Lock, Wallet, BarChart3, Shield } from 'lucide-react';

const TopBar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string | any) => void }) => {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    const navItems = [
        { id: 'dashboard', label: 'Check Box', icon: BarChart3 },
        { id: 'sentinel', label: 'Monitoring', icon: BarChart3 },
    ];

    return (
        <div className="flex items-center justify-between mb-6 lg:mb-12 relative z-50 px-0 lg:px-4 shrink-0">
            {/* Mobile Branding - Minimalist & Premium */}
            <div className="lg:hidden flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.2)] border border-white/5">
                    <Shield className="w-5 h-5 text-black fill-black" />
                </div>
                <div className="flex flex-col -space-y-1">
                    <span className="text-white font-black text-xs tracking-widest font-display uppercase italic">Vinsmoke</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                        <span className="text-[8px] text-accent font-black uppercase tracking-[0.2em] opacity-80">Syncing Alpha</span>
                    </div>
                </div>
            </div>

            {/* Center Pill Navigation (Desktop Only) */}
            <div className="hidden lg:flex items-center bg-surface border border-border rounded-full p-1.5 shadow-2xl">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`px-8 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2.5
                            ${activeTab === item.id
                                ? 'bg-white text-black shadow-lg scale-[1.02]'
                                : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                    >
                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Right Profile / Wallet Interaction */}
            <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                {/* Search Circle (Desktop Only) */}
                <button className="hidden lg:flex w-12 h-12 bg-surface border border-border rounded-full items-center justify-center text-text-muted hover:text-white hover:border-white/20 transition-all shadow-xl">
                    <Search className="w-5 h-5" />
                </button>

                {/* Connection Status Indicator */}
                {isConnected && (
                    <div className="flex items-center gap-2 bg-surface/40 lg:bg-transparent p-1 pl-4 rounded-full border border-white/5 lg:border-none">
                        <div className="flex flex-col text-right hidden lg:block mr-2">
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Protocol Active</span>
                            <span className="text-[9px] text-text-muted font-bold uppercase tracking-tight opacity-50">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                        </div>
                        <button
                            onClick={() => disconnect()}
                            className="w-8 h-8 lg:w-11 lg:h-11 bg-surface border border-border rounded-full flex items-center justify-center text-text-muted hover:text-red-500 transition-all shadow-lg group"
                        >
                            <Lock className="w-3 h-3 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                )}

                {!isConnected && (
                    <button
                        onClick={() => {
                            const connector = connectors.find(c => c.name === 'MetaMask') || connectors[0];
                            if (connector) connect({ connector });
                        }}
                        className="bg-accent text-black uppercase text-[9px] lg:text-[11px] font-black tracking-widest italic shadow-[0_10px_20px_rgba(174,255,0,0.2)] hover:scale-105 active:scale-95 px-4 lg:px-6 py-2.5 lg:py-3.5 rounded-full"
                    >
                        <span className="hidden sm:inline">Connect Wallet</span>
                        <span className="sm:hidden">Connect</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
