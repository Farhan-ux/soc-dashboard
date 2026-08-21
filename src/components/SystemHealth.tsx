import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Server {
  name: string;
  role: string;
  status: 'online' | 'degraded' | 'offline';
  cpu: number;
  ram: number;
  disk: number;
  net: number;
}

const servers: Server[] = [
  { name: 'DC-01', role: 'Primary Data Center', status: 'online', cpu: 72, ram: 85, disk: 61, net: 4.2 },
  { name: 'WEB-02', role: 'Web Frontend', status: 'degraded', cpu: 89, ram: 92, disk: 45, net: 7.8 },
  { name: 'DB-01', role: 'Database Cluster', status: 'online', cpu: 54, ram: 78, disk: 88, net: 2.1 },
  { name: 'API-01', role: 'API Gateway', status: 'online', cpu: 41, ram: 55, disk: 33, net: 5.6 },
  { name: 'AUTH-01', role: 'Auth Service', status: 'online', cpu: 28, ram: 42, disk: 21, net: 1.3 },
  { name: 'CDN-02', role: 'CDN Edge', status: 'online', cpu: 63, ram: 48, disk: 72, net: 9.1 },
  { name: 'FW-01', role: 'Firewall', status: 'online', cpu: 77, ram: 34, disk: 15, net: 8.4 },
  { name: 'MON-01', role: 'Monitoring', status: 'online', cpu: 35, ram: 62, disk: 54, net: 0.8 },
];

const statusConfig = {
  online: { color: '#00ff88', label: 'ONLINE' },
  degraded: { color: '#ffb800', label: 'DEGRADED' },
  offline: { color: '#ff2d55', label: 'OFFLINE' },
};

const metricLabel: Record<string, string> = { cpu: 'CPU', ram: 'RAM', disk: 'DISK', net: 'NET' };

function MetricBar({ label, value, unit }: { label: string; value: number; unit?: string }) {
  const pct = unit ? (value / 10) * 100 : value;
  const color = pct > 85 ? '#ff2d55' : pct > 65 ? '#ffb800' : '#00ff88';
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-[9px] text-soc-muted w-6">{label}</span>
      <div className="flex-1 h-1.5 bg-soc-bg rounded-sm overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      <span className="text-[9px] font-bold w-10 text-right" style={{ color }}>{unit ? `${value}${unit}` : `${value}%`}</span>
    </div>
  );
}

export default function SystemHealth() {
  const [selected, setSelected] = useState(0);
  const [history, setHistory] = useState(() => generateHistory());
  const [serverStates, setServerStates] = useState(servers);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const next = [...prev.slice(1)];
        const srv = servers[selected];
        next.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          cpu: Math.max(5, Math.min(99, srv.cpu + (Math.random() - 0.5) * 12)),
          ram: Math.max(5, Math.min(99, srv.ram + (Math.random() - 0.5) * 8)),
        });
        return next;
      });
      setServerStates(prev =>
        prev.map((s, i) => ({
          ...s,
          cpu: Math.max(5, Math.min(99, s.cpu + (Math.random() - 0.5) * 6)),
          ram: Math.max(5, Math.min(99, s.ram + (Math.random() - 0.5) * 4)),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [selected]);

  const srv = serverStates[selected];

  return (
    <div className="p-3">
      {/* Server grid */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {serverStates.map((s, i) => {
          const cfg = statusConfig[s.status];
          return (
            <button
              key={s.name}
              onClick={() => { setSelected(i); setHistory(generateHistory()); }}
              className={`p-1.5 rounded-sm border text-center transition-all ${
                selected === i
                  ? 'border-soc-cyber bg-soc-cyber/10'
                  : 'border-soc-border hover:border-soc-muted'
              }`}
            >
              <div className="text-[9px] font-bold text-soc-cyber">{s.name}</div>
              <div className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5" style={{ background: cfg.color }} />
            </button>
          );
        })}
      </div>

      {/* Selected server detail */}
      <div className="border-t border-soc-border pt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-bold text-soc-text">{srv.name}</span>
            <span className="text-[9px] text-soc-muted ml-2">{srv.role}</span>
          </div>
          <span className="text-[8px] px-1.5 py-0.5 rounded border" style={{
            color: statusConfig[srv.status].color,
            borderColor: `${statusConfig[srv.status].color}40`,
            background: `${statusConfig[srv.status].color}15`,
          }}>{statusConfig[srv.status].label}</span>
        </div>

        <MetricBar label="CPU" value={Math.round(srv.cpu)} />
        <MetricBar label="RAM" value={Math.round(srv.ram)} />
        <MetricBar label="DISK" value={Math.round(srv.disk)} />
        <MetricBar label="NET" value={parseFloat(srv.net.toFixed(1))} unit="G" />

        {/* Sparkline */}
        <div className="mt-2">
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="gCpuHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="cpu" stroke="#00f0ff" fill="url(#gCpuHist)" strokeWidth={1} name="CPU" />
              <Tooltip
                contentStyle={{ background: '#0f1520', border: '1px solid #1a2535', borderRadius: 4, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function generateHistory() {
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    cpu: 30 + Math.random() * 50,
    ram: 40 + Math.random() * 40,
  }));
}
