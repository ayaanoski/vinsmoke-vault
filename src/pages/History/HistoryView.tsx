import React from 'react';
import { Terminal, TrendingUp, History as HistoryIcon, ArrowUpRight, ArrowDown } from 'lucide-react';

const HistoryView = ({ history }: { history: any[] }) => {
    const totalProfit = history.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);

    return (
        <div className="flex flex-col gap-6 lg:gap-8 pb-10">
            <div className="mb-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-widest text-white uppercase font-display">Execution Logs</h1>
            </div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Profit Stat Card */}
                <div className="col-span-12 lg:col-span-4 pill-card h-auto lg:h-[160px] flex flex-col justify-center border-accent/20">
                    <span className="stat-label mb-2">Cumulative Alpha</span>
                    <p className="stat-value text-accent">{totalProfit.toFixed(4)} <span className="text-sm opacity-50 ml-1">BNB</span></p>
                </div>

                <div className="col-span-12 lg:col-span-8 pill-card flex flex-col lg:flex-row items-center lg:justify-between px-6 lg:px-10 py-6 lg:py-0 gap-6 lg:gap-0">
                    <div className="flex gap-10 w-full lg:w-auto overflow-x-auto whitespace-nowrap scrollbar-none">
                        <div>
                            <p className="stat-value text-white">42</p>
                            <p className="stat-label">Total Strikes</p>
                        </div>
                        <div className="w-px h-10 bg-border self-center" />
                        <div>
                            <p className="stat-value text-white">100%</p>
                            <p className="stat-label">Strike Accuracy</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                    </div>
                </div>

                {/* Table Overhaul - Horizontal Scroll on Mobile */}
                <div className="col-span-12 pill-card overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <span className="stat-label">Detailed Audit Trail</span>
                        <HistoryIcon className="w-4 h-4 text-text-muted opacity-40" />
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="stat-label border-b border-white/5 opacity-40">
                                    <th className="pb-6">Operation Type</th>
                                    <th className="pb-6">Protocol Hash</th>
                                    <th className="pb-6">Value / Profit</th>
                                    <th className="pb-6 text-right">Block Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((log) => {
                                    const isStrike = log.type === 'STRIKE';
                                    const isDeposit = log.type === 'DEPOSIT';
                                    const isWithdraw = log.type === 'WITHDRAW';

                                    return (
                                        <tr key={log.id} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-6 lg:py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-full flex items-center justify-center border border-border group-hover:scale-110 transition-transform 
                                                        ${isWithdraw ? 'bg-secondary/5 text-secondary border-secondary/20' : 'bg-accent/5 text-accent border-accent/20'}`}>
                                                        {isStrike && <TrendingUp className="w-5 h-5" />}
                                                        {isDeposit && <ArrowUpRight className="w-5 h-5" />}
                                                        {isWithdraw && <ArrowDown className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white uppercase text-[12px] lg:text-[13px] tracking-widest">{log.type || 'STRIKE'}</p>
                                                        <p className="text-[9px] lg:text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{isStrike ? 'Arbitrage' : 'Liquidity'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 lg:py-8">
                                                <a
                                                    href={`https://testnet.bscscan.com/tx/${log.txHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-mono text-xs text-text-muted hover:text-white transition-all underline underline-offset-4 decoration-border"
                                                >
                                                    {log.txHash?.slice(0, 16)}...
                                                </a>
                                            </td>
                                            <td className="py-6 lg:py-8">
                                                <p className={`font-display font-black text-lg lg:text-xl tracking-tighter ${isWithdraw ? 'text-secondary' : 'text-accent'}`}>
                                                    {isWithdraw ? '-' : '+'}{isStrike ? log.profit : log.message?.split(' ')[1] || '0'} <span className="text-[10px] opacity-40 ml-1 uppercase">BNB</span>
                                                </p>
                                            </td>
                                            <td className="py-6 lg:py-8 text-right">
                                                <p className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest">
                                                    {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Confirming'}
                                                </p>
                                                <p className="text-[9px] font-bold text-text-muted/40 uppercase tracking-widest mt-1">Confirmed</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
