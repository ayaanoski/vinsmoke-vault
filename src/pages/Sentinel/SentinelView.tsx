import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, TrendingUp, RefreshCw, AlertTriangle, ShieldCheck, Gauge, Cpu } from 'lucide-react';

const SentinelView = ({ config, onSave }: { config: any, onSave: (c: any) => void }) => {
    const [localConfig, setLocalConfig] = useState({
        slippage: '0.5',
        maxGas: '20',
        minProfit: '0.01',
        monitoringEnabled: true
    });

    useEffect(() => {
        if (config) {
            setLocalConfig(config);
        }
    }, [config]);

    const handleSave = () => {
        onSave(localConfig);
    };

    return (
        <div className="flex flex-col gap-6 lg:gap-8 pb-10">
            <div className="mb-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-widest text-white uppercase font-display">Monitoring Core</h1>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 gap-6">
                {/* Left Side - Configuration Pills */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
                    <div className="pill-card p-8 lg:p-12 space-y-10 lg:space-y-12">
                        <div className="flex justify-between items-center mb-4">
                            <span className="stat-label">Sentinel Engine / Detection Parameters</span>
                            <ShieldCheck className="w-5 h-5 text-accent" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            <div className="space-y-4">
                                <label className="stat-label text-text-muted flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-accent" />
                                    Slippage Tolerance
                                </label>
                                <div className="pill-nav bg-main-bg/50 border-white/5 py-4 lg:py-5 px-6 lg:px-8 flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={localConfig.slippage}
                                        onChange={(e) => setLocalConfig({ ...localConfig, slippage: e.target.value })}
                                        className="bg-transparent border-none outline-none font-display font-black text-xl lg:text-2xl w-full text-white italic"
                                    />
                                    <span className="text-sm font-black text-text-muted opacity-40">%</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="stat-label text-text-muted flex items-center gap-2">
                                    <Gauge className="w-3 h-3 text-secondary" />
                                    Max Gas Limit
                                </label>
                                <div className="pill-nav bg-main-bg/50 border-white/5 py-4 lg:py-5 px-6 lg:px-8 flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={localConfig.maxGas}
                                        onChange={(e) => setLocalConfig({ ...localConfig, maxGas: e.target.value })}
                                        className="bg-transparent border-none outline-none font-display font-black text-xl lg:text-2xl w-full text-white italic"
                                    />
                                    <span className="text-sm font-black text-text-muted opacity-40">GWEI</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="stat-label text-text-muted flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-accent" />
                                Minimum Profit Threshold
                            </label>
                            <div className="pill-nav bg-main-bg/50 border-white/5 py-5 lg:py-6 px-8 lg:px-10 flex justify-between items-center relative overflow-hidden group">
                                <div className="absolute left-0 top-0 w-1 h-full bg-accent opacity-20" />
                                <input
                                    type="text"
                                    value={localConfig.minProfit}
                                    onChange={(e) => setLocalConfig({ ...localConfig, minProfit: e.target.value })}
                                    className="bg-transparent border-none outline-none font-display font-black text-2xl lg:text-3xl w-full text-white tracking-widest"
                                />
                                <span className="text-lg lg:text-xl font-black text-accent italic opacity-40">BNB</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 lg:p-8 bg-black/40 rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-inner gap-6 lg:gap-0">
                            <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto">
                                <div className={`w-12 h-12 lg:w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${localConfig.monitoringEnabled ? 'bg-accent text-black shadow-[0_0_20px_rgba(174,255,0,0.3)]' : 'bg-surface text-text-muted'} border border-white/5`}>
                                    <RefreshCw className={`w-5 h-5 lg:w-6 h-6 ${localConfig.monitoringEnabled ? 'animate-spin-slow' : ''}`} />
                                </div>
                                <div>
                                    <p className="font-display font-black text-base lg:text-lg uppercase text-white tracking-tight">Stealth Scanning</p>
                                    <p className="text-[9px] lg:text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Real-time memory pool audit active</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLocalConfig({ ...localConfig, monitoringEnabled: !localConfig.monitoringEnabled })}
                                className={`w-16 lg:w-20 h-8 lg:h-10 rounded-full transition-all relative border-2 shrink-0 ${localConfig.monitoringEnabled ? 'bg-accent/10 border-accent/40' : 'bg-surface border-border'}`}
                            >
                                <motion.div
                                    animate={{ x: localConfig.monitoringEnabled ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? 34 : 42) : 6 }}
                                    className={`absolute top-1.5 lg:top-2 w-4 h-4 lg:w-5 h-5 rounded-full shadow-lg ${localConfig.monitoringEnabled ? 'bg-accent shadow-[0_0_15px_rgba(174,255,0,1)]' : 'bg-text-muted'}`}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-5 lg:py-6 bg-white text-black font-black rounded-full hover:bg-accent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl uppercase tracking-[0.2em] text-[10px] lg:text-xs italic tracking-widest"
                        >
                            Commit Alpha Core Config
                        </button>
                    </div>
                </div>

                {/* Right Side - Status Visuals */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:gap-8 order-1 lg:order-2">
                    <div className="pill-card bg-secondary/5 border-secondary/10 p-8 lg:p-10 space-y-6 lg:space-y-8 flex-1">
                        <div className="flex items-center gap-4">
                            <Cpu className="w-5 h-5 lg:w-6 h-6 text-secondary" />
                            <span className="stat-label text-secondary">Node Infrastructure</span>
                        </div>
                        <p className="text-[10px] lg:text-[11px] text-text-muted font-bold uppercase leading-relaxed tracking-widest opacity-80">
                            Current detection clusters are operating at 1.2ms latency across Binance Smart Chain validator nodes.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl lg:rounded-3xl border border-white/5">
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#666]">Uptime</span>
                                <span className="text-[9px] lg:text-[10px] font-black text-white uppercase italic">99.98%</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl lg:rounded-3xl border border-white/5">
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#666]">Load</span>
                                <span className="text-[9px] lg:text-[10px] font-black text-secondary uppercase italic">4.2%</span>
                            </div>
                        </div>

                        {/* Visual Activity Bar gather - Responsive column count */}
                        <div className="flex justify-between items-end gap-[2px] lg:gap-1 h-24 lg:h-32 pt-6 lg:pt-10">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-full rounded-full ${i % 3 === 0 ? 'bg-secondary' : 'bg-white/5'}`}
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pill-card bg-accent/5 border-accent/10 p-6 lg:p-8 flex items-center gap-4 lg:gap-5">
                        <div className="w-10 h-10 lg:w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(174,255,0,0.2)] lg:shadow-[0_0_20px_rgba(174,255,0,0.4)]">
                            <AlertTriangle className="w-5 h-5 lg:w-6 h-6 text-black" />
                        </div>
                        <div>
                            <p className="text-[9px] lg:text-[10px] font-black uppercase text-accent tracking-widest">Protocol Guard</p>
                            <p className="text-[8px] lg:text-[9px] font-bold text-text-muted uppercase leading-tight mt-1">Slippage protection is hard-enforced on-chain</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentinelView;
