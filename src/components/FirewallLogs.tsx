import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  time: string;
  action: 'BLOCK' | 'ALLOW' | 'DROP' | 'RATE_LIMIT';
  src: string;
  dst: string;
  port: number;
  proto: string;
  rule: string;
}

const actions = ['BLOCK', 'ALLOW', 'DROP', 'RATE_LIMIT'] as const;
const protos = ['TCP', 'UDP', 'ICMP', 'SYN'];
const rules = [
  'deny-inbound-port-22', 'rate-limit-http', 'allow-estab-tcp', 'geo-block-CN',
  'deny-syn-flood', 'allow-dns-out', 'block-tor-exit', 'deny-ssh-brute',
  'allow-https-in', 'rate-limit-api', 'block-sql-pattern', 'geo-block-RU',
];

function randomIP(): string {
  return `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`;
}

function generateLog(): LogEntry {
  const action = actions[Math.floor(Math.random() * actions.length)];
  return {
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    action,
    src: randomIP(),
    dst: `10.0.${Math.floor(Math.random()*5)}.${Math.floor(Math.random()*50)+1}`,
    port: [22, 80, 443, 3389, 8080, 3306, 5432, 8443][Math.floor(Math.random()*8)],
    proto: protos[Math.floor(Math.random()*protos.length)],
    rule: rules[Math.floor(Math.random()*rules.length)],
  };
}

const actionColor: Record<string, string> = {
  BLOCK: 'text-soc-red',
  ALLOW: 'text-soc-green',
  DROP: 'text-soc-amber',
  RATE_LIMIT: 'text-soc-cyber',
};

const MAX_LOGS = 30;

export default function FirewallLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(() => Array.from({ length: 15 }, generateLog));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [generateLog(), ...prev];
        return next.slice(0, MAX_LOGS);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to top
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [logs]);

  const blocked = logs.filter(l => l.action === 'BLOCK').length;
  const allowed = logs.filter(l => l.action === 'ALLOW').length;

  return (
    <div className="p-3">
      {/* Stats row */}
      <div className="flex gap-4 mb-2 text-[10px]">
        <span className="text-soc-muted">TOTAL: <span className="text-soc-text font-bold">{logs.length}</span></span>
        <span className="text-soc-muted">BLOCKED: <span className="text-soc-red font-bold">{blocked}</span></span>
        <span className="text-soc-muted">ALLOWED: <span className="text-soc-green font-bold">{allowed}</span></span>
      </div>

      {/* Log stream */}
      <div ref={scrollRef} className="overflow-y-auto font-mono text-[9px] leading-relaxed" style={{ height: 210 }}>
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 py-0.5 hover:bg-white/[0.02] px-1 rounded">
            <span className="text-soc-muted w-16 shrink-0">{log.time}</span>
            <span className={`w-16 shrink-0 font-bold ${actionColor[log.action]}`}>{log.action}</span>
            <span className="text-soc-cyber w-28 shrink-0 truncate">{log.src}</span>
            <span className="text-soc-muted">→</span>
            <span className="text-soc-text w-24 shrink-0 truncate">{log.dst}:{log.port}</span>
            <span className="text-soc-purple w-8 shrink-0">{log.proto}</span>
            <span className="text-soc-muted truncate flex-1">{log.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
