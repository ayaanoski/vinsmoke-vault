import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { RefreshCw, ArrowRightLeft, Download, Upload, Boxes } from 'lucide-react';

const VaultView = ({
    totalAssets,
    onDeposit,
    onWithdraw,
    nativeBalance,
    wbnbBalance,
    userShares,
    onWrap
}: {
    totalAssets: any,
    onDeposit: (amount: string) => void,
    onWithdraw: (shares: string) => void,
    nativeBalance: string,
    wbnbBalance: string,
    userShares: string,
    onWrap: (amount: string) => void
}) => {
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawShares, setWithdrawShares] = useState('');
    const [wrapAmount, setWrapAmount] = useState('');

    const assets = [
        { name: 'BNB', symbol: 'BNB', balance: Number(nativeBalance).toFixed(4), value: 'Native Gas', type: 'Primary' },
        { name: 'WBNB', symbol: 'WBNB', balance: Number(wbnbBalance).toFixed(4), value: 'Vault Asset', type: 'Required' },
        { name: 'vVault', symbol: 'VVAULT', balance: Number(userShares).toFixed(4), value: 'Shares Held', type: 'Strategy' },
    ];

    return (
        <div className="flex flex-col gap-6 lg:gap-8 pb-10">
            <div className="mb-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-widest text-white uppercase font-display">Vault Assets</h1>
            </div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Stats Header Row - Split on mobile, 3-wide on desktop */}
                <div className="col-span-4 pill-card h-[130px] lg:h-[160px] flex flex-col justify-center">
                    <span className="stat-label mb-2">Total Value Locked</span>
                    <p className="stat-value text-accent">
                        {totalAssets ? `${(Number(totalAssets) / 1e18).toFixed(4)}` : '0.0000'} <span className="text-sm opacity-50 ml-1">BNB</span>
                    </p>
                </div>
                <div className="col-span-4 pill-card h-[130px] lg:h-[160px] flex flex-col justify-center border-accent/20">
                    <span className="stat-label mb-2">Your Shares</span>
                    <p className="stat-value text-white">
                        {Number(userShares).toFixed(4)} <span className="text-sm opacity-30 ml-1">vVault</span>
                    </p>
                </div>
                <div className="col-span-4 pill-card h-[130px] lg:h-[160px] flex flex-col justify-center">
                    <span className="stat-label mb-2">Pending Yield</span>
                    <p className="stat-value text-secondary">+0.0021 <span className="text-sm opacity-50 ml-1">BNB</span></p>
                </div>

                {/* Action Cards - Rounded Boxes like reference items */}
                <div className="col-span-12 lg:col-span-4 pill-card h-auto lg:min-h-[400px] flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <span className="stat-label">Wrap Assets</span>
                        <ArrowRightLeft className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-4">
                        <div className="pill-nav bg-main-bg/50 border-white/5 py-4 px-6 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="0.00"
                                value={wrapAmount}
                                onChange={(e) => setWrapAmount(e.target.value)}
                                className="bg-transparent border-none outline-none font-display font-black text-xl w-full text-white"
                            />
                            <button onClick={() => setWrapAmount(nativeBalance)} className="text-[10px] font-black text-accent hover:opacity-70">MAX</button>
                        </div>
                        <p className="text-[10px] text-text-muted font-bold px-4">Available: {Number(nativeBalance).toFixed(4)} tBNB</p>
                    </div>
                    <button
                        onClick={() => onWrap(wrapAmount)}
                        className="pill-button bg-accent text-black w-full justify-center py-5 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase italic tracking-widest font-black mt-auto"
                    >
                        Convert to WBNB
                    </button>
                </div>

                <div className="col-span-12 lg:col-span-4 pill-card h-auto lg:min-h-[400px] flex flex-col gap-8 border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="stat-label">Main Deposit</span>
                        <Download className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-4">
                        <div className="pill-nav bg-main-bg/50 border-white/5 py-4 px-6 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="0.00"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className="bg-transparent border-none outline-none font-display font-black text-xl w-full text-white"
                            />
                            <button onClick={() => setDepositAmount(wbnbBalance)} className="text-[10px] font-black text-accent hover:opacity-70">MAX</button>
                        </div>
                        <p className="text-[10px] text-text-muted font-bold px-4">Available: {Number(wbnbBalance).toFixed(4)} WBNB</p>
                    </div>
                    <button
                        onClick={() => onDeposit(depositAmount)}
                        className="pill-button bg-white text-black w-full justify-center py-5 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase italic tracking-widest font-black mt-auto"
                    >
                        Anchor Capital
                    </button>
                </div>

                <div className="col-span-12 lg:col-span-4 pill-card h-auto lg:min-h-[400px] flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <span className="stat-label">Fast Redeem</span>
                        <Upload className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="space-y-4">
                        <div className="pill-nav bg-main-bg/50 border-white/5 py-4 px-6 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="0.00"
                                value={withdrawShares}
                                onChange={(e) => setWithdrawShares(e.target.value)}
                                className="bg-transparent border-none outline-none font-display font-black text-xl w-full text-white"
                            />
                            <button onClick={() => setWithdrawShares(userShares)} className="text-[10px] font-black text-accent hover:opacity-70">MAX</button>
                        </div>
                        <p className="text-[10px] text-text-muted font-bold px-4">Shares: {Number(userShares).toFixed(4)} vVault</p>
                    </div>
                    <button
                        onClick={() => onWithdraw(withdrawShares)}
                        className="pill-button bg-surface border border-border text-white w-full justify-center py-5 shadow-lg hover:bg-white hover:text-black transition-all text-[11px] uppercase italic tracking-widest font-black mt-auto"
                    >
                        Execute Redemption
                    </button>
                </div>

                {/* History Table - Horizontal scroll on mobile */}
                <div className="col-span-12 pill-card overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <span className="stat-label">Anchored Asset Distribution</span>
                        <RefreshCw className="w-4 h-4 text-text-muted hover:text-accent transition-colors cursor-pointer" />
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="stat-label border-b border-white/5 opacity-40">
                                    <th className="pb-6">Asset Name</th>
                                    <th className="pb-6">Current Liquidity</th>
                                    <th className="pb-6">System Weight</th>
                                    <th className="pb-6 text-right">Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map((asset, i) => (
                                    <tr key={i} className="group border-b border-white/5 last:border-0">
                                        <td className="py-6 lg:py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black font-black font-display tracking-widest scale-90">
                                                    {asset.symbol.slice(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-[15px]">{asset.name}</p>
                                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{asset.symbol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 lg:py-8">
                                            <p className="font-display font-black text-xl text-white tracking-tighter">{asset.balance}</p>
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{asset.value}</p>
                                        </td>
                                        <td className="py-6 lg:py-8">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${asset.type === 'Primary' ? 'bg-accent shadow-[0_0_10px_rgba(174,255,0,0.5)]' : 'bg-surface border border-white/20'}`} />
                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{asset.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 lg:py-8 text-right">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-all p-3 bg-white/5 rounded-full border border-transparent hover:border-accent/20 px-6">Manage Pos</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaultView;
