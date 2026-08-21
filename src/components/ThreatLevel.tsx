import { useEffect, useState } from 'react';
import { threatLevels, currentThreatLevel, attackEvents } from '@/data/threats';

export default function ThreatLevel() {
  const [activeLevel, setActiveLevel] = useState(currentThreatLevel);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(interval);
  }, []);

  const typeCounts = attackEvents.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-3 flex flex-col h-full" style={{ minHeight: 290 }}>
      {/* DEFCON-style indicator */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-[9px] text-soc-muted tracking-[3px] mb-2">THREAT ADVISORY</div>
        <div
          className="text-5xl font-black tracking-widest mb-1 transition-all duration-500"
          style={{
            color: activeLevel.color,
            textShadow: pulse
              ? `0 0 30px ${activeLevel.color}, 0 0 60px ${activeLevel.color}40`
              : `0 0 10px ${activeLevel.color}40`,
          }}
        >
          {activeLevel.label}
        </div>
        <div className="text-[10px] text-soc-muted mt-1 text-center max-w-[200px]">
          {activeLevel.description}
        </div>

        {/* Level bars */}
        <div className="flex gap-1 mt-4">
          {threatLevels.map(tl => (
            <div
              key={tl.level}
              className="w-8 h-16 rounded-sm border flex flex-col items-center justify-end pb-1 transition-all"
              style={{
                borderColor: tl.level <= activeLevel.level ? tl.color : '#1a2535',
                background: tl.level <= activeLevel.level
                  ? `${tl.color}15`
                  : 'transparent',
              }}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: tl.level <= activeLevel.level ? tl.color : '#4a5568' }}
              >
                {tl.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attack type breakdown */}
      <div className="border-t border-soc-border pt-2 mt-2">
        <div className="text-[9px] text-soc-muted tracking-widest mb-2">ACTIVE ATTACK VECTORS</div>
        <div className="space-y-1">
          {Object.entries(typeCounts).sort(([,a],[,b]) => b - a).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-[10px]">
              <span className="text-soc-text uppercase tracking-wider">{type.replace('_', ' ')}</span>
              <span className="font-bold text-soc-amber">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}