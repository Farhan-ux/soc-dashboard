import { useState, useEffect } from 'react';
import ThreatMap from '@/components/ThreatMap';
import ThreatLevel from '@/components/ThreatLevel';
import IncidentFeed from '@/components/IncidentFeed';
import NetworkTraffic from '@/components/NetworkTraffic';
import TopAttackers from '@/components/TopAttackers';
import FirewallLogs from '@/components/FirewallLogs';
import VulnerabilityScanner from '@/components/VulnerabilityScanner';
import SystemHealth from '@/components/SystemHealth';

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
      setUptime(prev => prev + 1);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-soc-bg text-soc-text font-mono">
      {/* Top Header Bar */}
      <header className="bg-soc-panel border-b border-soc-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-soc-red animate-pulse" />
          <h1 className="text-sm font-bold tracking-[3px] text-soc-cyber uppercase">
            SOC Operations Center
          </h1>
          <span className="text-[10px] text-soc-muted ml-2">CLASSIFIED // LEVEL 5 CLEARANCE</span>
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-soc-muted">STATUS</span>
            <span className="text-soc-amber font-semibold">ELEVATED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-soc-muted">UPTIME</span>
            <span className="text-soc-green">{String(Math.floor(uptime / 3600)).padStart(2, '0')}:{String(Math.floor((uptime % 3600) / 60)).padStart(2, '0')}:{String(uptime % 60).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-soc-muted">SYS</span>
            <span className="text-soc-cyber">{time}</span>
          </div>
        </div>
      </header>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 border-b border-soc-border">
        <KPICard label="ACTIVE THREATS" value="7" color="soc-red" trend="+2" />
        <KPICard label="BLOCKED TODAY" value="1,247" color="soc-amber" trend="+18%" />
        <KPICard label="INCIDENTS" value="23" color="soc-cyber" trend="-5" />
        <KPICard label="MONITORED IPS" value="12,841" color="soc-green" trend="STABLE" />
        <KPICard label="AVG RESPONSE" value="2.4s" color="soc-purple" trend="-0.3s" />
      </div>

      {/* Main Grid - Phase 1: Placeholder panels */}
      <div className="p-3 grid grid-cols-12 gap-3">
        {/* Row 1 */}
        <div className="col-span-5 soc-panel" style={{ minHeight: 340 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Global Threat Map
          </div>
          <ThreatMap />
        </div>

        <div className="col-span-3 soc-panel" style={{ minHeight: 340 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Threat Level
          </div>
          <ThreatLevel />
        </div>

        <div className="col-span-4 soc-panel" style={{ minHeight: 340 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Live Incident Feed
          </div>
          <IncidentFeed />
        </div>

        {/* Row 2 */}
        <div className="col-span-4 soc-panel" style={{ minHeight: 300 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Network Traffic Analysis
          </div>
          <NetworkTraffic />
        </div>

        <div className="col-span-4 soc-panel" style={{ minHeight: 300 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Top Attackers
          </div>
          <TopAttackers />
        </div>

        <div className="col-span-4 soc-panel" style={{ minHeight: 300 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Firewall Log Stream
          </div>
          <FirewallLogs />
        </div>

        {/* Row 3 */}
        <div className="col-span-8 soc-panel" style={{ minHeight: 300 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            Vulnerability Scanner
          </div>
          <VulnerabilityScanner />
        </div>

        <div className="col-span-4 soc-panel" style={{ minHeight: 300 }}>
          <div className="soc-panel-header">
            <span className="indicator" />
            System Health
          </div>
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, color, trend }: { label: string; value: string; color: string; trend: string }) {
  const colorMap: Record<string, string> = {
    'soc-red': 'text-soc-red',
    'soc-amber': 'text-soc-amber',
    'soc-cyber': 'text-soc-cyber',
    'soc-green': 'text-soc-green',
    'soc-purple': 'text-soc-purple',
  };
  const isNegative = trend.startsWith('-');
  return (
    <div className="px-4 py-3 border-r border-soc-border last:border-r-0">
      <div className="text-[9px] text-soc-muted tracking-widest mb-1">{label}</div>
      <div className={`text-xl font-bold ${colorMap[color] || 'text-soc-text'}`}>{value}</div>
      <div className={`text-[10px] mt-1 ${isNegative ? 'text-soc-green' : 'text-soc-red'}`}>
        {trend} <span className="text-soc-muted">from last hr</span>
      </div>
    </div>
  );
}