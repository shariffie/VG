export type NavSection = 'Overview' | 'Energy' | 'Billing' | 'Data' | 'System Management' | 'Project Management' | 'Dashboard Configuration';

export interface Device {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'Online' | 'Offline';
  operatingStatus: 'Normal' | 'Fault';
  installationDate: string;
}

export interface EnergyData {
  time: string;
  consumption: number;
  cost: number;
}

export interface WaterData {
  time: string;
  consumption: number;
  cost: number;
}
