import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const PerformanceChart = ({ data, range, setRange }: { data: any[], range: string, setRange: (r: string) => void }) => {
    const ranges = ['1D', '1W', '1M', '1Y', 'ALL'];

    return (
        <div className="space-y-6 lg:space-y-10 h-full flex flex-col">
            <div className="h-[280px] lg:h-[380px] w-full relative z-10 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVault" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#AEFF00" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#AEFF00" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.05} />
                                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#444444', fontSize: 9, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            cursor={{ stroke: '#AEFF00', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                            contentStyle={{
                                backgroundColor: '#141414',
                                border: '1px solid #222222',
                                borderRadius: '24px',
                                fontSize: '10px',
                                padding: '12px',
                                color: '#fff'
                            }}
                            itemStyle={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="vault"
                            stroke="#AEFF00"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorVault)"
                            name="Vinsmoke Alpha"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="market"
                            stroke="#ffffff15"
                            strokeWidth={2}
                            strokeDasharray="10 10"
                            fillOpacity={1}
                            fill="url(#colorMarket)"
                            name="BSC Avg"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-auto">
                <div className="flex gap-10 lg:gap-12 justify-between lg:justify-start lg:w-auto">
                    <div className="space-y-1 lg:space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-3 lg:h-4 bg-accent rounded-full" />
                            <p className="stat-label text-[9px] lg:text-[11px]">Active Alpha</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-display font-black text-xl lg:text-2xl text-accent tracking-tighter">+12.42%</p>
                            <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                        </div>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-3 lg:h-4 bg-white/10 rounded-full" />
                            <p className="stat-label text-[9px] lg:text-[11px]">Market Avg</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-display font-black text-xl lg:text-2xl text-white/40 tracking-tighter">+4.18%</p>
                            <Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white/10" />
                        </div>
                    </div>
                </div>

                {/* Range Selectors - Scrollable on very small screens */}
                <div className="flex bg-surface border border-border p-1 rounded-full shadow-xl w-fit self-center lg:self-auto overflow-x-auto whitespace-nowrap scrollbar-none">
                    {ranges.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 lg:px-5 py-2 text-[9px] lg:text-[10px] font-black rounded-full transition-all tracking-widest uppercase
                                ${range === r ? 'bg-white text-black shadow-lg scale-105' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceChart;
