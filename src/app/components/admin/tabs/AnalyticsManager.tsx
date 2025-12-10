
import React, { useMemo, useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend, LineChart, Line, ReferenceLine
} from 'recharts';
import { useContent } from '../../../context/ContentContext';
import { Card, SectionHeader } from '../ui/AdminShared';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type TimeRange = '24h' | '7d' | '30d' | '1y';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    gradient: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

// --- Helpers ---
const formatDateLabel = (date: Date, range: TimeRange): string => {
    if (range === '24h') return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (range === '1y') return date.toLocaleDateString('en-US', { month: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getRangeLabel = (range: TimeRange): string => {
    switch(range) {
        case '24h': return 'Last 24 Hours';
        case '7d': return 'Last 7 Days';
        case '30d': return 'Last 30 Days';
        case '1y': return 'Last 12 Months';
    }
};

// --- Components ---

const FilterTab: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${active ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
    >
        {label}
    </button>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, gradient, icon, trend, trendValue }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 shadow-xl text-white ${gradient} group`}
    >
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest opacity-70 mb-1">{title}</h3>
                    <div className="text-3xl md:text-4xl font-serif font-bold tracking-tight">{value}</div>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shadow-inner group-hover:bg-white/20 transition-colors">
                    {icon}
                </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
                {subValue && (
                    <div className="inline-flex items-center px-2 py-1 bg-black/20 rounded-md backdrop-blur-md">
                        <span className="text-[10px] font-medium tracking-wide uppercase">{subValue}</span>
                    </div>
                )}
                {trend && trendValue && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-300' : trend === 'down' ? 'text-red-300' : 'text-gray-300'}`}>
                        <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
    </motion.div>
);

export const AnalyticsManager: React.FC = () => {
    const { projects, trustedClients, orders, config, curatedItems } = useContent();
    const [range, setRange] = useState<TimeRange>('7d');
    
    // --- Traffic Simulation State ---
    const [trafficData, setTrafficData] = useState<{ name: string; visitors: number }[]>([]);

    // --- Mock Data Generators (Respecting Range) ---
    const generateTimeBuckets = (range: TimeRange) => {
        const buckets = [];
        const now = new Date();
        let count = 0;
        let unit = 'day';

        if (range === '24h') { count = 24; unit = 'hour'; }
        else if (range === '7d') { count = 7; unit = 'day'; }
        else if (range === '30d') { count = 30; unit = 'day'; }
        else if (range === '1y') { count = 12; unit = 'month'; }

        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(now);
            if (unit === 'hour') d.setHours(d.getHours() - i);
            if (unit === 'day') d.setDate(d.getDate() - i);
            if (unit === 'month') d.setMonth(d.getMonth() - i);
            buckets.push({ date: d, label: formatDateLabel(d, range) });
        }
        return buckets;
    };

    // --- Real-time Traffic Simulation ---
    useEffect(() => {
        // Initial Seed
        const buckets = generateTimeBuckets('24h'); // Traffic is always 24h/Live view usually, but we can adapt
        // For the "Live Traffic" chart, we usually show granular data regardless of global filter, or adapt.
        // Let's make Live Traffic always show last 30 minutes to 24 hours for "Live" feel. 
        // Or adapt to range? Let's stick to a high-fidelity live chart (last 24 points).
        
        const generatePoints = () => Array.from({ length: 20 }, (_, i) => ({
            name: new Date(Date.now() - (20 - i) * 300000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), // 5 min intervals
            visitors: Math.floor(Math.random() * 50) + 10
        }));

        setTrafficData(generatePoints());

        const interval = setInterval(() => {
            setTrafficData(current => {
                const nextTime = new Date();
                const newPoint = {
                    name: nextTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    visitors: Math.floor(Math.random() * 60) + 20 // Random fluctuation
                };
                return [...current.slice(1), newPoint];
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);


    // --- Computed Metrics based on Range ---
    
    // 1. Filter Orders
    const filteredOrders = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        
        if (range === '24h') cutoff.setHours(cutoff.getHours() - 24);
        if (range === '7d') cutoff.setDate(cutoff.getDate() - 7);
        if (range === '30d') cutoff.setDate(cutoff.getDate() - 30);
        if (range === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1);

        return orders.filter(o => new Date(o.date) >= cutoff);
    }, [orders, range]);

    const hasData = filteredOrders.length > 0;

    // 2. Aggregate Data for Charts
    const chartData = useMemo(() => {
        const buckets = generateTimeBuckets(range);
        
        return buckets.map(bucket => {
            // Find orders in this bucket
            // Logic differs slightly by range precision (hour vs day vs month)
            const bucketOrders = filteredOrders.filter(o => {
                const d = new Date(o.date);
                if (range === '24h') return d.getHours() === bucket.date.getHours() && d.getDate() === bucket.date.getDate();
                if (range === '1y') return d.getMonth() === bucket.date.getMonth() && d.getFullYear() === bucket.date.getFullYear();
                return d.getDate() === bucket.date.getDate() && d.getMonth() === bucket.date.getMonth();
            });

            // Revenue
            const revenue = bucketOrders.reduce((acc, o) => acc + o.total, 0);
            
            // Service Mix
            const designOnly = bucketOrders.filter(o => o.type === 'designOnly').length;
            const designPrint = bucketOrders.filter(o => o.type === 'designPrint').length;

            // Mock Data injection if no real orders (for demo visuals)
            const isMock = orders.length === 0;
            const mockRevenue = isMock ? Math.floor(Math.random() * 10000) + 2000 : 0;
            const mockDesign = isMock ? Math.floor(Math.random() * 5) : 0;
            const mockPrint = isMock ? Math.floor(Math.random() * 8) : 0;

            return {
                name: bucket.label,
                revenue: hasData ? revenue : mockRevenue,
                design: hasData ? designOnly : mockDesign,
                print: hasData ? designPrint : mockPrint,
                // Mock Social Data (Cumulative Growth)
                facebook: Math.floor(Math.random() * 10) + 50 + (bucket.date.getTime() % 100),
                instagram: Math.floor(Math.random() * 20) + 80 + (bucket.date.getTime() % 200),
                tiktok: Math.floor(Math.random() * 40) + 20 + (bucket.date.getTime() % 300),
            };
        });
    }, [filteredOrders, range, hasData, orders.length]);

    // 3. KPI Calculations
    const totalRevenue = chartData.reduce((acc, item) => acc + item.revenue, 0);
    const totalOrders = chartData.reduce((acc, item) => acc + item.design + item.print, 0);

    return (
        <div className="max-w-[1600px] mx-auto pb-24 space-y-8 animate-in fade-in duration-500 font-sans">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Analytics</h2>
                    <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                        <span>Real-time Dashboard</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
                    <FilterTab active={range === '24h'} label="24H" onClick={() => setRange('24h')} />
                    <FilterTab active={range === '7d'} label="7 Days" onClick={() => setRange('7d')} />
                    <FilterTab active={range === '30d'} label="30 Days" onClick={() => setRange('30d')} />
                    <FilterTab active={range === '1y'} label="Year" onClick={() => setRange('1y')} />
                </div>
            </div>

            {/* KPI Cards (Dynamic based on filter) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title={`Revenue (${range})`} 
                    value={`Rs. ${totalRevenue.toLocaleString()}`}
                    subValue={hasData ? "Actual Income" : "Simulated"}
                    gradient="bg-gradient-to-br from-indigo-900 to-violet-800"
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    trend="up" trendValue="+12%"
                />
                <StatCard 
                    title={`Orders (${range})`}
                    value={totalOrders}
                    subValue="Completed & Pending"
                    gradient="bg-gradient-to-br from-gray-900 to-black"
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                />
                <StatCard 
                    title="Active Projects" 
                    value={projects.filter(p => p.isVisible !== false).length}
                    subValue="Global Counter"
                    gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
                 <StatCard 
                    title="Trusted Clients" 
                    value={trustedClients.length}
                    subValue="Global Counter"
                    gradient="bg-gradient-to-br from-blue-600 to-cyan-700"
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            </div>

            {/* Top Row: Revenue & Live Traffic */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Analysis (Area Chart) */}
                <div className="xl:col-span-2">
                    <Card className="h-[450px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-md">
                        <SectionHeader 
                            title="Revenue Trends" 
                            action={<div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">{getRangeLabel(range)}</div>} 
                        />
                        <div className="flex-1 w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4338ca" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11, fontWeight: 600}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dx={-10} tickFormatter={(val) => `${val/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '8px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#c7d2fe' }}
                                        formatter={(val: number) => [`Rs. ${val.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#4338ca" 
                                        strokeWidth={3} 
                                        fill="url(#revenueGradient)" 
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Live Traffic (Real-time Area) */}
                <div className="xl:col-span-1">
                    <Card className="h-[450px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-md relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                             <h3 className="text-xl font-bold text-gray-900 tracking-tight">Live Traffic</h3>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Real-time</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                             </div>
                        </div>
                        <div className="flex-1 w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData}>
                                    <defs>
                                        <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} interval="preserveStartEnd" minTickGap={30} />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#064e3b', borderRadius: '6px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#6ee7b7' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="visitors" 
                                        stroke="#10b981" 
                                        strokeWidth={2} 
                                        fill="url(#trafficGradient)" 
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute bottom-4 right-6 text-right pointer-events-none">
                            <div className="text-4xl font-bold text-gray-900">{trafficData[trafficData.length - 1]?.visitors}</div>
                            <div className="text-xs uppercase tracking-widest text-gray-400">Active Users</div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Service Mix & Social Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Service Mix (Stacked Bar) */}
                 <Card className="h-[400px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-md">
                    <SectionHeader title="Service Growth Trajectory" />
                    <div className="flex-1 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dx={-10} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Bar dataKey="design" name="Design Only" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="print" name="Design & Print" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </Card>

                 {/* Social Impact (Multi-Line) */}
                 <Card className="h-[400px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-md">
                    <SectionHeader title="Social Platform Growth" />
                    <div className="flex-1 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="plainline" />
                                <Line type="monotone" dataKey="facebook" stroke="#3b5998" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                                <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                                <Line type="monotone" dataKey="tiktok" stroke="#000000" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </Card>
            </div>
        </div>
    );
};
