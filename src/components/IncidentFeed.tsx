import { incidents } from '@/data/threats';

const severityBadge: Record<string, string> = {
  critical: 'bg-soc-red/20 text-soc-red border-soc-red/40',
  high: 'bg-[#ff6b35]/20 text-[#ff6b35] border-[#ff6b35]/40',
  medium: 'bg-soc-amber/20 text-soc-amber border-soc-amber/40',
  low: 'bg-soc-green/20 text-soc-green border-soc-green/40',
};

const statusDot: Record<string, string> = {
  active: 'bg-soc-red animate-pulse',
  investigating: 'bg-soc-amber animate-pulse',
  contained: 'bg-soc-cyber',
  resolved: 'bg-soc-green',
};

export default function IncidentFeed() {
  return (
    <div className="overflow-y-auto" style={{ height: 290 }}>
      <div className="divide-y divide-soc-border">
        {incidents.map(inc => (
          <div key={inc.id} className="px-3 py-2 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[inc.status]}`} />
                <span className="text-[10px] font-semibold text-soc-cyber">{inc.id}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${severityBadge[inc.severity]}`}>
                  {inc.severity.toUpperCase()}
                </span>
              </div>
              <span className="text-[9px] text-soc-muted">{inc.time}</span>
            </div>
            <div className="text-[10px] text-soc-text leading-relaxed ml-3.5">
              {inc.description}
            </div>
            <div className="flex items-center gap-3 mt-1 ml-3.5 text-[9px] text-soc-muted">
              <span>SRC: {inc.source_ip}</span>
              <span>→ {inc.target}</span>
              <span className="uppercase">{inc.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}