/**
 * Must match Vulnsploit/backend/scanner/validators.py VALID_SCAN_TYPES
 */
export const SCAN_TYPES = {
  nmap: [
    { id: 'quick', label: 'Quick Scan', desc: 'Fast top ports' },
    { id: 'full', label: 'Full Scan', desc: 'All ports + versions' },
    { id: 'os_detection', label: 'OS Detection', desc: 'Fingerprint OS' },
    { id: 'aggressive', label: 'Aggressive', desc: 'OS + version + scripts' },
    { id: 'udp', label: 'UDP Scan', desc: 'UDP ports' },
    { id: 'ping_sweep', label: 'Ping Sweep', desc: 'Host discovery' },
    { id: 'service_version', label: 'Service Version', desc: 'Version detection' },
    { id: 'stealth', label: 'Stealth SYN', desc: 'SYN scan' },
    { id: 'vuln', label: 'Vuln Scripts', desc: 'Nmap vuln scripts' },
  ],
  web: [
    { id: 'nikto', label: 'Nikto', desc: 'Web server scanner' },
    { id: 'gobuster', label: 'Gobuster', desc: 'Directory brute force' },
    { id: 'whatweb', label: 'WhatWeb', desc: 'Technology fingerprint' },
    { id: 'wpscan', label: 'WPScan', desc: 'WordPress scanner' },
  ],
  exploit: [
    { id: 'sqlmap', label: 'SQLMap', desc: 'SQL injection testing' },
  ],
  recon: [
    { id: 'subfinder', label: 'Subfinder', desc: 'Subdomain discovery' },
    { id: 'nuclei', label: 'Nuclei', desc: 'Template-based vulns' },
  ],
} as const;

export type ScanTypeId =
  | (typeof SCAN_TYPES.nmap)[number]['id']
  | (typeof SCAN_TYPES.web)[number]['id']
  | (typeof SCAN_TYPES.exploit)[number]['id']
  | (typeof SCAN_TYPES.recon)[number]['id'];

export const FULL_RECON_TOOLS = [
  'subfinder',
  'whatweb',
  'quick',
  'nikto',
  'gobuster',
  'nuclei',
  'sqlmap',
] as const;

export const LEGAL_DISCLAIMER =
  'FOR AUTHORIZED PENETRATION TESTING ONLY. Only scan targets you own or have written permission to test.';
