export interface AttackEvent {
  id: string;
  origin: { lat: number; lon: number; country: string; city: string };
  target: { lat: number; lon: number; label: string };
  type: 'ddos' | 'brute_force' | 'sql_injection' | 'xss' | 'port_scan' | 'phishing' | 'malware' | 'ransomware';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface Incident {
  id: string;
  time: string;
  source_ip: string;
  target: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'contained' | 'resolved';
  description: string;
}

export const attackEvents: AttackEvent[] = [
  { id: 'a1', origin: { lat: 55.75, lon: 37.62, country: 'RU', city: 'Moscow' }, target: { lat: 40.71, lon: -74.01, label: 'NYC-DC-01' }, type: 'ddos', severity: 'critical', timestamp: '14:23:01' },
  { id: 'a2', origin: { lat: 39.90, lon: 116.40, country: 'CN', city: 'Beijing' }, target: { lat: 51.51, lon: -0.13, label: 'LON-SV-03' }, type: 'port_scan', severity: 'high', timestamp: '14:22:45' },
  { id: 'a3', origin: { lat: -23.55, lon: -46.63, country: 'BR', city: 'São Paulo' }, target: { lat: 37.77, lon: -122.42, label: 'SF-WEB-02' }, type: 'sql_injection', severity: 'critical', timestamp: '14:22:12' },
  { id: 'a4', origin: { lat: 35.68, lon: 139.69, country: 'JP', city: 'Tokyo' }, target: { lat: 52.52, lon: 13.41, label: 'BER-DB-01' }, type: 'brute_force', severity: 'high', timestamp: '14:21:58' },
  { id: 'a5', origin: { lat: 28.61, lon: 77.21, country: 'IN', city: 'New Delhi' }, target: { lat: 1.35, lon: 103.82, label: 'SGP-API-01' }, type: 'xss', severity: 'medium', timestamp: '14:21:30' },
  { id: 'a6', origin: { lat: 41.01, lon: 28.98, country: 'TR', city: 'Istanbul' }, target: { lat: 48.86, lon: 2.35, label: 'PAR-CDN-02' }, type: 'malware', severity: 'high', timestamp: '14:20:55' },
  { id: 'a7', origin: { lat: 33.89, lon: 35.50, country: 'LB', city: 'Beirut' }, target: { lat: 34.05, lon: -118.24, label: 'LA-APP-01' }, type: 'phishing', severity: 'medium', timestamp: '14:20:22' },
  { id: 'a8', origin: { lat: -1.29, lon: 36.82, country: 'KE', city: 'Nairobi' }, target: { lat: -33.87, lon: 151.21, label: 'SYD-AUTH-01' }, type: 'ransomware', severity: 'critical', timestamp: '14:19:48' },
  { id: 'a9', origin: { lat: 25.20, lon: 55.27, country: 'AE', city: 'Dubai' }, target: { lat: 43.65, lon: -79.38, label: 'TOR-PAY-01' }, type: 'ddos', severity: 'high', timestamp: '14:19:15' },
  { id: 'a10', origin: { lat: 50.45, lon: 30.52, country: 'UA', city: 'Kyiv' }, target: { lat: 35.68, lon: 139.69, label: 'TKY-SRV-01' }, type: 'port_scan', severity: 'medium', timestamp: '14:18:42' },
];

export const incidents: Incident[] = [
  { id: 'INC-4471', time: '14:23:01', source_ip: '185.220.101.34', target: 'NYC-DC-01', type: 'DDoS', severity: 'critical', status: 'active', description: 'Volumetric TCP flood targeting primary data center — 45Gbps ingress' },
  { id: 'INC-4470', time: '14:22:12', source_ip: '177.54.150.221', target: 'SF-WEB-02', type: 'SQL Injection', severity: 'critical', status: 'investigating', description: 'Union-based SQL injection attempt on customer portal login endpoint' },
  { id: 'INC-4469', time: '14:21:58', source_ip: '103.224.182.5', target: 'BER-DB-01', type: 'Brute Force', severity: 'high', status: 'active', description: 'SSH brute force — 12,000 attempts in 5 min from distributed IPs' },
  { id: 'INC-4468', time: '14:20:55', source_ip: '85.105.42.198', target: 'PAR-CDN-02', type: 'Malware', severity: 'high', status: 'contained', description: 'Trojan dropper detected in uploaded file — sandboxed and quarantined' },
  { id: 'INC-4467', time: '14:19:48', source_ip: '196.201.214.87', target: 'SYD-AUTH-01', type: 'Ransomware', severity: 'critical', status: 'investigating', description: 'LockBit variant detected in email attachment — endpoint isolated' },
  { id: 'INC-4466', time: '14:19:15', source_ip: '94.200.77.12', target: 'TOR-PAY-01', type: 'DDoS', severity: 'high', status: 'contained', description: 'Application-layer HTTP flood mitigated by WAF rate limiting' },
  { id: 'INC-4465', time: '14:18:42', source_ip: '91.219.236.17', target: 'TKY-SRV-01', type: 'Port Scan', severity: 'medium', status: 'resolved', description: 'Sequential port scan on 1000 ports — blocked by firewall rules' },
  { id: 'INC-4464', time: '14:17:30', source_ip: '45.33.32.156', target: 'LON-SV-03', type: 'XSS', severity: 'medium', status: 'resolved', description: 'Reflected XSS via search parameter — input sanitization patched' },
];

export const threatLevels = [
  { level: 5, label: 'SEVERE', color: '#ff2d55', description: 'Active critical attacks on multiple vectors' },
  { level: 4, label: 'HIGH', color: '#ff6b35', description: 'Multiple high-severity incidents in progress' },
  { level: 3, label: 'ELEVATED', color: '#ffb800', description: 'Elevated threat activity detected' },
  { level: 2, label: 'GUARDED', color: '#00f0ff', description: 'Routine monitoring — no immediate threats' },
  { level: 1, label: 'LOW', color: '#00ff88', description: 'All clear — normal operations' },
];

export const currentThreatLevel = threatLevels[2]; // ELEVATED
