import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const attackers = [
  { ip: '185.220.101.34', country: 'RU', city: 'Moscow', attacks: 847, type: 'DDoS', severity: 'critical', blocked: true },
  { ip: '177.54.150.221', country: 'BR', city: 'São Paulo', attacks: 623, type: 'SQL Injection', severity: 'critical', blocked: true },
  { ip: '103.224.182.5', country: 'CN', city: 'Beijing', attacks: 512, type: 'Port Scan', severity: 'high', blocked: true },
  { ip: '85.105.42.198', country: 'TR', city: 'Istanbul', attacks: 398, type: 'Brute Force', severity: 'high', blocked: false },
  { ip: '196.201.214.87', country: 'KE', city: 'Nairobi', attacks: 341, type: 'Ransomware', severity: 'critical', blocked: true },
  { ip: '94.200.77.12', country: 'AE', city: 'Dubai', attacks: 289, type: 'DDoS', severity: 'high', blocked: true },
  { ip: '91.219.236.17', country: 'UA', city: 'Kyiv', attacks: 234, type: 'XSS', severity: 'medium', blocked: true },
];

const severityColor: Record<string, string> = {
  critical: 'text-soc-red',
  high: 'text-[#ff6b35]',
  medium: 'text-soc-amber',
  low: 'text-soc-green',
};

export default function TopAttackers() {
  return (
    <div className="p-3">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="text-soc-muted text-[9px] uppercase tracking-wider">
              <th className="text-left pb-2">IP Address</th>
              <th className="text-left pb-2">Origin</th>
              <th className="text-right pb-2">Attacks</th>
              <th className="text-left pb-2">Type</th>
              <th className="text-center pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border/50">
            {attackers.map((a, i) => (
              <tr key={a.ip} className="hover:bg-white/[0.02]">
                <td className="py-1.5 text-soc-cyber font-semibold">{a.ip}</td>
                <td className="py-1.5 text-soc-muted">{a.city}, {a.country}</td>
                <td className={`py-1.5 text-right font-bold ${severityColor[a.severity]}`}>{a.attacks.toLocaleString()}</td>
                <td className={`py-1.5 ${severityColor[a.severity]}`}>{a.type}</td>
                <td className="py-1.5 text-center">
                  {a.blocked ? (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-soc-red/20 text-soc-red border border-soc-red/30">BLOCKED</span>
                  ) : (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-soc-amber/20 text-soc-amber border border-soc-amber/30 animate-pulse">ACTIVE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mini bar chart of attack counts */}
      <div className="mt-2 border-t border-soc-border pt-2">
        <div className="text-[9px] text-soc-muted tracking-widest mb-1">ATTACK FREQUENCY</div>
        <ResponsiveContainer width="100%" height={50}>
          <BarChart data={attackers} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="ip" type="category" tick={{ fontSize: 8, fill: '#4a5568' }} width={110} />
            <Tooltip
              contentStyle={{ background: '#0f1520', border: '1px solid #1a2535', borderRadius: 4, fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <Bar dataKey="attacks" radius={[0, 2, 2, 0]}>
              {attackers.map((a, idx) => (
                <Cell
                  key={idx}
                  fill={a.severity === 'critical' ? '#ff2d55' : a.severity === 'high' ? '#ff6b35' : '#ffb800'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
