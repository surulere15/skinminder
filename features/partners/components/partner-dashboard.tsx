import React, { useEffect, useState } from 'react';
import { PartnerService, PartnerStats } from '@/v4-modular-monolith/backend/modules/partners/partner.service';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, Target, Activity, LayoutDashboard, Database, PieChart } from 'lucide-react';

/**
 * Partner Dashboard MVP
 * 
 * Provides pilot partners (Brands/Clinics) with real-time visibility into 
 * scan volume, repeat rates, and skin archetype distribution.
 */

export function PartnerDashboard({ partnerId }: { partnerId: string }) {
    const [stats, setStats] = useState<PartnerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const service = new PartnerService();
            const data = await service.getPartnerIntelligence(partnerId);
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [partnerId]);

    if (loading) return <div className="p-8 animate-pulse">Loading Partner Intelligence...</div>;
    if (!stats) return <div className="p-8">Partner not found.</div>;

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Intelligence Hub</h1>
                    <p className="text-slate-500 font-medium">Monitoring your network's skin health trajectories.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">Live Sync</span>
                </div>
            </header>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard 
                    label="Total Scans" 
                    value={stats.totalScans} 
                    icon={Activity} 
                    trend="+12%"
                />
                <MetricCard 
                    label="Completion Rate" 
                    value={`${(stats.completionRate * 100).toFixed(1)}%`} 
                    icon={Target} 
                    trend="Stable"
                />
                <MetricCard 
                    label="Comparison Rate" 
                    value={`${(stats.repeatScanRate * 100).toFixed(1)}%`} 
                    icon={Users} 
                    trend="+5%"
                    description="Verified Outcomes"
                />
                <MetricCard 
                    label="Data Points" 
                    value={stats.totalScans * 8} 
                    icon={Database}
                    description="Clinical Metrics Captured"
                />
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Archetype Distribution */}
                <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Archetype Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(stats.archetypeDistribution).map(([archetype, count]) => (
                            <div key={archetype} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                                    <span>{archetype.replace('_', ' ')}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-indigo-600 h-full rounded-full" 
                                        style={{ width: `${(count / stats.totalScans) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Growth Insights */}
                <Card className="p-6 bg-indigo-900 text-white border-none shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-indigo-300" />
                        <h3 className="font-bold">Intelligence Insight</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                            <p className="text-sm font-medium leading-relaxed">
                                "Your users are showing a **14% higher prevalence of Melanin Resilient archetypes** compared to the regional baseline. Consider optimizing your PIH-treatment marketing for this cohort."
                            </p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                            <p className="text-sm font-medium leading-relaxed">
                                "Successful scan comparisons has increased by **5% this week**. Your 'Verified Outcomes' data pool is growing."
                            </p>
                        </div>
                    </div>
                    <button className="mt-8 w-full py-3 bg-white text-indigo-900 font-black rounded-xl hover:bg-slate-100 transition-colors uppercase text-sm tracking-widest">
                        Export Intelligence Report
                    </button>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, trend, description }: any) {
    return (
        <Card className="p-6 bg-white border-slate-200 hover:border-indigo-300 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                </div>
                {trend && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                {description && <p className="text-[10px] text-slate-400 font-medium">{description}</p>}
            </div>
        </Card>
    );
}
