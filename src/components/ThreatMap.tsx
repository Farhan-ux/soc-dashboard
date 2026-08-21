import { useEffect, useRef, useState } from 'react';
import { attackEvents, type AttackEvent } from '@/data/threats';

function latLonToXY(lat: number, lon: number, width: number, height: number): [number, number] {
  const x = ((lon + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * height * 0.85;
  return [x, y];
}

const typeColors: Record<string, string> = {
  ddos: '#ff2d55',
  brute_force: '#ff6b35',
  sql_injection: '#ffb800',
  xss: '#a855f7',
  port_scan: '#00f0ff',
  phishing: '#06b6d4',
  malware: '#f43f5e',
  ransomware: '#dc2626',
};

const severityGlow: Record<string, string> = {
  critical: '0 0 12px 3px rgba(255,45,85,0.7)',
  high: '0 0 8px 2px rgba(255,107,53,0.6)',
  medium: '0 0 6px 2px rgba(255,184,0,0.5)',
  low: '0 0 4px 1px rgba(0,255,136,0.4)',
};

export default function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredAttack, setHoveredAttack] = useState<AttackEvent | null>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    // Draw world map dots (simplified coastline representation)
    const drawMapDots = () => {
      ctx.fillStyle = 'rgba(26, 37, 53, 0.8)';
      // Generate a grid of dots for world map feel
      for (let lat = -70; lat <= 80; lat += 5) {
        for (let lon = -180; lon <= 180; lon += 5) {
          // Skip ocean areas roughly
          const isLand = isLandArea(lat, lon);
          if (isLand) {
            const [x, y] = latLonToXY(lat, lon, W, H);
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const isLandArea = (lat: number, lon: number): boolean => {
      // Simplified continent detection
      if (lat > 25 && lat < 72 && lon > -130 && lon < -60) return true; // North America
      if (lat > -55 && lat < 12 && lon > -80 && lon < -35) return true; // South America
      if (lat > 36 && lat < 71 && lon > -10 && lon < 40) return true; // Europe
      if (lat > -35 && lat < 37 && lon > -18 && lon < 52) return true; // Africa
      if (lat > 10 && lat < 70 && lon > 40 && lon < 140) return true; // Asia
      if (lat > -45 && lat < -10 && lon > 112 && lon < 155) return true; // Australia
      if (lat > 25 && lat < 45 && lon > 125 && lon < 145) return true; // Japan/Korea
      return false;
    };

    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(26, 37, 53, 0.3)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < W; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
      }
      for (let i = 0; i < H; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }

      drawMapDots();

      // Draw attack lines
      attackEvents.forEach((atk, idx) => {
        const [x1, y1] = latLonToXY(atk.origin.lat, atk.origin.lon, W, H);
        const [x2, y2] = latLonToXY(atk.target.lat, atk.target.lon, W, H);
        const color = typeColors[atk.type] || '#ff2d55';
        const progress = ((frameRef.current * 0.8 + idx * 30) % 100) / 100;

        // Attack line
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Moving pulse along line
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Origin dot
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = severityGlow[atk.severity] ? 6 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulsing ring on origin
        const pulseR = 5 + Math.sin(frameRef.current * 0.05 + idx) * 3;
        ctx.beginPath();
        ctx.arc(x1, y1, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3 + Math.sin(frameRef.current * 0.05 + idx) * 0.2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Target dot
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 290 }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: 'auto' }} />
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[9px] flex-wrap">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-soc-muted uppercase">{type.replace('_', ' ')}</span>
          </span>
        ))}
      </div>
      {/* Tooltip */}
      {hoveredAttack && (
        <div className="absolute top-2 right-2 bg-soc-panel border border-soc-border p-2 text-[10px] rounded">
          <div className="text-soc-cyber font-semibold">{hoveredAttack.origin.city}, {hoveredAttack.origin.country}</div>
          <div className="text-soc-muted">→ {hoveredAttack.target.label}</div>
          <div style={{ color: typeColors[hoveredAttack.type] }}>{hoveredAttack.type.replace('_', ' ').toUpperCase()}</div>
        </div>
      )}
    </div>
  );
}