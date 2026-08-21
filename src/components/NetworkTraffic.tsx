import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const generateTrafficData = () => {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 3600000);
    const label = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const base = 800 + Math.sin(i * 0.3) * 200;
    data.push({
      time: label,
      inbound: Math.round(base + Math.random() * 300),
      outbound: Math.round(base * 0.6 + Math.random() * 150),
      blocked: Math.round(50 + Math.random() * 100 + (i < 5 ? 200 : 0)),
    });
  }
  return data;
};

const protocolData = [
  { name: 'HTTPS', value: 42, color: '#00f0ff' },
  { name: 'HTTP', value: 18, color: '#00ff88' },
  { name: 'SSH', value: 15, color: '#ffb800' },
  { name: 'DNS', value: 12, color: '#a855f7' },
  { name: 'SMTP', value: 7, color: '#ff6b35' },
  { name: 'FTP', value: 4, color: '#ff2d55' },
  { name: 'OTHER', value: 2, color: '#4a5568' },
];

const bandwidthData = [
  { iface: 'eth0', current: 4.2, max: 10 },
  { iface: 'eth1', current: 7.8, max: 10 },
  { iface: 'eth2', current: 2.1, max: 10 },
  { iface: 'eth3', current: 5.6, max: 10 },
];

export default function NetworkTraffic() {
  const [traffic, setTraffic] = useState(generateTrafficData);
  const [activeTab, setActiveTab] = useState<'traffic' | 'protocols'>('traffic');

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        next.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          inbound: Math.round(last.inbound + (Math.random() - 0.5) * 100),
          outbound: Math.round(last.outbound + (Math.random() - 0.5) * 60),
          blocked: Math.round(last.blocked + (Math.random() - 0.4) * 40),
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3">
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {(['traffic', 'protocols'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[9px] px-3 py-1 rounded-sm uppercase tracking-wider border transition-colors ${
              activeTab === tab
                ? 'bg-soc-cyber/10 border-soc-cyber text-soc-cyber'
                : 'border-soc-border text-soc-muted hover:text-soc-text'
            }`}
          >
            {tab === 'traffic' ? 'Traffic Flow' : 'Protocols'}
          </button>
        ))}
      </div>

      {activeTab === 'traffic' ? (
        <>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={traffic}>
              <defs>
                <linearGradient id="gInbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOutbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff2d55" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff2d55" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#4a5568' }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fontSize: 9, fill: '#4a5568' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                contentStyle={{ background: '#0f1520', border: '1px solid #1a2535', borderRadius: 4, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                labelStyle={{ color: '#00f0ff' }}
              />
              <Area type="monotone" dataKey="inbound" stroke="#00f0ff" fill="url(#gInbound)" strokeWidth={1.5} name="Inbound Mbps" />
              <Area type="monotone" dataKey="outbound" stroke="#00ff88" fill="url(#gOutbound)" strokeWidth={1.5} name="Outbound Mbps" />
              <Area type="monotone" dataKey="blocked" stroke="#ff2d55" fill="url(#gBlocked)" strokeWidth={1.5} name="Blocked Mbps" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Bandwidth bars */}
          <div className="mt-2 border-t border-soc-border pt-2">
            <div className="text-[9px] text-soc-muted tracking-widest mb-2">INTERFACE UTILIZATION</div>
            {bandwidthData.map(bw => (
              <div key={bw.iface} className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-soc-muted w-8">{bw.iface}</span>
                <div className="flex-1 h-2.5 bg-soc-bg rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width: `${(bw.current / bw.max) * 100}%`,
                      background: bw.current / bw.max > 0.7 ? '#ff2d55' : bw.current / bw.max > 0.5 ? '#ffb800' : '#00ff88',
                    }}
                  />
                </div>
                <span className="text-[10px] text-soc-text w-14 text-right">{bw.current} Gbps</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={protocolData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                {protocolData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f1520', border: '1px solid #1a2535', borderRadius: 4, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5">
            {protocolData.map(p => (
              <div key={p.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
                  <span className="text-soc-text">{p.name}</span>
                </div>
                <span className="font-semibold" style={{ color: p.color }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}