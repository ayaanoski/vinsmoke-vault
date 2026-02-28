import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowUpRight, ArrowDown, Zap, Activity, Terminal, RefreshCw, Layers, TrendingUp, ChevronDown } from 'lucide-react';
import PerformanceChart from '../../components/PerformanceChart';

const DashboardView = ({ vaultStatus, history, totalAssets, handleStrike, chartData, chartRange, setChartRange, setActiveTab }: any) => {
    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header - Minimalist text from reference */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-4xl font-black tracking-[0.2em] text-white uppercase font-display leading-none">Intelligence</h1>
                <p className="text-[10px] lg:text-[11px] text-accent font-black uppercase tracking-[0.3em] opacity-80 italic">Sentinel / 2.8ms Latency</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 gap-8">
                {/* Right Column (CHART FIRST ON MOBILE) - Alpha Performance */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8 order-1 lg:order-2">
                    <div className="pill-card flex-1 flex flex-col p-6 lg:p-10 min-h-[450px] lg:min-h-[570px] bg-surface/40 border border-white/[0.03] backdrop-blur-xl">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12">
                            <div className="flex flex-col gap-1">
                                <span className="stat-label text-white text-[12px] tracking-[0.15em] font-black">Performance Audit</span>
                                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest leading-none">Project Timeline / Live Analysis</span>
                            </div>
                            <div className="flex gap-4">
                                <div className="pill-nav px-4 py-2 text-[9px] lg:text-[10px] font-black text-white hover:bg-white/5 cursor-pointer flex items-center gap-2 border-white/10 uppercase tracking-widest">Date: Now <ChevronDown className="w-3 h-3 text-text-muted opacity-40" /></div>
                                <div className="pill-nav px-4 py-2 text-[9px] lg:text-[10px] font-black text-white hover:bg-white/5 cursor-pointer flex items-center gap-2 border-white/10 uppercase tracking-widest">Type: All <ChevronDown className="w-3 h-3 text-text-muted opacity-40" /></div>
                            </div>
                        </div>

                        {/* Chart Render */}
                        <div className="flex-1 w-full min-h-[300px] lg:min-h-[380px]">
                            <PerformanceChart data={chartData} range={chartRange} setRange={setChartRange} />
                        </div>

                        {/* Tighter Multi-Dot Legend */}
                        <div className="flex flex-wrap items-center gap-6 lg:gap-10 mt-10 pt-10 border-t border-white/[0.03]">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_rgba(174,255,0,0.4)]" />
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Alpha Yield</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Pancakeswap</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-white opacity-20 rounded-full" />
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Benchmark</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Ops: 12,042</span>
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column - Key Stat Matrix */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:gap-10 order-2 lg:order-1">
                    {/* Capital Overview Module */}
                    <div className="pill-card flex flex-col gap-8 lg:gap-10 relative overflow-hidden h-fit border border-accent/10 bg-accent/[0.02]">
                        <div className="flex justify-between items-start">
                            <span className="stat-label text-accent opacity-60 font-black tracking-[0.2em]">Capital Assets</span>
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(174,255,0,0.1)] border border-accent/20">
                                <Layers className="w-5 h-5 text-black" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:gap-12 mt-4 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted/60 font-black uppercase tracking-[0.2em]">BNB Anchored</p>
                                <p className="font-display font-black text-4xl lg:text-5xl tracking-tighter text-white">
                                    {totalAssets ? (Number(totalAssets) / 1e18).toFixed(3) : '0.000'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
                                <div className="space-y-1">
                                    <p className="text-[8px] lg:text-[9px] text-secondary font-black uppercase tracking-widest">Avg Strike</p>
                                    <p className="stat-value text-2xl lg:text-3xl text-secondary">6.4%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] lg:text-[9px] text-accent font-black uppercase tracking-widest">Active nodes</p>
                                    <p className="stat-value text-2xl lg:text-3xl text-accent">32</p>
                                </div>
                            </div>
                        </div>

                        {/* Signature Waveform Background */}
                        <div className="absolute -bottom-2 left-0 w-full px-12 flex items-end gap-[3px] h-20 opacity-[0.03]">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full bg-accent rounded-full"
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Matrix Module */}
                    <div className="pill-card border-white/5 relative bg-white/[0.01]">
                        <div className="flex justify-between items-start mb-8 lg:mb-10">
                            <span className="stat-label tracking-[0.15em] font-black">Sentinel Pulse</span>
                            <Activity className="w-4 h-4 text-text-muted opacity-20" />
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="stat-value text-3xl lg:text-4xl text-white">2.8%</p>
                                    <p className="stat-label text-[8px] mt-1">Network Load</p>
                                </div>
                                <div className="text-right">
                                    <p className="stat-value text-3xl lg:text-4xl text-white">3.2%</p>
                                    <p className="stat-label text-[8px] mt-1">Risk Bias</p>
                                </div>
                            </div>

                            {/* Logic Grid Visualization */}
                            <div className="grid grid-cols-10 gap-3 border-t border-white/5 pt-10">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-full aspect-square rounded-full flex items-center justify-center transition-all 
                                            ${i % 7 === 0 ? 'bg-accent shadow-[0_0_8px_rgba(174,255,0,0.4)] scale-110' : i % 11 === 0 ? 'bg-secondary' : 'bg-white/10 opacity-30'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Float Command - Bottom Fixed */}
            <AnimatePresence>
                {vaultStatus?.ready_for_strike && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-[110px] lg:bottom-12 right-6 lg:right-12 left-6 lg:left-[120px] z-50 pointer-events-none"
                    >
                        <div className="mx-auto max-w-4xl bg-white text-black rounded-3xl lg:rounded-full p-4 pl-6 lg:pl-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/20 pointer-events-auto">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0">
                                    <Zap className="w-6 h-6 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Strike Window: OPEN</p>
                                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest text-black">Est. Alpha: +{vaultStatus.opportunity.profit} BNB / No Gas Collateral</p>
                                </div>
                            </div>
                            <button
                                onClick={handleStrike}
                                className="bg-black text-white hover:bg-accent hover:text-black px-10 py-5 rounded-2xl lg:rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl w-full lg:w-auto"
                            >
                                Execute Strike
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardView;
