export interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  affected_users?: number;
}

export interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'unauthorized_access' | 'data_breach' | 'malware' | 'ddos';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source_ip: string;
  target_user?: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  port?: string;
  enabled: boolean;
  priority: number;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  user?: string;
  ip_address?: string;
}
