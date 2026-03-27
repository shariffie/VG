import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip as LeafletTooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  LayoutDashboard, MapPin, Zap, Droplets, BarChart3, CreditCard, Database, Settings, FolderTree, Layout, Bell, User, Search, ChevronDown, ChevronLeft, ChevronRight, Menu, X, Plus, RefreshCw, MoreVertical, Eye, Trash2, Edit, ExternalLink, Filter, FileText, Users, Package, Cpu, Map, AlertTriangle, MessageSquare, ClipboardList, HardDrive, Monitor, Shield, Building2, Key, Globe, AlertCircle, ZapOff, Activity, Droplet, DollarSign, Leaf, Flame, Building, Factory, ShoppingCart, Home, Info, ArrowRight, ShoppingBag, Download, ZoomIn, ZoomOut, Move, ArrowUpNarrowWide, ArrowDownWideNarrow, Trophy, List, ArrowUp, ArrowDown, LogOut, Sun, Moon, Box
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { NavSection } from './types';
import { DashboardCard } from './components/DashboardCard';

// ==========================================
// 🎨 STANDARDIZED THEME DICTIONARY
// ==========================================
const THEME = {
  brand: {
    primary: '#10b981',   // Emerald 500
    secondary: '#1e293b', // Gray 800
  },
  domain: {
    electricity: '#f59e0b', // Amber 500
    water: '#3b82f6',       // Blue 500
    gas: '#f97316',         // Orange 500
    carbon: '#10b981',      // Emerald 500
    cost: '#6366f1',        // Indigo 500
  },
  status: {
    Online: '#10b981',      // Emerald 500
    Warning: '#f59e0b',     // Amber 500
    Critical: '#ef4444',    // Red 500
    Offline: '#9ca3af',     // Gray 400
  },
  chart: {
    gridLight: '#e5e7eb',
    textLight: '#9ca3af',
    bgLight: '#ffffff',
  }
};

// Map Chart Colors to Array for PieCharts
const CHART_COLORS_ARRAY = [THEME.domain.electricity, THEME.domain.water, THEME.domain.gas, THEME.brand.primary, THEME.domain.cost];

// Leaflet Icon Fix (Using Theme Status)
const createCustomIcon = (status: string) => {
  // @ts-ignore - Ensure status matches keys
  const color = THEME.status[status] || THEME.status.Offline;
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Map Controller Component
function MapController({ center, zoom, onMapClick }: { center: [number, number], zoom: number, onMapClick?: () => void }) {
  const map = useMap();
  useMapEvents({
    click: () => {
      if (onMapClick) onMapClick();
    }
  });
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Custom Select Component
function CustomSelect({ 
  value, 
  options, 
  onChange, 
  className, 
  placeholder,
  minWidth = "100px",
  listMinWidth = "120px"
}: { 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void; 
  className?: string; 
  placeholder?: string;
  minWidth?: string;
  listMinWidth?: string;
}) {
  const [isOpen, ReactSetIsOpen] = React.useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => ReactSetIsOpen(!isOpen)}
        className={cn(
          "bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-secondary pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-primary/30 focus:border-primary outline-none cursor-pointer hover:border-primary/50 transition-all flex items-center shadow-sm",
          className
        )}
        style={{ minWidth }}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200", isOpen && "rotate-180 text-primary")} size={12} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[1001]" onClick={() => ReactSetIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[1002] overflow-hidden"
              style={{ minWidth: listMinWidth }}
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      ReactSetIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-[11px] font-medium hover:bg-gray-50 transition-colors",
                      value === option ? "text-primary bg-primary/5 font-bold" : "text-secondary"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SPACES HIERARCHY STATE ---
  const initialSpaces = [
    {
      id: 'root-1',
      name: 'VG HQ Tower',
      type: 'Building',
      area: 12500,
      children: [
        {
          id: 'fl-1',
          name: 'Level 1',
          type: 'Floor',
          area: 3000,
          children: [
            { id: 'rm-101', name: 'Lobby', type: 'Room', area: 500 },
            { id: 'rm-102', name: 'Main Office', type: 'Room', area: 2500 }
          ]
        },
        {
          id: 'fl-2',
          name: 'Level 2',
          type: 'Floor',
          area: 3000,
          children: [
            { id: 'rm-201', name: 'Server Room', type: 'Room', area: 450 },
            { id: 'rm-202', name: 'Meeting Room A', type: 'Room', area: 150 }
          ]
        }
      ]
    }
  ];

// Mock Data
const rankingData = [
  { name: 'Air condition electricity', value: 110.59 },
  { name: 'Indoor lighting', value: 28.17 },
  { name: 'Indoor socket electricity', value: 23.67 },
];

type MapLens = 'Status' | 'Energy' | 'Water' | 'Gas' | 'Carbon' | 'Cost';

interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Online' | 'Warning' | 'Critical' | 'Offline';
  type: 'Commercial' | 'Industrial' | 'Retail' | 'Data Center' | 'Accommodation';
  alarms: number;
  address: string;
  city: string;
  lastUpdate: string;
  topAlert?: string;
  energyToday: number;
  waterToday: number;
  gasToday: number;
  carbonToday: number;
  demand: number;
  costToday: number;
  gfa: number; // Gross Floor Area in m2
  country: string;
  customer: string;
  stats?: any;
}

const COUNTRY_VIEWPORTS: Record<string, { zoom: number; center: [number, number] }> = {
  'World': { zoom: 3, center: [15, 105] },
  'Singapore': { zoom: 12, center: [1.3521, 103.8198] },
  'Malaysia': { zoom: 6, center: [4.2105, 101.9758] },
  'Indonesia': { zoom: 5, center: [-0.7893, 113.9213] },
  'Thailand': { zoom: 6, center: [15.8700, 100.9925] },
  'United Kingdom': { zoom: 6, center: [55.3781, -3.4360] },
  'USA': { zoom: 4, center: [37.0902, -95.7129] },
  'Australia': { zoom: 4, center: [-25.2744, 133.7751] },
  'Germany': { zoom: 6, center: [51.1657, 10.4515] },
  'Japan': { zoom: 5, center: [36.2048, 138.2529] },
  'Canada': { zoom: 4, center: [56.1304, -106.3468] },
  'Brazil': { zoom: 4, center: [-14.2350, -51.9253] },
  'South Africa': { zoom: 5, center: [-30.5595, 22.9375] },
  'France': { zoom: 6, center: [46.2276, 2.2137] },
  'UAE': { zoom: 7, center: [23.4241, 53.8478] },
  'India': { zoom: 5, center: [20.5937, 78.9629] },
  'Mexico': { zoom: 5, center: [23.6345, -102.5528] },
  'South Korea': { zoom: 7, center: [35.9078, 127.7669] },
  'Spain': { zoom: 6, center: [40.4637, -3.7492] },
  'Vietnam': { zoom: 6, center: [14.0583, 108.2772] },
  'Italy': { zoom: 6, center: [41.8719, 12.5674] },
};

const MOCK_SITES: Site[] = [
  // Vector Green (5 sites)
  {
    id: '1',
    name: 'VG HQ Tower',
    lat: 1.2834, lng: 103.8507,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: '123 Innovation Way',
    city: 'Singapore',
    lastUpdate: '2 mins ago',
    energyToday: 1250,
    waterToday: 45,
    gasToday: 12,
    carbonToday: 0.85,
    demand: 85,
    costToday: 185.50,
    gfa: 12500,
    country: 'Singapore',
    customer: 'Vector Green',
    stats: { electricity: { consumption: 1250, cost: 185.50, carbon: 0.85 } }
  },
  {
    id: '2',
    name: 'Thames Logistics Hub',
    lat: 51.5074, lng: -0.1278,
    status: 'Warning',
    type: 'Industrial',
    alarms: 1,
    address: 'Canary Wharf',
    city: 'London',
    lastUpdate: '5 mins ago',
    energyToday: 4500,
    waterToday: 120,
    gasToday: 85,
    carbonToday: 3.2,
    demand: 450,
    costToday: 670.20,
    gfa: 45000,
    country: 'United Kingdom',
    customer: 'Vector Green'
  },
  {
    id: '3',
    name: 'Manhattan Center',
    lat: 40.7128, lng: -74.0060,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: '5th Avenue',
    city: 'New York',
    lastUpdate: '10 mins ago',
    energyToday: 3200,
    waterToday: 85,
    gasToday: 25,
    carbonToday: 1.8,
    demand: 210,
    costToday: 450.00,
    gfa: 28000,
    country: 'USA',
    customer: 'Vector Green'
  },
  {
    id: '4',
    name: 'Harbor View Sydney',
    lat: -33.8688, lng: 151.2093,
    status: 'Critical',
    type: 'Retail',
    alarms: 3,
    address: 'George Street',
    city: 'Sydney',
    lastUpdate: '1 min ago',
    energyToday: 12500,
    waterToday: 340,
    gasToday: 0,
    carbonToday: 8.5,
    demand: 1200,
    costToday: 2450.00,
    gfa: 8500,
    country: 'Australia',
    customer: 'Vector Green'
  },
  {
    id: '5',
    name: 'Euro Plaza Berlin',
    lat: 52.5200, lng: 13.4050,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Alexanderplatz',
    city: 'Berlin',
    lastUpdate: '1 hour ago',
    energyToday: 2100,
    waterToday: 30,
    gasToday: 10,
    carbonToday: 1.2,
    demand: 150,
    costToday: 340.00,
    gfa: 12000,
    country: 'Germany',
    customer: 'Vector Green'
  },

  // Global Logistics (5 sites)
  {
    id: '6',
    name: 'KL Gateway Tower',
    lat: 3.1390, lng: 101.6869,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Jalan Kerinchi',
    city: 'Kuala Lumpur',
    lastUpdate: '5 mins ago',
    energyToday: 3400,
    waterToday: 90,
    gasToday: 20,
    carbonToday: 2.1,
    demand: 280,
    costToday: 520.00,
    gfa: 35000,
    country: 'Malaysia',
    customer: 'Global Logistics'
  },
  {
    id: '7',
    name: 'Shibuya Tech Hub',
    lat: 35.6762, lng: 139.6503,
    status: 'Warning',
    type: 'Data Center',
    alarms: 1,
    address: 'Shibuya Crossing',
    city: 'Tokyo',
    lastUpdate: '15 mins ago',
    energyToday: 8200,
    waterToday: 450,
    gasToday: 150,
    carbonToday: 6.4,
    demand: 750,
    costToday: 1450.00,
    gfa: 62000,
    country: 'Japan',
    customer: 'Global Logistics'
  },
  {
    id: '8',
    name: 'Pacific Port Vancouver',
    lat: 49.2827, lng: -123.1207,
    status: 'Online',
    type: 'Industrial',
    alarms: 0,
    address: 'Waterfront Road',
    city: 'Vancouver',
    lastUpdate: '20 mins ago',
    energyToday: 5600,
    waterToday: 150,
    gasToday: 40,
    carbonToday: 4.1,
    demand: 320,
    costToday: 820.00,
    gfa: 18500,
    country: 'Canada',
    customer: 'Global Logistics'
  },
  {
    id: '9',
    name: 'Amazonas Center',
    lat: -23.5505, lng: -46.6333,
    status: 'Warning',
    type: 'Commercial',
    alarms: 2,
    address: 'Paulista Avenue',
    city: 'Sao Paulo',
    lastUpdate: '8 mins ago',
    energyToday: 7200,
    waterToday: 500,
    gasToday: 120,
    carbonToday: 5.8,
    demand: 600,
    costToday: 1100.00,
    gfa: 55000,
    country: 'Brazil',
    customer: 'Global Logistics'
  },
  {
    id: '10',
    name: 'Table Mountain Hub',
    lat: -33.9249, lng: 18.4241,
    status: 'Online',
    type: 'Industrial',
    alarms: 0,
    address: 'V&A Waterfront',
    city: 'Cape Town',
    lastUpdate: '3 mins ago',
    energyToday: 4100,
    waterToday: 110,
    gasToday: 35,
    carbonToday: 2.8,
    demand: 340,
    costToday: 780.00,
    gfa: 42000,
    country: 'South Africa',
    customer: 'Global Logistics'
  },

  // Eco Park (5 sites)
  {
    id: '11',
    name: 'Jakarta Energy Hub',
    lat: -6.2088, lng: 106.8456,
    status: 'Warning',
    type: 'Industrial',
    alarms: 2,
    address: 'Pulogadung',
    city: 'Jakarta',
    lastUpdate: '12 mins ago',
    energyToday: 8200,
    waterToday: 450,
    gasToday: 150,
    carbonToday: 6.4,
    demand: 750,
    costToday: 1450.00,
    gfa: 62000,
    country: 'Indonesia',
    customer: 'Eco Park'
  },
  {
    id: '12',
    name: 'Seine Office Paris',
    lat: 48.8566, lng: 2.3522,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Le Marais',
    city: 'Paris',
    lastUpdate: '4 mins ago',
    energyToday: 2800,
    waterToday: 180,
    gasToday: 45,
    carbonToday: 2.1,
    demand: 180,
    costToday: 420.00,
    gfa: 35000,
    country: 'France',
    customer: 'Eco Park'
  },
  {
    id: '13',
    name: 'Desert Oasis Dubai',
    lat: 25.2048, lng: 55.2708,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Business Bay',
    city: 'Dubai',
    lastUpdate: '7 mins ago',
    energyToday: 3500,
    waterToday: 250,
    gasToday: 60,
    carbonToday: 2.8,
    demand: 240,
    costToday: 550.00,
    gfa: 42000,
    country: 'UAE',
    customer: 'Eco Park'
  },
  {
    id: '14',
    name: 'Gateway Plaza Mumbai',
    lat: 19.0760, lng: 72.8777,
    status: 'Warning',
    type: 'Retail',
    alarms: 1,
    address: 'Colaba',
    city: 'Mumbai',
    lastUpdate: '12 mins ago',
    energyToday: 1500,
    waterToday: 95,
    gasToday: 20,
    carbonToday: 1.2,
    demand: 110,
    costToday: 210.00,
    gfa: 22000,
    country: 'India',
    customer: 'Eco Park'
  },
  {
    id: '15',
    name: 'Aztec Center Mexico',
    lat: 19.4326, lng: -99.1332,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Zocalo',
    city: 'Mexico City',
    lastUpdate: '20 mins ago',
    energyToday: 2100,
    waterToday: 30,
    gasToday: 10,
    carbonToday: 1.2,
    demand: 150,
    costToday: 340.00,
    gfa: 12000,
    country: 'Mexico',
    customer: 'Eco Park'
  },

  // Tech Hub (5 sites)
  {
    id: '16',
    name: 'Bangkok Smart Mall',
    lat: 13.7563, lng: 100.5018,
    status: 'Online',
    type: 'Retail',
    alarms: 0,
    address: 'Rama I Rd',
    city: 'Bangkok',
    lastUpdate: '3 mins ago',
    energyToday: 4100,
    waterToday: 110,
    gasToday: 35,
    carbonToday: 2.8,
    demand: 340,
    costToday: 780.00,
    gfa: 42000,
    country: 'Thailand',
    customer: 'Tech Hub'
  },
  {
    id: '17',
    name: 'Gangnam Tech Seoul',
    lat: 37.5665, lng: 126.9780,
    status: 'Warning',
    type: 'Data Center',
    alarms: 2,
    address: 'Gangnam District',
    city: 'Seoul',
    lastUpdate: '8 mins ago',
    energyToday: 7200,
    waterToday: 500,
    gasToday: 120,
    carbonToday: 5.8,
    demand: 600,
    costToday: 1100.00,
    gfa: 55000,
    country: 'South Korea',
    customer: 'Tech Hub'
  },
  {
    id: '18',
    name: 'Iberian Center Madrid',
    lat: 40.4168, lng: -3.7038,
    status: 'Online',
    type: 'Commercial',
    alarms: 0,
    address: 'Gran Via',
    city: 'Madrid',
    lastUpdate: '15 mins ago',
    energyToday: 3400,
    waterToday: 90,
    gasToday: 20,
    carbonToday: 2.1,
    demand: 280,
    costToday: 520.00,
    gfa: 35000,
    country: 'Spain',
    customer: 'Tech Hub'
  },
  {
    id: '19',
    name: 'Saigon Tower HCMC',
    lat: 10.8231, lng: 106.6297,
    status: 'Warning',
    type: 'Commercial',
    alarms: 1,
    address: 'District 1',
    city: 'Ho Chi Minh City',
    lastUpdate: '10 mins ago',
    energyToday: 3200,
    waterToday: 85,
    gasToday: 25,
    carbonToday: 1.8,
    demand: 210,
    costToday: 450.00,
    gfa: 28000,
    country: 'Vietnam',
    customer: 'Tech Hub'
  },
  {
    id: '20',
    name: 'Colosseum View Rome',
    lat: 41.9028, lng: 12.4964,
    status: 'Online',
    type: 'Accommodation',
    alarms: 0,
    address: 'Via dei Fori Imperiali',
    city: 'Rome',
    lastUpdate: '5 mins ago',
    energyToday: 2800,
    waterToday: 180,
    gasToday: 45,
    carbonToday: 2.1,
    demand: 180,
    costToday: 420.00,
    gfa: 35000,
    country: 'Italy',
    customer: 'Tech Hub'
  },
];

export default function App() {
  const [spacesTree, setSpacesTree] = useState(initialSpaces);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('root-1');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 'root-1': true, 'fl-1': true });

  // Helper to find a space by ID recursively
  const findSpace = (nodes: any[], id: string): any => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findSpace(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeSpaceDetails = useMemo(() => findSpace(spacesTree, selectedSpaceId), [spacesTree, selectedSpaceId]);

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [selectedCountry, setSelectedCountry] = useState<string>('World');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [chartTagFilter, setChartTagFilter] = useState('Filter by tag');
  const [chartEnergyTagFilter, setChartEnergyTagFilter] = useState('All energy tags');
  const [waterSpaceFilter, setWaterSpaceFilter] = useState('All spaces');
  const [energyAnalysisTagFilter, setEnergyAnalysisTagFilter] = useState('Filter by tag');
  const [billingTenantFilter, setBillingTenantFilter] = useState('All Tenants');
  const [billingTypeFilter, setBillingTypeFilter] = useState('Filter by type');
  const [billingStatusFilter, setBillingStatusFilter] = useState('Filter by status');
  const [dataDeviceFilter, setDataDeviceFilter] = useState('All devices');
  const [systemProjectFilter, setSystemProjectFilter] = useState('All projects');
  const [projectSpaceFilter, setProjectSpaceFilter] = useState('All spaces');
  const [timezoneFilter, setTimezoneFilter] = useState('UTC+08:00 (Singapore)');
  const [languageFilter, setLanguageFilter] = useState('English');
  const [activeSection, setActiveSection] = useState<NavSection>('Overview');
  const [activeSubSection, setActiveSubSection] = useState('Sites');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('Vector Green');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const customers = ['Vector Green', 'Global Logistics', 'Tech Hub', 'Eco Park'];
  const notifications = [
    { id: 1, title: 'Critical Alarm', message: 'High energy usage at Site A', time: '5m ago', type: 'critical' },
    { id: 2, title: 'Maintenance', message: 'Scheduled check for Site B', time: '1h ago', type: 'warning' },
    { id: 3, title: 'System Update', message: 'New features deployed', time: '3h ago', type: 'info' },
  ];
  
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const currentSite = useMemo(() => {
    return selectedSite || MOCK_SITES.find(s => s.customer === selectedCustomer) || MOCK_SITES[0];
  }, [selectedSite, selectedCustomer]);
  
  // Dashboard Chart State Arrays
  const [electricityTimeframe, setElectricityTimeframe] = useState<'Custom' | 'Today' | '7D' | '30D' | '1Y'>('Today');
  const [electricityCustomRange, setElectricityCustomRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });
  const [tempElectricityRange, setTempElectricityRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });
  
  const [waterTimeframe, setWaterTimeframe] = useState<'Custom' | 'Today' | '7D' | '30D' | '1Y'>('Today');
  const [waterCustomRange, setWaterCustomRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });
  const [tempWaterRange, setTempWaterRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });

  const [gasTimeframe, setGasTimeframe] = useState<'Custom' | 'Today' | '7D' | '30D' | '1Y'>('Today');
  const [gasCustomRange, setGasCustomRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });
  const [tempGasRange, setTempGasRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });

  const [carbonTimeframe, setCarbonTimeframe] = useState<'Custom' | 'Today' | '7D' | '30D' | '1Y'>('Today');
  const [carbonCustomRange, setCarbonCustomRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });
  const [tempCarbonRange, setTempCarbonRange] = useState<{ start: string; end: string }>({ start: '2026-01-01', end: '2026-01-14' });

  const electricityData = useMemo(() => {
    let length = 14;
    if (electricityTimeframe === 'Today') length = 24;
    else if (electricityTimeframe === '7D') length = 7;
    else if (electricityTimeframe === '30D') length = 30;
    else if (electricityTimeframe === '1Y') length = 12;
    else {
      const start = new Date(electricityCustomRange.start);
      const end = new Date(electricityCustomRange.end);
      length = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return Array.from({ length }, (_, i) => ({
      time: electricityTimeframe === 'Today' ? `${i.toString().padStart(2, '0')}:00` : electricityTimeframe === '1Y' ? `Month ${i + 1}` : `Day ${i + 1}`,
      consumption: Math.random() * 20 + 5,
    }));
  }, [electricityTimeframe, electricityCustomRange]);

  const waterData = useMemo(() => {
    let length = 14;
    if (waterTimeframe === 'Today') length = 24;
    else if (waterTimeframe === '7D') length = 7;
    else if (waterTimeframe === '30D') length = 30;
    else if (waterTimeframe === '1Y') length = 12;
    else {
      const start = new Date(waterCustomRange.start);
      const end = new Date(waterCustomRange.end);
      length = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return Array.from({ length }, (_, i) => ({
      time: waterTimeframe === 'Today' ? `${i.toString().padStart(2, '0')}:00` : waterTimeframe === '1Y' ? `Month ${i + 1}` : `Day ${i + 1}`,
      consumption: Math.random() * 4,
    }));
  }, [waterTimeframe, waterCustomRange]);

  const gasData = useMemo(() => {
    let length = 14;
    if (gasTimeframe === 'Today') length = 24;
    else if (gasTimeframe === '7D') length = 7;
    else if (gasTimeframe === '30D') length = 30;
    else if (gasTimeframe === '1Y') length = 12;
    else {
      const start = new Date(gasCustomRange.start);
      const end = new Date(gasCustomRange.end);
      length = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return Array.from({ length }, (_, i) => ({
      time: gasTimeframe === 'Today' ? `${i.toString().padStart(2, '0')}:00` : gasTimeframe === '1Y' ? `Month ${i + 1}` : `Day ${i + 1}`,
      consumption: Math.random() * 10 + 2,
    }));
  }, [gasTimeframe, gasCustomRange]);

  const carbonData = useMemo(() => {
    let length = 14;
    if (carbonTimeframe === 'Today') length = 24;
    else if (carbonTimeframe === '7D') length = 7;
    else if (carbonTimeframe === '30D') length = 30;
    else if (carbonTimeframe === '1Y') length = 12;
    else {
      const start = new Date(carbonCustomRange.start);
      const end = new Date(carbonCustomRange.end);
      length = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return Array.from({ length }, (_, i) => ({
      time: carbonTimeframe === 'Today' ? `${i.toString().padStart(2, '0')}:00` : carbonTimeframe === '1Y' ? `Month ${i + 1}` : `Day ${i + 1}`,
      consumption: Math.random() * 2 + 0.5,
    }));
  }, [carbonTimeframe, carbonCustomRange]);
  
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [mapLens, setMapLens] = useState<MapLens>('Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Online', 'Warning', 'Critical', 'Offline']);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState<[number, number]>([15, 105]);
  const [statsPeriod, setStatsPeriod] = useState<'Today' | 'MTD' | 'YTD'>('Today');
  const [energyPeriod, setEnergyPeriod] = useState<'Today' | 'Last One Year' | 'Custom'>('Today');
  
  const energyChartData = useMemo(() => {
    if (energyPeriod === 'Today') {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        consumption: Math.random() * 20 + 5,
        cost: Math.random() * 5 + 1,
      }));
    } else if (energyPeriod === 'Last One Year') {
      return Array.from({ length: 12 }, (_, i) => ({
        time: `Month ${i + 1}`,
        consumption: Math.random() * 500 + 100,
        cost: Math.random() * 100 + 20,
      }));
    } else {
      return Array.from({ length: 7 }, (_, i) => ({
        time: `Day ${i + 1}`,
        consumption: Math.random() * 100 + 50,
        cost: Math.random() * 20 + 5,
      }));
    }
  }, [energyPeriod]);
  
  const [siteStatsPeriod, setSiteStatsPeriod] = useState<'Today' | 'MTD' | 'YTD'>('Today');
  const [viewMode, setViewMode] = useState<'Map' | 'Table'>('Map');
  const [rankingMetric, setRankingMetric] = useState<'EUI' | 'WEI' | 'Energy' | 'Water' | 'Gas' | 'Carbon'>('EUI');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Site; direction: 'asc' | 'desc' } | null>({ key: 'energyToday', direction: 'desc' });

  const handleCustomerChange = (customer: string) => {
    setSelectedCustomer(customer);
    setIsCustomerDropdownOpen(false);
    setSelectedCountry('World');
    setMapCenter([15, 105]);
    setMapZoom(3);
    setSearchQuery('');
    setStatusFilter(['Online', 'Warning', 'Critical', 'Offline']);
    setTypeFilter([]);
    setSelectedSite(null);
    setIsSidePanelOpen(false);
  };

  const navItems: { name: NavSection; icon: React.ReactNode }[] = [
    { name: 'Overview', icon: <LayoutDashboard size={18} /> },
    { name: 'Energy', icon: <Zap size={18} /> },
    { name: 'Billing', icon: <CreditCard size={18} /> },
    { name: 'Data', icon: <Database size={18} /> },
    { name: 'System Management', icon: <Settings size={18} /> },
    { name: 'Project Management', icon: <FolderTree size={18} /> },
  ];

  const subNavs: Record<string, string[]> = {
    'Overview': ['Sites', 'Dashboard'],
    'Energy': ['Electricity Management', 'Water Management', 'Energy Analysis'],
    'Billing': ['Tenant Management', 'Contract Management', 'Worker Management', 'Bill Management'],
    'Data': ['Device Ledger', 'Message Center', 'Operation Logs', 'Alarm Event', 'Edge Gateway'],
    'System Management': ['System', 'Roles', 'Organizations and Users', 'Projects', 'Products', 'Driver'],
    'Project Management': ['Spaces', 'Alarm Rules', 'Energy Configuration', 'Dashboard Config'],
  };

  const availableCountries = useMemo(() => {
    return ['World', ...new Set(MOCK_SITES.filter(s => s.customer === selectedCustomer).map(site => site.country))];
  }, [selectedCustomer]);

  const filteredSites = useMemo(() => {
    return MOCK_SITES.filter(site => {
      const matchesCustomer = site.customer === selectedCustomer;
      const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || site.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(site.status);
      const matchesType = typeFilter.length === 0 || typeFilter.includes(site.type);
      const matchesCountry = searchQuery !== '' || selectedCountry === 'World' || site.country === selectedCountry;
      return matchesCustomer && matchesSearch && matchesStatus && matchesType && matchesCountry;
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchQuery, statusFilter, typeFilter, selectedCountry, sortConfig, selectedCustomer]);

  const dropdownSites = useMemo(() => {
    return MOCK_SITES.filter(site => 
      site.customer === selectedCustomer && (
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, selectedCustomer]);

  const portfolioStats = useMemo(() => {
    const sitesToAggregate = MOCK_SITES.filter(s => 
      s.customer === selectedCustomer && 
      (selectedCountry === 'World' || s.country === selectedCountry)
    );

    return sitesToAggregate.reduce((acc, site) => {
      acc.totalEnergy += site.energyToday;
      acc.totalWater += site.waterToday;
      acc.totalGas += site.gasToday;
      acc.totalCarbon += site.carbonToday;
      acc.totalCost += site.costToday;
      acc.totalAlarms += site.alarms;
      acc.onlineCount += site.status === 'Online' ? 1 : 0;
      acc.criticalCount += site.status === 'Critical' ? 1 : 0;
      acc.warningCount += site.status === 'Warning' ? 1 : 0;
      acc.offlineCount += site.status === 'Offline' ? 1 : 0;
      return acc;
    }, { 
      totalEnergy: 0, 
      totalWater: 0, 
      totalGas: 0,
      totalCarbon: 0,
      totalCost: 0, 
      totalAlarms: 0, 
      onlineCount: 0,
      criticalCount: 0, 
      warningCount: 0, 
      offlineCount: 0 
    });
  }, [selectedCountry, selectedCustomer]);

  const handleSort = (key: keyof Site) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  return (
    <div className="flex h-screen bg-light-bg text-content font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 64 : 240 }}
        className="bg-sidebar border-r border-sidebar/10 flex flex-col transition-all duration-300 relative group/sidebar"
      >
        <div className="p-4 flex items-center gap-2 border-b border-white/10 h-14 shrink-0 overflow-hidden">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
            <span className="text-secondary font-bold text-xs">VG</span>
          </div>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-white font-bold text-sm">Vector Green</h1>
              <p className="text-[10px] text-white/50">Innovation for Good</p>
            </motion.div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden custom-scrollbar">
          {!isSidebarCollapsed && (
            <div className="px-4 mb-2 text-[10px] uppercase tracking-wider text-white/40 font-semibold truncate">
              {activeSection}
            </div>
          )}
          {subNavs[activeSection]?.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubSection(sub)}
              title={isSidebarCollapsed ? sub : undefined}
              className={cn(
                "w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors relative group",
                activeSubSection === sub 
                  ? "bg-sidebar-accent text-white" 
                  : "hover:bg-white/5 text-white/60 hover:text-white"
              )}
            >
              <div className="shrink-0">
                {sub === 'Electricity Management' && <Zap size={18} />}
                {sub === 'Water Management' && <Droplets size={18} />}
                {sub === 'Energy Analysis' && <BarChart3 size={18} />}
                {sub === 'Tenant Management' && <Building2 size={18} />}
                {sub === 'Contract Management' && <FileText size={18} />}
                {sub === 'Worker Management' && <Users size={18} />}
                {sub === 'Bill Management' && <CreditCard size={18} />}
                {sub === 'Device Ledger' && <Database size={18} />}
                {sub === 'Message Center' && <MessageSquare size={18} />}
                {sub === 'Operation Logs' && <ClipboardList size={18} />}
                {sub === 'Alarm Event' && <AlertTriangle size={18} />}
                {sub === 'Edge Gateway' && <HardDrive size={18} />}
                {sub === 'System' && <Shield size={18} />}
                {sub === 'Roles' && <Key size={18} />}
                {sub === 'Organizations and Users' && <Users size={18} />}
                {sub === 'Projects' && <FolderTree size={18} />}
                {sub === 'Products' && <Package size={18} />}
                {sub === 'Driver' && <Cpu size={18} />}
                {sub === 'Spaces' && <Map size={18} />}
                {sub === 'Sites' && <MapPin size={18} />}
                {sub === 'Dashboard' && <LayoutDashboard size={18} />}
                {sub === 'Alarm Rules' && <AlertTriangle size={18} />}
                {sub === 'Energy Configuration' && <Settings size={18} />}
                {sub === 'Dashboard Config' && <Monitor size={18} />}
              </div>
              {!isSidebarCollapsed && <span className="truncate">{sub}</span>}
              {activeSubSection === sub && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Small Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-all z-20 shadow-lg"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="relative h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-[2000] shrink-0">
          <div className="flex items-center gap-6">
            
            {/* ORGANISATION DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsCustomerDropdownOpen(!isCustomerDropdownOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border relative z-50",
                  isCustomerDropdownOpen 
                    ? "bg-gray-50 text-secondary border-gray-200 shadow-inner" 
                    : "text-content border-transparent hover:text-secondary hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <FolderTree size={16} className={cn("transition-colors", isCustomerDropdownOpen ? "text-primary" : "text-gray-400")} />
                <span>{selectedCustomer}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200", isCustomerDropdownOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isCustomerDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCustomerDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-left"
                    >
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">Select Organisation</p>
                      </div>
                      <div className="p-1.5">
                        {customers.map(customer => (
                          <button
                            key={customer}
                            onClick={() => handleCustomerChange(customer)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group",
                              selectedCustomer === customer 
                                ? "text-primary bg-primary/10 font-medium" 
                                : "text-content hover:bg-gray-50 hover:text-secondary"
                            )}
                          >
                            <span>{customer}</span>
                            {selectedCustomer === customer && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <nav className="hidden lg:flex items-center gap-4 ml-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.name);
                    setActiveSubSection(subNavs[item.name][0]);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider relative z-50",
                    activeSection === item.name 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-400 hover:text-secondary hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setIsNotificationsOpen(false);
                setIsProfileOpen(false);
                setIsCustomerDropdownOpen(false);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-50 transition-all relative z-50 outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATIONS DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsCustomerDropdownOpen(false);
                }}
                className={cn(
                  "p-2 rounded-lg transition-all relative z-50 outline-none",
                  isNotificationsOpen ? "bg-gray-50 text-primary" : "text-gray-400 hover:text-secondary hover:bg-gray-50"
                )}
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right"
                    >
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Notifications</h3>
                        <button className="text-[10px] text-primary hover:underline">Mark all as read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={cn(
                                "text-[11px] font-bold",
                                n.type === 'critical' ? "text-red-500" : n.type === 'warning' ? "text-orange-500" : "text-primary"
                              )}>{n.title}</h4>
                              <span className="text-[9px] text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-content leading-relaxed group-hover:text-secondary transition-colors">{n.message}</p>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-3 text-[10px] text-gray-400 hover:text-secondary hover:bg-gray-50 transition-colors border-t border-gray-100">
                        View all notifications
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsCustomerDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 border-l border-gray-200 group outline-none relative z-50"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all",
                  isProfileOpen ? "bg-primary ring-2 ring-primary/20" : "bg-secondary group-hover:ring-2 group-hover:ring-secondary/20"
                )}>
                  S
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs font-bold text-secondary">Shariffie Shariff</p>
                        <p className="text-[10px] text-gray-400 truncate">shariffieshariff@hotmail.com</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-xs text-content hover:text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <User size={14} /> Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-xs text-content hover:text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <Settings size={14} /> Settings
                        </button>
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-light-bg">
          <div className="max-w-[1600px] mx-auto">
            
            {/* SITES SECTION */}
            {activeSubSection === 'Sites' && (
              <div className="flex flex-col h-[calc(100vh-120px)] gap-4 overflow-hidden">
                {/* 1. Dashboard Layer: Compact Stats */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-secondary">Global Performance</h2>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                      <button 
                        onClick={() => setStatsPeriod('Today')}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold transition-all",
                          statsPeriod === 'Today' ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        Today
                      </button>
                      <button 
                        onClick={() => setStatsPeriod('MTD')}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold transition-all",
                          statsPeriod === 'MTD' ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        MTD
                      </button>
                      <button 
                        onClick={() => setStatsPeriod('YTD')}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold transition-all",
                          statsPeriod === 'YTD' ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        YTD
                      </button>
                    </div>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 ml-4">
                      <button 
                        onClick={() => setViewMode('Map')}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold transition-all flex items-center gap-1",
                          viewMode === 'Map' ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        <Map size={10} />
                        Map
                      </button>
                      <button 
                        onClick={() => setViewMode('Table')}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold transition-all flex items-center gap-1",
                          viewMode === 'Table' ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        <List size={10} />
                        Table
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 relative group">
                    <Zap size={16} className="text-amber-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Energy</p>
                      <p className="text-sm font-bold text-secondary">
                        {statsPeriod === 'YTD' ? (portfolioStats.totalEnergy * 365 / 1000).toFixed(1) : 
                         statsPeriod === 'MTD' ? (portfolioStats.totalEnergy * 30 / 1000).toFixed(1) : 
                         (portfolioStats.totalEnergy / 1000).toFixed(1)}k 
                        <span className="text-[10px] font-normal text-gray-500 ml-1">kWh</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                    <Droplets size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Water</p>
                      <p className="text-sm font-bold text-secondary">
                        {statsPeriod === 'YTD' ? (portfolioStats.totalWater * 365).toLocaleString() : 
                         statsPeriod === 'MTD' ? (portfolioStats.totalWater * 30).toLocaleString() : 
                         portfolioStats.totalWater.toLocaleString()} 
                        <span className="text-[10px] font-normal text-gray-500 ml-1">m³</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                    <Flame size={16} className="text-orange-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Gas</p>
                      <p className="text-sm font-bold text-secondary">
                        {statsPeriod === 'YTD' ? (portfolioStats.totalGas * 365).toLocaleString() : 
                         statsPeriod === 'MTD' ? (portfolioStats.totalGas * 30).toLocaleString() : 
                         portfolioStats.totalGas.toLocaleString()} 
                        <span className="text-[10px] font-normal text-gray-500 ml-1">m³</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                    <Leaf size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Carbon</p>
                      <p className="text-sm font-bold text-secondary">
                        {statsPeriod === 'YTD' ? (portfolioStats.totalCarbon * 365).toFixed(1) : 
                         statsPeriod === 'MTD' ? (portfolioStats.totalCarbon * 30).toFixed(1) : 
                         portfolioStats.totalCarbon.toFixed(1)} 
                        <span className="text-[10px] font-normal text-gray-500 ml-1">t</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                    <DollarSign size={16} className="text-indigo-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Total Cost</p>
                      <p className="text-sm font-bold text-secondary">
                        ${statsPeriod === 'YTD' ? (portfolioStats.totalCost * 365 / 1000).toFixed(1) : 
                          statsPeriod === 'MTD' ? (portfolioStats.totalCost * 30 / 1000).toFixed(1) : 
                          (portfolioStats.totalCost / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Main Content Area: Map + Side Panel OR Table View */}
                <div className="flex flex-1 gap-4 overflow-hidden min-h-0 relative">
                  {viewMode === 'Map' ? (
                    /* Map Section */
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden relative flex flex-col">
                    {/* Map Header/Controls */}
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between relative z-[1001] bg-white/90 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        {/* Country Selector */}
                        <CustomSelect
                          value={selectedCountry === 'World' ? 'World Map' : selectedCountry}
                          options={availableCountries.map(c => c === 'World' ? 'World Map' : c)}
                          onChange={(val) => {
                            const country = val === 'World Map' ? 'World' : val;
                            setSelectedCountry(country);
                            const viewport = COUNTRY_VIEWPORTS[country] || COUNTRY_VIEWPORTS['World'];
                            setMapZoom(viewport.zoom);
                            setMapCenter(viewport.center);
                          }}
                          minWidth="120px"
                        />

                        {/* Search with Dropdown */}
                        <div className="relative group">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={14} />
                          <input
                            type="text"
                            placeholder="Search all sites..."
                            className="bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-secondary pl-8 pr-16 py-1.5 w-48 focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all outline-none shadow-sm"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setIsSearchDropdownOpen(true);
                            }}
                            onFocus={() => setIsSearchDropdownOpen(true)}
                          />
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {searchQuery && (
                              <button 
                                onClick={() => setSearchQuery('')}
                                className="p-1 hover:bg-gray-50 rounded-md text-gray-400 hover:text-secondary transition-colors"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsSearchDropdownOpen(prev => !prev);
                            }}
                            className="absolute right-0 top-0 bottom-0 px-2.5 flex items-center justify-center text-gray-400 hover:text-primary transition-colors outline-none z-10"
                            title="Toggle site list"
                          >
                            <ChevronDown size={14} className={cn("transition-transform duration-200", isSearchDropdownOpen && "rotate-180")} />
                          </button>
                          
                          {/* Search Dropdown */}
                          <AnimatePresence>
                            {isSearchDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-[1001]" 
                                  onClick={() => setIsSearchDropdownOpen(false)} 
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                  className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1002] overflow-hidden"
                                >
                                  <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Sites ({dropdownSites.length})</p>
                                  </div>
                                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {dropdownSites.length > 0 ? (
                                      dropdownSites.map(site => (
                                        <button
                                          key={site.id}
                                          onClick={() => {
                                            setSelectedSite(site);
                                            setIsSidePanelOpen(true);
                                            setSearchQuery(site.name);
                                            setIsSearchDropdownOpen(false);
                                            setMapCenter([site.lat, site.lng]);
                                            setMapZoom(15);
                                            setStatusFilter([]);
                                            setTypeFilter([]);
                                          }}
                                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-all group flex items-center gap-3"
                                        >
                                          <div className={cn(
                                            "w-2 h-2 rounded-full shadow-sm shrink-0",
                                            site.status === 'Online' ? "bg-primary" :
                                            site.status === 'Warning' ? "bg-amber-500" : "bg-red-500"
                                          )} />
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-bold text-secondary group-hover:text-primary transition-colors truncate">{site.name}</span>
                                            <span className="text-[9px] text-gray-400 truncate">{site.address}</span>
                                          </div>
                                        </button>
                                      ))
                                    ) : (
                                      <div className="p-4 text-center">
                                        <p className="text-[11px] text-gray-400">
                                          {searchQuery ? `No sites found matching "${searchQuery}"` : "No sites available"}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                          <button 
                            onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 18))}
                            className="p-1.5 hover:bg-gray-50 rounded-md text-gray-400 hover:text-primary transition-colors"
                          >
                            <ZoomIn size={14} />
                          </button>
                          <button 
                            onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 1))}
                            className="p-1.5 hover:bg-gray-50 rounded-md text-gray-400 hover:text-primary transition-colors"
                          >
                            <ZoomOut size={14} />
                          </button>
                          <button 
                            onClick={() => { 
                              setMapZoom(3); 
                              setMapCenter([15, 105]); 
                              setSelectedCountry('World');
                              setSearchQuery('');
                              setSelectedSite(null);
                              setIsSidePanelOpen(false);
                            }}
                            className="p-1.5 hover:bg-gray-50 rounded-md text-gray-400 hover:text-primary transition-colors"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Map Canvas with Zoom/Pan */}
                    <div className="flex-1 relative bg-[#f8f9fa]">
                      <MapContainer 
                        center={mapCenter} 
                        zoom={mapZoom} 
                        zoomControl={false}
                        className="w-full h-full"
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <MapController center={mapCenter} zoom={mapZoom} onMapClick={() => setIsSidePanelOpen(false)} />
                        
                        {filteredSites.map(site => (
                          <Marker 
                            key={site.id} 
                            position={[site.lat, site.lng]}
                            icon={createCustomIcon(site.status)}
                            eventHandlers={{
                              click: () => {
                                setSelectedSite(site);
                                setIsSidePanelOpen(true);
                                setMapCenter([site.lat, site.lng]);
                                setMapZoom(15);
                                setSearchQuery(site.name);
                              },
                            }}
                          >
                            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                              <div className="p-1">
                                <p className="text-xs font-bold text-secondary">{site.name}</p>
                                <p className="text-[10px] text-gray-400">{site.address}</p>
                              </div>
                            </LeafletTooltip>
                          </Marker>
                        ))}
                      </MapContainer>

                      {/* Map Filters Overlay */}
                      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-3 pointer-events-none">
                        {/* Facility Type Filter */}
                        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-2xl pointer-events-auto">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Facility Type</p>
                          <div className="flex flex-col gap-1.5">
                            {[
                              { id: 'Commercial', label: 'Commercial', icon: <Building2 size={10} /> },
                              { id: 'Industrial', label: 'Industrial', icon: <Factory size={10} /> },
                              { id: 'Retail', label: 'Retail', icon: <ShoppingCart size={10} /> },
                              { id: 'Data Center', label: 'Data Center', icon: <Database size={10} /> },
                              { id: 'Accommodation', label: 'Accommodation', icon: <Home size={10} /> }
                            ].map((type) => (
                              <button
                                key={type.id}
                                onClick={() => setTypeFilter(typeFilter.includes(type.id) ? typeFilter.filter(t => t !== type.id) : [...typeFilter, type.id])}
                                className={cn(
                                  "flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-bold transition-all hover:bg-gray-50",
                                  typeFilter.includes(type.id) ? "bg-primary/20 text-primary" : "text-gray-400 hover:text-secondary"
                                )}
                              >
                                {type.icon}
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Map Legend (Interactive Status Filter) */}
                        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-2xl pointer-events-auto">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Status Filter</p>
                          <div className="space-y-2">
                            {[
                              { id: 'Online', color: 'bg-primary', label: 'Optimal Performance' },
                              { id: 'Warning', color: 'bg-amber-500', label: 'Warning / Maintenance' },
                              { id: 'Critical', color: 'bg-red-500', label: 'Critical Alarm' },
                              { id: 'Offline', color: 'bg-gray-400', label: 'Offline / No Data' }
                            ].map(item => (
                              <button 
                                key={item.id} 
                                onClick={() => setStatusFilter(statusFilter.includes(item.id) ? statusFilter.filter(s => s !== item.id) : [...statusFilter, item.id])}
                                className={cn(
                                  "flex items-center gap-2 w-full transition-all hover:translate-x-1",
                                  statusFilter.length > 0 && !statusFilter.includes(item.id) ? "opacity-40 grayscale" : "opacity-100"
                                )}
                              >
                                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                                <span className="text-[10px] text-content">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Site Performance Ranking Overlay */}
                      <div className="absolute top-16 right-4 z-[1000] w-64 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Performance Ranking</p>
                          <Trophy size={12} className="text-amber-500" />
                        </div>

                        {/* Metric Selector */}
                        <div className="grid grid-cols-3 gap-1 mb-3">
                          {[
                            { id: 'EUI', label: 'EUI' },
                            { id: 'WEI', label: 'WEI' },
                            { id: 'Energy', label: 'Energy' },
                            { id: 'Water', label: 'Water' },
                            { id: 'Gas', label: 'Gas' },
                            { id: 'Carbon', label: 'Carbon' }
                          ].map(metric => (
                            <button
                              key={metric.id}
                              onClick={() => setRankingMetric(metric.id as any)}
                              className={cn(
                                "px-1 py-1 rounded text-[8px] font-bold transition-all border",
                                rankingMetric === metric.id 
                                  ? "bg-primary border-primary text-white" 
                                  : "bg-white border-gray-200 text-gray-400 hover:text-secondary"
                              )}
                            >
                              {metric.label}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2">
                          {filteredSites
                            .map(site => {
                              let value = 0;
                              let unit = "";
                              let label = "";
                              
                              switch(rankingMetric) {
                                case 'EUI':
                                  value = site.energyToday / (site.gfa / 1000);
                                  unit = "kWh/k㎡";
                                  label = "Intensity";
                                  break;
                                case 'WEI':
                                  value = site.waterToday / (site.gfa / 1000);
                                  unit = "m³/k㎡";
                                  label = "Intensity";
                                  break;
                                case 'Energy':
                                  value = site.energyToday / 1000;
                                  unit = "MWh";
                                  label = "Consumption";
                                  break;
                                case 'Water':
                                  value = site.waterToday;
                                  unit = "m³";
                                  label = "Consumption";
                                  break;
                                case 'Gas':
                                  value = site.gasToday;
                                  unit = "m³";
                                  label = "Consumption";
                                  break;
                                case 'Carbon':
                                  value = site.carbonToday;
                                  unit = "t";
                                  label = "Emissions";
                                  break;
                              }

                              return { ...site, rankValue: value, rankUnit: unit, rankLabel: label };
                            })
                            .sort((a, b) => a.rankValue - b.rankValue)
                            .slice(0, 5)
                            .map((site, index) => (
                              <button
                                key={site.id}
                                onClick={() => {
                                  setSelectedSite(site);
                                  setIsSidePanelOpen(true);
                                  setMapCenter([site.lat, site.lng]);
                                  setMapZoom(15);
                                  setSearchQuery(site.name);
                                }}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={cn(
                                    "text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                                    index === 0 ? "bg-amber-500/20 text-amber-500" :
                                    index === 1 ? "bg-gray-400/20 text-gray-400" :
                                    index === 2 ? "bg-amber-300/20 text-amber-600" :
                                    "bg-gray-100 text-gray-400"
                                  )}>
                                    {index + 1}
                                  </span>
                                  <div className="flex flex-col text-left min-w-0">
                                    <span className="text-[11px] font-bold text-secondary group-hover:text-primary transition-colors truncate">{site.name}</span>
                                    <span className="text-[9px] text-gray-400 truncate">{site.type}</span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-[10px] font-bold text-primary">{site.rankValue.toFixed(site.rankValue > 100 ? 0 : 1)}</p>
                                  <p className="text-[8px] text-gray-400 uppercase">{site.rankUnit}</p>
                                </div>
                              </button>
                            ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <p className="text-[8px] text-gray-500 italic text-center">
                            Ranked by {rankingMetric} {rankingMetric === 'EUI' || rankingMetric === 'WEI' ? 'Intensity' : 'Consumption'} (Lower is better)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    /* Table Section */
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-4">
                          <h3 className="text-sm font-bold text-secondary">Site Inventory</h3>
                          <div className="relative group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="text" 
                              placeholder="Filter table..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-white border border-gray-200 text-secondary text-[11px] rounded-lg pl-9 pr-8 py-1.5 w-64 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-50 transition-all flex items-center gap-2 text-[11px] font-bold">
                            <Download size={14} />
                            Export CSV
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse text-left">
                          <thead className="sticky top-0 bg-gray-50 z-10">
                            <tr className="border-b border-gray-200">
                              <th 
                                onClick={() => handleSort('name')}
                                className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-secondary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Name
                                  {sortConfig?.key === 'name' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider relative"
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="flex items-center gap-2 cursor-pointer hover:text-secondary transition-colors"
                                    onClick={() => handleSort('status')}
                                  >
                                    Status
                                    {sortConfig?.key === 'status' && (
                                      sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
                                    )}
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsStatusFilterOpen(!isStatusFilterOpen);
                                    }}
                                    className={cn(
                                      "p-1 rounded hover:bg-gray-200 transition-colors",
                                      statusFilter.length < 4 ? "text-primary" : "text-gray-400"
                                    )}
                                  >
                                    <Filter size={10} />
                                  </button>
                                </div>
                                {isStatusFilterOpen && (
                                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 p-2 min-w-[140px]">
                                    <div className="space-y-1">
                                      {['Online', 'Warning', 'Critical', 'Offline'].map(status => (
                                        <label key={status} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group">
                                          <input 
                                            type="checkbox" 
                                            checked={statusFilter.includes(status)}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              if (statusFilter.includes(status)) {
                                                setStatusFilter(prev => prev.filter(s => s !== status));
                                              } else {
                                                setStatusFilter(prev => [...prev, status]);
                                              }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-3 h-3 rounded border-gray-200 bg-white text-primary focus:ring-primary cursor-pointer"
                                          />
                                          <span className="text-[10px] text-gray-400 normal-case group-hover:text-secondary">{status}</span>
                                        </label>
                                      ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setStatusFilter(['Online', 'Warning', 'Critical', 'Offline']);
                                        }}
                                        className="text-[9px] text-gray-400 hover:text-secondary px-1"
                                      >
                                        Reset
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsStatusFilterOpen(false);
                                        }}
                                        className="text-[9px] text-primary hover:text-primary/80 font-bold px-1"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </th>
                              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider relative">
                                <div 
                                  className="flex items-center gap-2 cursor-pointer hover:text-secondary transition-colors"
                                  onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                                >
                                  Type
                                  <Filter size={10} className={cn(typeFilter.length > 0 ? "text-primary" : "text-gray-400")} />
                                </div>
                                {isTypeFilterOpen && (
                                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 p-2 min-w-[140px]">
                                    <div className="space-y-1">
                                      {['Office', 'Factory', 'Retail', 'Residential', 'Accommodation'].map(type => (
                                        <label key={type} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group">
                                          <input 
                                            type="checkbox" 
                                            checked={typeFilter.includes(type)}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              if (typeFilter.includes(type)) {
                                                setTypeFilter(prev => prev.filter(t => t !== type));
                                              } else {
                                                setTypeFilter(prev => [...prev, type]);
                                              }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-3 h-3 rounded border-gray-200 bg-white text-primary focus:ring-primary cursor-pointer"
                                          />
                                          <span className="text-[10px] text-gray-400 normal-case group-hover:text-secondary">{type}</span>
                                        </label>
                                      ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTypeFilter([]);
                                        }}
                                        className="text-[9px] text-gray-400 hover:text-secondary px-1"
                                      >
                                        Clear
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsTypeFilterOpen(false);
                                        }}
                                        className="text-[9px] text-primary hover:text-primary/80 font-bold px-1"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </th>
                              <th 
                                onClick={() => handleSort('energyToday')}
                                className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-secondary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Energy (kWh)
                                  {sortConfig?.key === 'energyToday' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('waterToday')}
                                className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-secondary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Water (m³)
                                  {sortConfig?.key === 'waterToday' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('carbonToday')}
                                className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-secondary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Carbon (t)
                                  {sortConfig?.key === 'carbonToday' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
                                  )}
                                </div>
                              </th>
                              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alarms</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredSites.map((site) => (
                              <tr 
                                key={site.id} 
                                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                onClick={() => {
                                  setSelectedSite(site);
                                  setIsSidePanelOpen(true);
                                }}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-secondary group-hover:text-primary transition-colors">{site.name}</span>
                                    <span className="text-[9px] text-gray-400">{site.city}, {site.country}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold",
                                    site.status === 'Online' ? "bg-primary/10 text-primary border border-primary/20" :
                                    site.status === 'Warning' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                    site.status === 'Critical' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                    "bg-gray-400/10 text-gray-400 border border-gray-400/20"
                                  )}>
                                    <div className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      site.status === 'Online' ? "bg-primary" :
                                      site.status === 'Warning' ? "bg-amber-500" :
                                      site.status === 'Critical' ? "bg-red-500" : "bg-gray-400"
                                    )} />
                                    {site.status}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-[10px] text-gray-400">{site.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-[11px] font-mono text-primary">{site.energyToday.toLocaleString()}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-[11px] font-mono text-blue-500">{site.waterToday.toLocaleString()}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-[11px] font-mono text-primary">{site.carbonToday.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-3">
                                  {site.alarms > 0 ? (
                                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                      <AlertTriangle size={10} />
                                      {site.alarms}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-secondary transition-all">
                                    <ExternalLink size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Side Panel */}
                  <AnimatePresence>
                    {isSidePanelOpen && selectedSite && (
                      <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 bottom-0 w-96 bg-white border-l border-gray-200 z-[1002] flex flex-col shadow-2xl"
                      >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              selectedSite.status === 'Online' ? "bg-primary" :
                              selectedSite.status === 'Warning' ? "bg-amber-500" : "bg-red-500"
                            )} />
                            <div>
                              <h2 className="text-secondary font-bold">{selectedSite.name}</h2>
                              <p className="text-[10px] text-gray-400">Last updated {selectedSite.lastUpdate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setActiveSubSection('Dashboard')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-primary/20"
                            >
                              <ExternalLink size={12} />
                              Go to Site
                            </button>
                            <button 
                              onClick={() => setIsSidePanelOpen(false)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                          {/* Basic Info */}
                          <section>
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-3 tracking-wider">Site Information</p>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary mt-0.5" />
                                <div>
                                  <p className="text-xs text-secondary leading-relaxed">{selectedSite.address}</p>
                                  <p className="text-[10px] text-gray-400">{selectedSite.city}, {selectedSite.country}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Building size={16} className="text-primary" />
                                <p className="text-xs text-secondary">{selectedSite.type} Facility</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Move size={16} className="text-primary" />
                                <p className="text-xs text-secondary">{selectedSite.gfa.toLocaleString()} m² GFA</p>
                              </div>
                            </div>
                          </section>

                          {/* Real-time Stats */}
                          <section>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Performance</p>
                              <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                                {['Today', 'MTD', 'YTD'].map((p) => (
                                  <button 
                                    key={p}
                                    onClick={() => setSiteStatsPeriod(p as any)}
                                    className={cn(
                                      "px-2 py-0.5 rounded-md text-[8px] font-bold transition-all",
                                      siteStatsPeriod === p ? "bg-primary text-white" : "text-gray-400 hover:text-secondary"
                                    )}
                                  >
                                    {p}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Zap size={14} className="text-amber-500" />
                                  <span className="text-[10px] text-gray-400">Energy</span>
                                </div>
                                <p className="text-sm font-bold text-secondary">
                                  {siteStatsPeriod === 'YTD' ? (selectedSite.energyToday * 365 / 1000).toFixed(1) : 
                                   siteStatsPeriod === 'MTD' ? (selectedSite.energyToday * 30 / 1000).toFixed(1) : 
                                   (selectedSite.energyToday/1000).toFixed(1)}k kWh
                                </p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Droplets size={14} className="text-blue-500" />
                                  <span className="text-[10px] text-gray-400">Water</span>
                                </div>
                                <p className="text-sm font-bold text-secondary">
                                  {siteStatsPeriod === 'YTD' ? (selectedSite.waterToday * 365).toLocaleString() : 
                                   siteStatsPeriod === 'MTD' ? (selectedSite.waterToday * 30).toLocaleString() : 
                                   selectedSite.waterToday} m³
                                </p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Flame size={14} className="text-orange-500" />
                                  <span className="text-[10px] text-gray-400">Gas</span>
                                </div>
                                <p className="text-sm font-bold text-secondary">
                                  {siteStatsPeriod === 'YTD' ? (selectedSite.gasToday * 365).toLocaleString() : 
                                   siteStatsPeriod === 'MTD' ? (selectedSite.gasToday * 30).toLocaleString() : 
                                   selectedSite.gasToday} m³
                                </p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Leaf size={14} className="text-emerald-500" />
                                  <span className="text-[10px] text-gray-400">Carbon</span>
                                </div>
                                <p className="text-sm font-bold text-secondary">
                                  {siteStatsPeriod === 'YTD' ? (selectedSite.carbonToday * 365).toFixed(1) : 
                                   siteStatsPeriod === 'MTD' ? (selectedSite.carbonToday * 30).toFixed(1) : 
                                   selectedSite.carbonToday.toFixed(2)} t
                                </p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <DollarSign size={14} className="text-indigo-500" />
                                  <span className="text-[10px] text-gray-400">Total Cost</span>
                                </div>
                                <p className="text-sm font-bold text-secondary">
                                  ${(siteStatsPeriod === 'YTD' ? selectedSite.costToday * 365 : 
                                     siteStatsPeriod === 'MTD' ? selectedSite.costToday * 30 : 
                                     selectedSite.costToday).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>
                          </section>

                          {/* Alerts */}
                          {selectedSite.alarms > 0 && (
                            <section>
                              <p className="text-[10px] text-gray-400 uppercase font-bold mb-3 tracking-wider">Active Alarms</p>
                              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3">
                                <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-red-500">{selectedSite.topAlert || 'Critical System Alarm'}</p>
                                  <p className="text-[10px] text-red-400 mt-1">Requires immediate attention from facility manager.</p>
                                </div>
                              </div>
                            </section>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* DASHBOARD SECTION */}
            {activeSubSection === 'Dashboard' && (
              <div className="space-y-6">
                {/* Site Header & Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      currentSite.status === 'Online' ? "bg-green-50 text-green-600" :
                      currentSite.status === 'Warning' ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                    )}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentSite.name}</h2>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          currentSite.status === 'Online' ? "bg-green-100 text-green-700" :
                          currentSite.status === 'Warning' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        )}>
                          {currentSite.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {currentSite.city}, {currentSite.country}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1"><Activity size={12} /> {currentSite.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1"><RefreshCw size={12} /> Updated {currentSite.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Switch Site</p>
                      <CustomSelect
                        value={currentSite.name}
                        options={MOCK_SITES.filter(s => s.customer === selectedCustomer).map(s => s.name)}
                        onChange={(name) => {
                          const site = MOCK_SITES.find(s => s.name === name);
                          if (site) setSelectedSite(site);
                        }}
                        className="bg-white border-gray-200"
                        minWidth="200px"
                      />
                    </div>
                    <div className="md:hidden">
                      <CustomSelect
                        value={currentSite.name}
                        options={MOCK_SITES.filter(s => s.customer === selectedCustomer).map(s => s.name)}
                        onChange={(name) => {
                          const site = MOCK_SITES.find(s => s.name === name);
                          if (site) setSelectedSite(site);
                        }}
                        className="bg-white border-gray-200 w-full"
                        minWidth="100%"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors group">
                    <div className="flex items-center gap-2 mb-4 text-gray-500 group-hover:text-blue-600 transition-colors">
                      <Database size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Device Statistics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Total Devices</p>
                        <p className="text-3xl font-bold text-gray-900">137</p>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">Fault</p>
                          <p className="text-sm font-bold text-red-600">0</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">Alarm</p>
                          <p className="text-sm font-bold text-orange-600">{currentSite.alarms}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">Offline</p>
                          <p className="text-sm font-bold text-gray-500">0</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">Online</p>
                          <p className="text-sm font-bold text-green-600">137</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DashboardCard>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-600 transition-colors">
                        <Bell size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Alarm Statistics</span>
                      </div>
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">View More</button>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="shrink-0">
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Total Alarms</p>
                        <p className="text-3xl font-bold text-gray-900">{currentSite.alarms}</p>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              className="stroke-gray-200"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={cn(currentSite.alarms > 0 ? "stroke-orange-500" : "stroke-green-500")}
                              strokeWidth="3"
                              strokeDasharray={currentSite.alarms > 0 ? "30, 100" : "100, 100"}
                              strokeLinecap="round"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-900">{currentSite.alarms}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span className="text-[10px] text-gray-400 uppercase">Solved</span>
                          <span className="text-xs font-bold text-gray-900">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          <span className="text-[10px] text-gray-400 uppercase">Active</span>
                          <span className="text-xs font-bold text-gray-900">{currentSite.alarms}</span>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors group">
                    <div className="flex items-center gap-2 mb-4 text-gray-500 group-hover:text-green-600 transition-colors">
                      <Globe size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Carbon Footprint</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Total CO2 Emission</p>
                        <p className="text-3xl font-bold text-green-600">{currentSite.carbonToday} <span className="text-sm font-normal text-gray-500">t</span></p>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Leaf size={12} className="text-green-600" />
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Trees Equivalent</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">~{Math.round(currentSite.carbonToday * 45)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid of 4 Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* Electricity Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Electricity Consumption</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {electricityTimeframe === 'Custom' && (
                          <div className="flex items-center gap-1">
                            <input type="date" value={tempElectricityRange.start} onChange={(e) => setTempElectricityRange(prev => ({ ...prev, start: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <input type="date" value={tempElectricityRange.end} onChange={(e) => setTempElectricityRange(prev => ({ ...prev, end: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <button onClick={() => setElectricityCustomRange(tempElectricityRange)} className="px-2 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded">Confirm</button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Custom', 'Today', '7D', '30D', '1Y'].map((t) => (
                            <button 
                              key={t} 
                              onClick={() => setElectricityTimeframe(t as 'Custom' | 'Today' | '7D' | '30D' | '1Y')}
                              className={cn("px-2 py-1 text-[10px] font-bold rounded", t === electricityTimeframe ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={electricityData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#1f2937' }}
                          />
                          <Bar dataKey="consumption" fill={THEME.domain.electricity} radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Water Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Water Consumption</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {waterTimeframe === 'Custom' && (
                          <div className="flex items-center gap-1">
                            <input type="date" value={tempWaterRange.start} onChange={(e) => setTempWaterRange(prev => ({ ...prev, start: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <input type="date" value={tempWaterRange.end} onChange={(e) => setTempWaterRange(prev => ({ ...prev, end: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <button onClick={() => setWaterCustomRange(tempWaterRange)} className="px-2 py-1 text-[10px] font-bold bg-primary text-white rounded">Confirm</button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Custom', 'Today', '7D', '30D', '1Y'].map((t) => (
                            <button 
                              key={t} 
                              onClick={() => setWaterTimeframe(t as 'Custom' | 'Today' | '7D' | '30D' | '1Y')}
                              className={cn("px-2 py-1 text-[10px] font-bold rounded", t === waterTimeframe ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#1f2937' }}
                          />
                          <Bar dataKey="consumption" fill={THEME.domain.water} radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Gas Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Gas Consumption</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {gasTimeframe === 'Custom' && (
                          <div className="flex items-center gap-1">
                            <input type="date" value={tempGasRange.start} onChange={(e) => setTempGasRange(prev => ({ ...prev, start: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <input type="date" value={tempGasRange.end} onChange={(e) => setTempGasRange(prev => ({ ...prev, end: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <button onClick={() => setGasCustomRange(tempGasRange)} className="px-2 py-1 text-[10px] font-bold bg-orange-500 text-white rounded">Confirm</button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Custom', 'Today', '7D', '30D', '1Y'].map((t) => (
                            <button 
                              key={t} 
                              onClick={() => setGasTimeframe(t as 'Custom' | 'Today' | '7D' | '30D' | '1Y')}
                              className={cn("px-2 py-1 text-[10px] font-bold rounded", t === gasTimeframe ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gasData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#1f2937' }}
                          />
                          <Bar dataKey="consumption" fill={THEME.domain.gas} radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Carbon Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Carbon Emissions</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {carbonTimeframe === 'Custom' && (
                          <div className="flex items-center gap-1">
                            <input type="date" value={tempCarbonRange.start} onChange={(e) => setTempCarbonRange(prev => ({ ...prev, start: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <input type="date" value={tempCarbonRange.end} onChange={(e) => setTempCarbonRange(prev => ({ ...prev, end: e.target.value }))} className="text-[10px] p-1 border rounded" />
                            <button onClick={() => setCarbonCustomRange(tempCarbonRange)} className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded">Confirm</button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Custom', 'Today', '7D', '30D', '1Y'].map((t) => (
                            <button 
                              key={t} 
                              onClick={() => setCarbonTimeframe(t as 'Custom' | 'Today' | '7D' | '30D' | '1Y')}
                              className={cn("px-2 py-1 text-[10px] font-bold rounded", t === carbonTimeframe ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={carbonData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#1f2937' }}
                          />
                          <Bar dataKey="consumption" fill={THEME.domain.carbon} radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ELECTRICITY MANAGEMENT */}
            {activeSubSection === 'Electricity Management' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Consistent Domain Icon & Background styling */}
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-500">
                      <Zap size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentSite.name}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                          Electricity Management
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <MapPin size={12} /> {currentSite.address}, {currentSite.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Switch Site</p>
                      <CustomSelect
                        value={currentSite.name}
                        options={MOCK_SITES.filter(s => s.customer === selectedCustomer).map(s => s.name)}
                        onChange={(name) => {
                          const site = MOCK_SITES.find(s => s.name === name);
                          if (site) setSelectedSite(site);
                        }}
                        className="bg-white border-gray-200"
                        minWidth="200px"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Sidebar Tree */}
                  <div className="w-full lg:w-64 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 shrink-0 h-fit">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <Filter size={14} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Statistics Space</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-amber-600 cursor-pointer font-bold">
                        <ChevronDown size={14} />
                        <FolderTree size={14} />
                        <span>{currentSite.name}</span>
                      </div>
                      <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-900 transition-colors">
                          <ChevronDown size={14} />
                          <FolderTree size={14} />
                          <span>Level 2</span>
                        </div>
                        <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                          <div className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-900 transition-colors">
                            <ChevronDown size={14} />
                            <FolderTree size={14} />
                            <span>201</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {['PM-2-R1-WQ1L', 'PM-2-R1-WQ1P1', 'PM-2-R1-WQ1P2', 'PM-2-R1-WQ1AC'].map(id => (
                              <div key={id} className={cn(
                                "flex items-center gap-2 text-[10px] p-1.5 rounded cursor-pointer transition-all",
                                id === 'PM-2-R1-WQ1L' ? "bg-amber-50 text-amber-600 font-bold" : "text-gray-500 hover:text-gray-900"
                              )}>
                                <Zap size={12} />
                                <span>{id}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Device ID: a3e56d70f8c4ece50alvff ({currentSite.name})</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-gray-900">{currentSite.stats?.electricity?.consumption || 0}</span>
                              <span className="text-sm text-gray-500 font-medium">kWh</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                            <Download size={14} />
                            Export Data
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: 'Overall', value: `${currentSite.stats?.electricity?.consumption || 0} KWH`, sub: `S$ ${currentSite.stats?.electricity?.cost || 0}`, icon: <Zap size={16} />, color: 'amber' },
                          { label: 'Carbon (t)', value: currentSite.stats?.electricity?.carbon || 0, sub: 'CO2 Emission', icon: <Leaf size={16} />, color: 'emerald' },
                          { label: 'Current (A)', value: '1.51', sub: 'Phase A: -', icon: <BarChart3 size={16} />, color: 'green' },
                          { label: 'Voltage (V)', value: '240.1', sub: 'Phase A: -', icon: <Zap size={16} />, color: 'orange' },
                        ].map((card) => (
                          <div key={card.label} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center gap-2 mb-3 text-gray-500">
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                card.color === 'amber' && "bg-amber-100 text-amber-600",
                                card.color === 'emerald' && "bg-emerald-100 text-emerald-600",
                                card.color === 'green' && "bg-green-100 text-green-600",
                                card.color === 'orange' && "bg-orange-100 text-orange-600"
                              )}>
                                {card.icon}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-1">{card.value}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{card.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Real-time Chart */}
                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Meter Analysis</h3>
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Day', 'Week', 'Month', 'Year'].map((t) => (
                            <button key={t} className={cn("px-3 py-1 text-[10px] font-bold rounded", t === 'Day' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={electricityData}>
                            <defs>
                              <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.domain.electricity} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={THEME.domain.electricity} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px', color: '#111827' }}
                              itemStyle={{ color: '#111827' }}
                            />
                            <Area type="monotone" dataKey="consumption" stroke={THEME.domain.electricity} strokeWidth={2} fillOpacity={1} fill="url(#colorElec)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WATER MANAGEMENT */}
            {activeSubSection === 'Water Management' && (
              <div className="space-y-6">
                {/* Site Header & Switcher (Standardized) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentSite.name}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                          Water Management
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <MapPin size={12} /> {currentSite.address}, {currentSite.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Switch Site</p>
                      <CustomSelect
                        value={currentSite.name}
                        options={MOCK_SITES.filter(s => s.customer === selectedCustomer).map(s => s.name)}
                        onChange={(name) => {
                          const site = MOCK_SITES.find(s => s.name === name);
                          if (site) setSelectedSite(site);
                        }}
                        className="bg-white border-gray-200"
                        minWidth="200px"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Sidebar Tree */}
                  <div className="w-full lg:w-64 bg-white rounded-2xl border border-gray-200 p-4 shrink-0 h-fit shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <Filter size={14} className="text-gray-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Spaces</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-blue-600 cursor-pointer font-bold">
                        <ChevronDown size={14} />
                        <FolderTree size={14} />
                        <span>{currentSite.name}</span>
                      </div>
                      <div className="ml-4 space-y-2 border-l border-gray-100 pl-4">
                        {['Level 1', 'Level 2', 'Level 3', 'Level 4'].map(level => (
                          <div key={level} className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors">
                            <ChevronRight size={14} />
                            <FolderTree size={14} />
                            <span>{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total Consumption</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-gray-900">{currentSite.waterToday}</span>
                              <span className="text-sm text-gray-500 font-medium">m³</span>
                            </div>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                          <Download size={14} />
                          Export Data
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Total Consumption', value: `${currentSite.waterToday} m³`, sub: `S$ ${(currentSite.waterToday * 2.74).toFixed(2)}`, icon: <Droplets size={16} />, color: 'blue' },
                          { label: 'Today Consumption', value: `${(currentSite.waterToday * 0.08).toFixed(2)} m³`, sub: `S$ ${(currentSite.waterToday * 0.08 * 2.74).toFixed(2)}`, icon: <Droplet size={16} />, color: 'cyan' },
                          { label: 'Carbon (t)', value: (currentSite.waterToday * 0.0004).toFixed(4), sub: 'CO2 Emission', icon: <Leaf size={16} />, color: 'emerald' },
                        ].map((card) => (
                          <div key={card.label} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center gap-2 mb-3 text-gray-500">
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                card.color === 'blue' && "bg-blue-100 text-blue-600",
                                card.color === 'cyan' && "bg-cyan-100 text-cyan-600",
                                card.color === 'emerald' && "bg-emerald-100 text-emerald-600"
                              )}>
                                {card.icon}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-1">{card.value}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{card.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Consumption Analysis</h3>
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          {['Day', 'Week', 'Month', 'Year'].map((t) => (
                            <button key={t} className={cn("px-3 py-1 text-[10px] font-bold rounded", t === 'Day' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={waterData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px', color: '#111827' }}
                              itemStyle={{ color: '#111827' }}
                            />
                            <Bar dataKey="consumption" fill={THEME.domain.water} radius={[4, 4, 0, 0]} barSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENERGY ANALYSIS (Mixed View) */}
            {activeSubSection === 'Energy Analysis' && (
              <div className="space-y-6">
                {/* Chart using the multi-color array from Theme */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentSite.name}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                          Energy Analysis
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <MapPin size={12} /> {currentSite.address}, {currentSite.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Switch Site</p>
                      <CustomSelect
                        value={currentSite.name}
                        options={MOCK_SITES.filter(s => s.customer === selectedCustomer).map(s => s.name)}
                        onChange={(name) => {
                          const site = MOCK_SITES.find(s => s.name === name);
                          if (site) setSelectedSite(site);
                        }}
                        className="bg-white border-gray-200"
                        minWidth="200px"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Energy Consumption Comparison</h3>
                      <CustomSelect
                        value={energyPeriod}
                        options={['Today', 'Last One Year', 'Custom']}
                        onChange={setEnergyPeriod}
                        className="bg-white border-gray-200 text-[11px] font-bold text-secondary"
                        minWidth="120px"
                      />
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={energyChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.chart.gridLight} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.chart.textLight}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#1f2937' }}
                          />
                          <Bar dataKey="consumption" fill={THEME.brand.primary} radius={[4, 4, 0, 0]} barSize={40} />
                          <Bar dataKey="cost" fill={THEME.domain.cost} radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">Energy Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={rankingData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {rankingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: THEME.chart.bgLight, border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px', color: '#111827' }}
                            itemStyle={{ color: '#111827' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Consumption by Space</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                      <Download size={14} />
                      Export Report
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px]">
                      <thead className="text-gray-500 uppercase font-bold tracking-wider border-b border-gray-100 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-bold">Space Name</th>
                          <th className="px-4 py-3 font-bold">Electricity (kWh)</th>
                          <th className="px-4 py-3 font-bold">Water (m³)</th>
                          <th className="px-4 py-3 font-bold">Carbon (t)</th>
                          <th className="px-4 py-3 font-bold">Total Cost (S$)</th>
                          <th className="px-4 py-3 font-bold">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { name: 'Level 1', elec: '1,245.5', water: '12.4', carbon: '0.85', cost: '345.20', trend: '+2.5%' },
                          { name: 'Level 2', elec: '2,890.2', water: '24.8', carbon: '1.92', cost: '780.50', trend: '-1.2%' },
                          { name: 'Level 3', elec: '1,560.8', water: '15.2', carbon: '1.04', cost: '420.10', trend: '+0.8%' },
                        ].map((space, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-4 py-3 text-gray-900 font-bold">{space.name}</td>
                            <td className="px-4 py-3 text-gray-600 font-medium">{space.elec}</td>
                            <td className="px-4 py-3 text-gray-600 font-medium">{space.water}</td>
                            <td className="px-4 py-3 text-gray-600 font-medium">{space.carbon}</td>
                            <td className="px-4 py-3 text-gray-600 font-medium">{space.cost}</td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                "font-bold",
                                space.trend.startsWith('+') ? "text-red-500" : "text-green-500"
                              )}>
                                {space.trend}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CONTRACT MANAGEMENT */}
            {activeSubSection === 'Contract Management' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    New Contract
                  </button>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Contract Name/No." className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Contract Name</th>
                        <th className="px-4 py-3 font-bold">Contract No.</th>
                        <th className="px-4 py-3 font-bold">Tenant</th>
                        <th className="px-4 py-3 font-bold">Start Date</th>
                        <th className="px-4 py-3 font-bold">End Date</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Pioneer Sector 1 Lease', no: 'CON-2026-001', tenant: 'Lita Ocean Pte Ltd', start: '2026-01-01', end: '2027-12-31', status: 'Active' },
                        { name: 'Pioneer Sector 2 Lease', no: 'CON-2026-002', tenant: 'Hiltop Machinery Pte Ltd', start: '2026-02-01', end: '2028-01-31', status: 'Active' },
                      ].map((contract, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{contract.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{contract.no}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{contract.tenant}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{contract.start}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{contract.end}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                              {contract.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">View</button>
                              <button className="hover:underline">Edit</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* WORKER MANAGEMENT */}
            {activeSubSection === 'Worker Management' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add Worker
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Worker Name/ID" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Worker Name</th>
                        <th className="px-4 py-3 font-bold">Worker ID</th>
                        <th className="px-4 py-3 font-bold">Tenant</th>
                        <th className="px-4 py-3 font-bold">Contact</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'John Doe', id: 'W-001', tenant: 'Lita Ocean Pte Ltd', contact: '+65 9123 4567', status: 'Active' },
                        { name: 'Jane Smith', id: 'W-002', tenant: 'Hiltop Machinery Pte Ltd', contact: '+65 9876 5432', status: 'Active' },
                      ].map((worker, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{worker.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{worker.id}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{worker.tenant}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{worker.contact}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                              {worker.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline text-red-500">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BILL MANAGEMENT */}
            {activeSubSection === 'Bill Management' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Billing Period</span>
                    <input type="month" className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tenant</span>
                    <CustomSelect
                      value={billingTenantFilter}
                      options={['All Tenants', 'Tenant A', 'Tenant B']}
                      onChange={setBillingTenantFilter}
                      className="bg-white border-gray-200 px-2 py-1.5 text-xs text-gray-900"
                      minWidth="160px"
                    />
                  </div>
                  <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider ml-auto">Generate Bills</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Bill No.</th>
                        <th className="px-4 py-3 font-bold">Tenant</th>
                        <th className="px-4 py-3 font-bold">Period</th>
                        <th className="px-4 py-3 font-bold">Amount</th>
                        <th className="px-4 py-3 font-bold">Payment Status</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { no: 'BILL-202603-001', tenant: 'Lita Ocean Pte Ltd', period: '2026-03', amount: 'S$ 1,245.50', status: 'Unpaid' },
                        { no: 'BILL-202603-002', tenant: 'Hiltop Machinery Pte Ltd', period: '2026-03', amount: 'S$ 890.20', status: 'Paid' },
                      ].map((bill, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{bill.no}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{bill.tenant}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{bill.period}</td>
                          <td className="px-4 py-3 text-gray-900 font-bold">{bill.amount}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              bill.status === 'Paid' ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                            )}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-blue-500">
                              <button className="hover:underline">View Details</button>
                              {bill.status === 'Unpaid' && <button className="hover:underline">Mark as Paid</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DEVICE LEDGER */}
            {activeSubSection === 'Device Ledger' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                      <Plus size={14} />
                      Add Device
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all uppercase tracking-wider">
                      <RefreshCw size={14} />
                      Sync Devices
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <CustomSelect
                      value={dataDeviceFilter}
                      options={['All Types', 'Electricity Meter', 'Water Meter', 'Gateway']}
                      onChange={setDataDeviceFilter}
                      className="bg-white border-gray-200 px-3 py-1.5 text-xs text-gray-900"
                      minWidth="140px"
                    />
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Device Name/ID" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Device Name</th>
                        <th className="px-4 py-3 font-bold">Device ID</th>
                        <th className="px-4 py-3 font-bold">Type</th>
                        <th className="px-4 py-3 font-bold">Location</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Last Online</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'PM-2-R1-WQ1L', id: 'a3e56d70f8c4', type: 'Electricity Meter', loc: 'Level 2, Room 201', status: 'Online', time: '2026-03-25 11:15:00' },
                        { name: 'WM-404', id: 'b7d2e1f9a8c3', type: 'Water Meter', loc: 'Level 4, Corridor', status: 'Online', time: '2026-03-25 11:10:00' },
                        { name: 'GW-A1B2', id: 'c9e8d7f6g5h4', type: 'Gateway', loc: 'Server Room', status: 'Offline', time: '2026-03-24 18:20:00' },
                      ].map((device, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{device.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{device.id}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{device.type}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{device.loc}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              device.status === 'Online' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            )}>
                              {device.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{device.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">Details</button>
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline text-red-500">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MESSAGE CENTER */}
            {activeSubSection === 'Message Center' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div className="flex gap-4">
                    {['All', 'Unread', 'Read'].map(filter => (
                      <button key={filter} className={cn("text-xs font-bold uppercase tracking-wider", filter === 'All' ? "text-primary" : "text-gray-500 hover:text-gray-900")}>
                        {filter}
                      </button>
                    ))}
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">Mark all as read</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { title: 'System Maintenance Notice', content: 'Scheduled maintenance on 2026-03-30 from 02:00 to 04:00 SGT.', time: '2026-03-25 09:00:00', type: 'System' },
                    { title: 'New Device Registered', content: 'Device PM-4-R2-SB5AC has been successfully added to Vector Green.', time: '2026-03-24 15:30:00', type: 'Device' },
                    { title: 'Alarm Triggered', content: 'High voltage detected in Level 2, Room 201.', time: '2026-03-24 10:15:00', type: 'Alarm' },
                  ].map((msg, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{msg.title}</h4>
                        <span className="text-[10px] font-bold text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{msg.content}</p>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">{msg.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPERATION LOGS */}
            {activeSubSection === 'Operation Logs' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operator</span>
                    <input type="text" placeholder="Username" className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 w-40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time Range</span>
                    <input type="date" className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider ml-auto">Search</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Operator</th>
                        <th className="px-4 py-3 font-bold">Operation Module</th>
                        <th className="px-4 py-3 font-bold">Operation Type</th>
                        <th className="px-4 py-3 font-bold">Operation Content</th>
                        <th className="px-4 py-3 font-bold">IP Address</th>
                        <th className="px-4 py-3 font-bold">Operation Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { user: 'admin', module: 'Device Management', type: 'Add', content: 'Added device PM-4-R2-SB5AC', ip: '192.168.1.105', time: '2026-03-25 10:15:22' },
                        { user: 'shariff', module: 'Auth', type: 'Login', content: 'User logged in', ip: '192.168.1.102', time: '2026-03-25 09:45:10' },
                        { user: 'admin', module: 'Billing', type: 'Update', content: 'Updated contract CON-2026-001', ip: '192.168.1.105', time: '2026-03-25 08:30:45' },
                      ].map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{log.user}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{log.module}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{log.type}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{log.content}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{log.ip}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ALARM EVENT */}
            {activeSubSection === 'Alarm Event' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alarm Level</span>
                    <CustomSelect
                      value={billingTypeFilter}
                      options={['All Levels', 'Critical', 'Major', 'Minor', 'Warning']}
                      onChange={setBillingTypeFilter}
                      className="bg-white border-gray-200 px-2 py-1.5 text-xs text-gray-900"
                      minWidth="128px"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                    <CustomSelect
                      value={billingStatusFilter}
                      options={['All Status', 'Unhandled', 'Handled']}
                      onChange={setBillingStatusFilter}
                      className="bg-white border-gray-200 px-2 py-1.5 text-xs text-gray-900"
                      minWidth="128px"
                    />
                  </div>
                  <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider ml-auto">Search</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Alarm Name</th>
                        <th className="px-4 py-3 font-bold">Alarm Level</th>
                        <th className="px-4 py-3 font-bold">Device Name</th>
                        <th className="px-4 py-3 font-bold">Alarm Content</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Time</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Overvoltage', level: 'Critical', device: 'PM-2-R1-WQ1L', content: 'Voltage exceeded 250V', status: 'Unhandled', time: '2026-03-25 11:05:00' },
                        { name: 'Offline', level: 'Major', device: 'WM-404', content: 'Device communication lost', status: 'Handled', time: '2026-03-24 18:20:00' },
                      ].map((alarm, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{alarm.name}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              alarm.level === 'Critical' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                            )}>
                              {alarm.level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{alarm.device}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{alarm.content}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              alarm.status === 'Handled' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            )}>
                              {alarm.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{alarm.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">Details</button>
                              {alarm.status === 'Unhandled' && <button className="hover:underline">Handle</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EDGE GATEWAY */}
            {activeSubSection === 'Edge Gateway' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add Gateway
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Gateway Name/ID" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Gateway Name</th>
                        <th className="px-4 py-3 font-bold">Gateway ID</th>
                        <th className="px-4 py-3 font-bold">Model</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Connected Devices</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Gateway-01', id: 'GW-A1B2C3', model: 'VG-Edge-X1', status: 'Online', devices: 45 },
                        { name: 'Gateway-02', id: 'GW-D4E5F6', model: 'VG-Edge-X1', status: 'Online', devices: 32 },
                        { name: 'Gateway-03', id: 'GW-G7H8I9', model: 'VG-Edge-X2', status: 'Offline', devices: 0 },
                      ].map((gw, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{gw.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{gw.id}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{gw.model}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]",
                              gw.status === 'Online' ? "text-green-600" : "text-gray-500"
                            )}>
                              <div className={cn("w-1.5 h-1.5 rounded-full", gw.status === 'Online' ? "bg-green-600" : "bg-gray-500")}></div>
                              {gw.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{gw.devices}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">View</button>
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline">Restart</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SYSTEM */}
            {activeSubSection === 'System' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">System Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">System Name</label>
                        <input type="text" defaultValue="Vector Green Admin Console" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">System Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-900 font-bold shadow-sm border border-gray-200">VG</div>
                          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm uppercase tracking-wider">Change Logo</button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Timezone</label>
                        <CustomSelect
                          value={timezoneFilter}
                          options={['UTC+08:00 (Singapore)', 'UTC+00:00 (London)', 'UTC-05:00 (New York)']}
                          onChange={setTimezoneFilter}
                          className="w-full bg-white border-gray-200 px-3 py-2 text-xs text-gray-900 shadow-sm"
                          minWidth="100%"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Language</label>
                        <CustomSelect
                          value={languageFilter}
                          options={['English', 'Chinese', 'Malay', 'Tamil']}
                          onChange={setLanguageFilter}
                          className="w-full bg-white border-gray-200 px-3 py-2 text-xs text-gray-900 shadow-sm"
                          minWidth="100%"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm uppercase tracking-wider">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {/* ROLES */}
            {activeSubSection === 'Roles' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    New role
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Please enter a role name" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Role name</th>
                        <th className="px-4 py-3 font-bold">Activation Platform</th>
                        <th className="px-4 py-3 font-bold">Role description</th>
                        <th className="px-4 py-3 font-bold">Administrator</th>
                        <th className="px-4 py-3 font-bold">Created Time</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'System Admin', platform: 'Platform', desc: '-', admin: '****@vectorgreen.com.sg', time: '2026-02-02 15:55:20' },
                        { name: 'Dorm Operators', platform: 'Platform', desc: '-', admin: '****@vectorgreen.com.sg', time: '2026-01-30 06:58:36' },
                        { name: 'Finance Personnel', platform: 'Platform', desc: '-', admin: '****@vectorgreen.com.sg', time: '2026-01-30 06:56:44' },
                        { name: 'Project administrator', platform: 'Platform', desc: 'Project administrator', admin: '-', time: '2025-11-14 18:18:06' },
                      ].map((role, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{role.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{role.platform}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{role.desc}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{role.admin}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{role.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">View</button>
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline text-red-500">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORGANIZATIONS AND USERS */}
            {activeSubSection === 'Organizations and Users' && (
              <div className="space-y-6">
                <div className="flex gap-6">
                  {/* Left Sidebar Tree */}
                  <div className="w-64 bg-white rounded-2xl border border-gray-200 p-4 shrink-0 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Organizations</span>
                      <Plus size={14} className="text-primary cursor-pointer hover:text-primary/80 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 p-2 rounded-lg cursor-pointer">
                        <ChevronDown size={14} />
                        <Building2 size={14} />
                        <span>Vector Green</span>
                      </div>
                      <div className="ml-4 space-y-2">
                        {['Vector Green', 'Lita Ocean', 'Hiltop'].map(org => (
                          <div key={org} className="flex items-center gap-2 text-xs font-medium text-gray-600 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <ChevronDown size={14} />
                            <Building2 size={14} />
                            <span>{org}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                        <Plus size={14} />
                        Add User
                      </button>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input type="text" placeholder="Username/Email" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 font-bold">Username</th>
                            <th className="px-4 py-3 font-bold">Email</th>
                            <th className="px-4 py-3 font-bold">Role</th>
                            <th className="px-4 py-3 font-bold">Organization</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Operation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { user: 'admin', email: 'admin@vectorgreen.com.sg', role: 'System Admin', org: 'Vector Green', status: 'Active' },
                            { user: 'shariff', email: 'shariff@vectorgreen.com.sg', role: 'Project administrator', org: 'Vector Green', status: 'Active' },
                            { user: 'yvonne', email: 'von@litaocean.com', role: 'Dorm Operators', org: 'Lita Ocean', status: 'Active' },
                          ].map((user, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-gray-900 font-bold">{user.user}</td>
                              <td className="px-4 py-3 text-gray-500 font-medium">{user.email}</td>
                              <td className="px-4 py-3 text-gray-500 font-medium">{user.role}</td>
                              <td className="px-4 py-3 text-gray-500 font-medium">{user.org}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3 text-primary font-bold">
                                  <button className="hover:underline">Edit</button>
                                  <button className="hover:underline">Reset Pwd</button>
                                  <button className="hover:underline text-red-500">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeSubSection === 'Products' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add Product
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Product Name/Key" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Product Name</th>
                        <th className="px-4 py-3 font-bold">Product Key</th>
                        <th className="px-4 py-3 font-bold">Device Category</th>
                        <th className="px-4 py-3 font-bold">Protocol</th>
                        <th className="px-4 py-3 font-bold">Created Time</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Smart Meter X1', key: 'pk_smx1_001', cat: 'Smart Meter', protocol: 'Modbus TCP', time: '2025-12-10 14:20:00' },
                        { name: 'Water Flow Sensor', key: 'pk_wfs_002', cat: 'Smart Water Meter', protocol: 'MQTT', time: '2025-12-15 09:30:00' },
                        { name: 'Edge Gateway Pro', key: 'pk_egp_003', cat: 'Gateway', protocol: 'HTTP', time: '2026-01-05 11:45:00' },
                      ].map((product, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{product.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{product.key}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{product.cat}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{product.protocol}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{product.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">View</button>
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline">TSL Model</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DRIVER */}
            {activeSubSection === 'Driver' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add Driver
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Driver Name" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Driver Name</th>
                        <th className="px-4 py-3 font-bold">Driver ID</th>
                        <th className="px-4 py-3 font-bold">Version</th>
                        <th className="px-4 py-3 font-bold">Language</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Modbus TCP Driver', id: 'drv_modbus_tcp', ver: '1.2.0', lang: 'Python', status: 'Published' },
                        { name: 'MQTT Generic Driver', id: 'drv_mqtt_gen', ver: '2.0.1', lang: 'Go', status: 'Published' },
                        { name: 'HTTP Webhook Driver', id: 'drv_http_web', ver: '1.0.5', lang: 'Node.js', status: 'Draft' },
                      ].map((driver, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{driver.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{driver.id}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{driver.ver}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{driver.lang}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              driver.status === 'Published' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            )}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">View</button>
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline">Download</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
{/* SPACES HIERARCHY BUILDER */}
            {activeSubSection === 'Spaces' && (
              <div className="flex gap-6 h-[calc(100vh-120px)]">
                
                {/* Left Column: Spatial Tree */}
                <div className="w-80 bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm overflow-hidden shrink-0">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Spatial Hierarchy</span>
                    <button className="p-1 hover:bg-gray-200 rounded text-primary transition-colors" title="Add Root Site">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    {/* Recursive Tree Renderer */}
                    {(() => {
                      const renderTree = (nodes: any[], level: number = 0) => {
                        return nodes.map(node => {
                          const isExpanded = expandedNodes[node.id];
                          const isSelected = selectedSpaceId === node.id;
                          const hasChildren = node.children && node.children.length > 0;

                          return (
                            <div key={node.id}>
                              <div 
                                onClick={() => setSelectedSpaceId(node.id)}
                                className={cn(
                                  "flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-colors mb-0.5",
                                  isSelected ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-700"
                                )}
                                style={{ paddingLeft: `${level * 16 + 8}px` }}
                              >
                                {/* Chevron for expanding/collapsing */}
                                <div 
                                  className="w-4 h-4 flex items-center justify-center shrink-0"
                                  onClick={(e) => hasChildren && toggleNode(node.id, e)}
                                >
                                  {hasChildren ? (
                                    isExpanded ? <ChevronDown size={14} className="text-gray-400 hover:text-gray-600" /> : <ChevronRight size={14} className="text-gray-400 hover:text-gray-600" />
                                  ) : (
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  )}
                                </div>
                                
                                {/* Icon based on type */}
                                {node.type === 'Building' && <Building2 size={14} className={isSelected ? "text-primary" : "text-gray-400"} />}
                                {node.type === 'Floor' && <Layout size={14} className={isSelected ? "text-primary" : "text-gray-400"} />}
                                {node.type === 'Room' && <Box size={14} className={isSelected ? "text-primary" : "text-gray-400"} />}
                                {(node.type !== 'Building' && node.type !== 'Floor' && node.type !== 'Room') && <FolderTree size={14} className={isSelected ? "text-primary" : "text-gray-400"} />}

                                <span className={cn("text-xs font-medium truncate", isSelected && "font-bold")}>
                                  {node.name}
                                </span>
                              </div>
                              
                              {/* Render Children */}
                              {hasChildren && isExpanded && (
                                <div>{renderTree(node.children, level + 1)}</div>
                              )}
                            </div>
                          );
                        });
                      };
                      return renderTree(spacesTree);
                    })()}
                  </div>
                </div>

                {/* Right Column: Space Editor */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  {activeSpaceDetails ? (
                    <>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">{activeSpaceDetails.name}</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Edit {activeSpaceDetails.type} Details</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all shadow-sm">
                            <Plus size={14} /> Add Child Space
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all shadow-sm">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-2xl space-y-6">
                          {/* Form Section */}
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Space Name</label>
                              <input 
                                type="text" 
                                defaultValue={activeSpaceDetails.name}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Space Type</label>
                              <select 
                                defaultValue={activeSpaceDetails.type}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                              >
                                <option>Site</option>
                                <option>Building</option>
                                <option>Floor</option>
                                <option>Room</option>
                                <option>Zone</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gross Floor Area (m²)</label>
                              <input 
                                type="number" 
                                defaultValue={activeSpaceDetails.area}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Parent Space</label>
                              <input 
                                type="text" 
                                disabled
                                defaultValue={activeSpaceDetails.type === 'Building' ? 'None (Root)' : 'VG HQ Tower'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                              />
                            </div>
                          </div>

                          <hr className="border-gray-100" />

                          {/* Quick Stats / Linked Devices Preview */}
                          <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Space Insights</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Database size={14} className="text-blue-500" />
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Linked Devices</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{activeSpaceDetails.type === 'Room' ? '4' : '32'}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap size={14} className="text-amber-500" />
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Alarms</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">0</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users size={14} className="text-primary" />
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tenants</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{activeSpaceDetails.type === 'Room' ? '0' : '2'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-all">
                          Cancel
                        </button>
                        <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                          Save Changes
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                      <FolderTree size={48} className="mb-4 text-gray-200" />
                      <p className="text-sm font-medium text-gray-500">Select a space from the hierarchy to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ALARM RULES */}
            {activeSubSection === 'Alarm Rules' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add Rule
                  </button>
                  <div className="flex items-center gap-4">
                    <CustomSelect
                      value={systemProjectFilter}
                      options={['All Projects', 'Project A', 'Project B']}
                      onChange={setSystemProjectFilter}
                      className="bg-white border-gray-200 px-3 py-1.5 text-xs text-gray-900 shadow-sm"
                      minWidth="140px"
                    />
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Rule Name" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">Rule Name</th>
                        <th className="px-4 py-3 font-bold">Project</th>
                        <th className="px-4 py-3 font-bold">Alarm Level</th>
                        <th className="px-4 py-3 font-bold">Trigger Condition</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'High Electricity Usage', project: 'Vector Green', level: 'Critical', cond: 'Usage > 500kWh', status: 'Enabled' },
                        { name: 'Water Leak Detection', project: 'Lita Ocean', level: 'Major', cond: 'Flow > 10L/min (Night)', status: 'Enabled' },
                        { name: 'Device Offline', project: 'Hiltop', level: 'Minor', cond: 'Heartbeat lost > 5min', status: 'Disabled' },
                      ].map((rule, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-bold">{rule.name}</td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{rule.project}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              rule.level === 'Critical' ? "bg-red-100 text-red-600" : 
                              rule.level === 'Major' ? "bg-orange-100 text-orange-600" : "bg-yellow-100 text-yellow-600"
                            )}>
                              {rule.level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-medium">{rule.cond}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", rule.status === 'Enabled' ? "bg-green-500" : "bg-gray-400")} />
                              <span className="text-gray-500 font-medium">{rule.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-primary font-bold">
                              <button className="hover:underline">Edit</button>
                              <button className="hover:underline">Log</button>
                              <button className="hover:underline text-red-500">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ENERGY CONFIGURATION */}
            {activeSubSection === 'Energy Configuration' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900">Energy Price Configuration</h3>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                      <Plus size={14} />
                      Add Price Rule
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 font-bold">Project</th>
                          <th className="px-4 py-3 font-bold">Energy Type</th>
                          <th className="px-4 py-3 font-bold">Unit Price ($)</th>
                          <th className="px-4 py-3 font-bold">Effective Date</th>
                          <th className="px-4 py-3 font-bold">Operation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { project: 'Vector Green', type: 'Electricity', price: '0.25', date: '2026-01-01' },
                          { project: 'Lita Ocean', type: 'Water', price: '1.20', date: '2026-01-01' },
                        ].map((price, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-900 font-bold">{price.project}</td>
                            <td className="px-4 py-3 text-gray-500 font-medium">{price.type}</td>
                            <td className="px-4 py-3 text-gray-500 font-medium">{price.price}</td>
                            <td className="px-4 py-3 text-gray-500 font-medium">{price.date}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3 text-primary font-bold">
                                <button className="hover:underline">Edit</button>
                                <button className="hover:underline text-red-500">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD CONFIG */}
            {activeSubSection === 'Dashboard Config' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Main Overview', widgets: 8, lastEdit: '2026-03-20', status: 'Published' },
                    { name: 'Energy Analysis', widgets: 12, lastEdit: '2026-03-22', status: 'Draft' },
                    { name: 'Tenant Portal', widgets: 5, lastEdit: '2026-03-15', status: 'Published' },
                  ].map((dash, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 group hover:border-primary/50 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <LayoutDashboard size={20} />
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          dash.status === 'Published' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        )}>
                          {dash.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{dash.name}</h4>
                      <p className="text-xs text-gray-500 mb-4">{dash.widgets} Widgets configured</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-[10px] text-gray-500 font-medium">Updated: {dash.lastEdit}</span>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors">
                            <Settings size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-primary hover:text-primary transition-all group bg-gray-50/50">
                    <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Create New Dashboard</span>
                  </button>
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeSubSection === 'Projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider">
                    <Plus size={14} />
                    Add project
                  </button>
                  <div className="flex gap-2">
                    <CustomSelect
                      value={projectSpaceFilter}
                      options={['Select organization', 'Org A', 'Org B']}
                      onChange={setProjectSpaceFilter}
                      className="bg-white border-gray-200 px-3 py-1.5 text-xs text-gray-900 shadow-sm"
                      minWidth="192px"
                    />
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Project name" className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-64 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: 'Test Project 3', type: 'Office Building', org: 'Vector Green', admin: 'support@vectorgreen.com.sg', area: '200.00m²', time: '2026-03-12 12:15:27' },
                    { name: 'Test Project 2', type: 'Office Building', org: 'Vector Green', admin: 'support@vectorgreen.com.sg', area: '200.00m²', time: '2026-03-12 12:11:41' },
                    { name: 'Test Project 1', type: 'Office Building', org: 'Vector Green', admin: 'support@vectorgreen.com.sg', area: '10000.00m²', time: '2026-03-12 12:11:07' },
                    { name: 'VG Office', type: 'Office Building', org: 'Vector Green', admin: 'support@vectorgreen.com.sg', area: '300.00m²', time: '2026-03-12 12:08:26' },
                    { name: 'Vector Green', type: 'Office Building', org: 'Vector Green', admin: 'support@vectorgreen.com.sg', area: '200.00m²', time: '2026-02-13 12:07:13' },
                  ].map((project, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-6 hover:border-gray-300 transition-colors shadow-sm">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <FolderTree size={20} />
                      </div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{project.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Project type</p>
                          <p className="text-xs text-gray-700 font-medium">{project.type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Organization</p>
                          <p className="text-xs text-gray-700 font-medium">{project.org}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Administrator</p>
                          <p className="text-xs text-gray-700 font-medium truncate">{project.admin}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Update Time</p>
                          <p className="text-xs text-gray-700 font-medium">{project.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-primary font-bold text-xs">
                        <button className="hover:underline">View</button>
                        <button className="hover:underline">Edit</button>
                        <button className="hover:underline text-red-500">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ENERGY TAGS */}
            {activeSubSection === 'Energy Tags' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-sm">
                <div className="flex flex-col items-center gap-12 relative z-10">
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-3">
                    <Zap size={20} className="text-primary" />
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Total energy consumption</span>
                  </div>
                  
                  <div className="flex gap-16">
                    <div className="flex flex-col gap-8">
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center gap-3 w-48 shadow-sm">
                        <Zap size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">HVAC</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center gap-3 w-48 shadow-sm">
                        <Zap size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kinetic equipment</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center gap-3 w-48 shadow-sm">
                        <Zap size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Lighting /socket electricity</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {['Air condition electricity', 'Cold station electricity', 'Heat station electricity', 'Fire system', 'Lift electricity', 'Ventilation system', 'Water supply system', 'Indoor electricity', 'Outdoor lighting'].map(tag => (
                        <div key={tag} className="bg-gray-50/50 border border-gray-100 p-2 rounded-lg flex items-center gap-2 w-48">
                          <Zap size={14} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* SVG Lines for Topology */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-gray-300">
                  <path d="M 400 300 L 600 200" fill="none" />
                  <path d="M 400 300 L 600 300" fill="none" />
                  <path d="M 400 300 L 600 400" fill="none" />
                </svg>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}