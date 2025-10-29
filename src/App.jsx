import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Truck, Package, AlertCircle, TrendingUp, Calendar, DollarSign, Wrench, Users, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { supabase } from './supabaseClient';

// Mock Data (will be replaced with real data from Supabase)
const mockVehicles = [
  { id: 1, vehicle_number: 'TRK-001', license_plate: 'AB-1234-CI', ownership: 'company', status: 'active', cargo_capability: 'container-40ft', capacity_tons: 30, make: 'Mercedes-Benz' },
  { id: 2, vehicle_number: 'TRK-002', license_plate: 'AB-1235-CI', ownership: 'company', status: 'active', cargo_capability: 'container-20ft', capacity_tons: 25, make: 'Volvo' },
  { id: 3, vehicle_number: 'TRK-003', license_plate: 'AB-1236-CI', ownership: 'company', status: 'maintenance', cargo_capability: 'bulk', capacity_tons: 35, make: 'Scania' },
  { id: 4, vehicle_number: 'TRK-004', license_plate: 'AB-1237-CI', ownership: 'company', status: 'active', cargo_capability: 'break-bulk', capacity_tons: 28, make: 'MAN' },
  { id: 5, vehicle_number: 'SUB-001', license_plate: 'CD-5001-CI', ownership: 'subcontractor', status: 'active', cargo_capability: 'container-20ft', capacity_tons: 25, make: 'Isuzu' },
  { id: 6, vehicle_number: 'SUB-002', license_plate: 'CD-5002-CI', ownership: 'subcontractor', status: 'active', cargo_capability: 'bulk', capacity_tons: 32, make: 'Mercedes-Benz' }
];

const mockOperations = [
  { trip_number: 'TRIP-001', trip_date: '2025-10-15', trip_status: 'completed', cargo_type: 'container-40ft', cargo_weight_tons: 28.5, distance_km: 45, trip_cost: 112.50, vehicle_number: 'TRK-001' },
  { trip_number: 'TRIP-002', trip_date: '2025-10-16', trip_status: 'completed', cargo_type: 'bulk', cargo_weight_tons: 32, distance_km: 75, trip_cost: 187.50, vehicle_number: 'SUB-002' },
  { trip_number: 'TRIP-003', trip_date: '2025-10-20', trip_status: 'completed', cargo_type: 'break-bulk', cargo_weight_tons: 26, distance_km: 58, trip_cost: 145.00, vehicle_number: 'TRK-004' },
  { trip_number: 'TRIP-004', trip_date: '2025-10-22', trip_status: 'completed', cargo_type: 'container-20ft', cargo_weight_tons: 22, distance_km: 38, trip_cost: 95.00, vehicle_number: 'TRK-002' },
  { trip_number: 'TRIP-005', trip_date: '2025-10-24', trip_status: 'completed', cargo_type: 'bulk', cargo_weight_tons: 30, distance_km: 62, trip_cost: 155.00, vehicle_number: 'SUB-002' },
  { trip_number: 'TRIP-006', trip_date: '2025-10-26', trip_status: 'completed', cargo_type: 'container-40ft', cargo_weight_tons: 29, distance_km: 48, trip_cost: 120.00, vehicle_number: 'TRK-001' },
  { trip_number: 'TRIP-007', trip_date: '2025-10-28', trip_status: 'in-progress', cargo_type: 'container-20ft', cargo_weight_tons: 22, distance_km: 32, trip_cost: 80.00, vehicle_number: 'TRK-002' }
];

const mockSubcontractors = [
  { id: 1, company_name: 'Swift Logistics Ltd', performance_score: 4.5, rate_per_km: 2.50, contact_person: 'John Mbala', status: 'active' },
  { id: 2, company_name: 'TransAfrica Haulage', performance_score: 4.2, rate_per_km: 2.35, contact_person: 'Marie Koffi', status: 'active' },
  { id: 3, company_name: 'Coastal Transport Co.', performance_score: 3.8, rate_per_km: 2.60, contact_person: 'Ibrahim Diallo', status: 'active' }
];

const mockMaintenance = [
  { id: 1, vehicle_number: 'TRK-001', maintenance_date: '2025-09-15', maintenance_type: 'routine', cost: 450, description: 'Oil change, brake inspection' },
  { id: 2, vehicle_number: 'TRK-003', maintenance_date: '2025-10-20', maintenance_type: 'repair', cost: 1850, description: 'Transmission repair' },
  { id: 3, vehicle_number: 'TRK-002', maintenance_date: '2025-08-10', maintenance_type: 'inspection', cost: 200, description: 'Annual safety inspection' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function AppContent() {
  const { signOut, user } = useAuth();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [operations, setOperations] = useState(mockOperations);
  const [subcontractors, setSubcontractors] = useState(mockSubcontractors);
  const [maintenance, setMaintenance] = useState(mockMaintenance);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real data from Supabase
  const fetchVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || mockVehicles);
    }
  }, []);

  const fetchOperations = useCallback(async () => {
    const { data, error } = await supabase
      .from('operations')
      .select('*');
    
    if (error) {
      console.error('Error fetching operations:', error);
    } else {
      setOperations(data || mockOperations);
    }
  }, []);

  const fetchSubcontractors = useCallback(async () => {
    const { data, error } = await supabase
      .from('subcontractors')
      .select('*');
    
    if (error) {
      console.error('Error fetching subcontractors:', error);
    } else {
      setSubcontractors(data || mockSubcontractors);
    }
  }, []);

  const fetchMaintenance = useCallback(async () => {
    const { data, error } = await supabase
      .from('maintenance')
      .select('*');
    
    if (error) {
      console.error('Error fetching maintenance:', error);
    } else {
      setMaintenance(data || mockMaintenance);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Fetch initial data
    fetchVehicles();
    fetchOperations();
    fetchSubcontractors();
    fetchMaintenance();

    // Set up real-time listeners
    const vehicleSubscription = supabase
      .channel('vehicles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vehicles',
        },
        (payload) => {
          setVehicles((prev) => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vehicles',
        },
        (payload) => {
          setVehicles((prev) =>
            prev.map((vehicle) =>
              vehicle.id === payload.new.id ? payload.new : vehicle
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'vehicles',
        },
        (payload) => {
          setVehicles((prev) =>
            prev.filter((vehicle) => vehicle.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    const operationsSubscription = supabase
      .channel('operations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'operations',
        },
        (payload) => {
          setOperations((prev) => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'operations',
        },
        (payload) => {
          setOperations((prev) =>
            prev.map((operation) =>
              operation.trip_number === payload.new.trip_number ? payload.new : operation
            )
          );
        }
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(vehicleSubscription);
      supabase.removeChannel(operationsSubscription);
    };
  }, [fetchVehicles, fetchOperations, fetchSubcontractors, fetchMaintenance]);

  // Calculate KPIs
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const completedTrips = operations.filter(o => o.trip_status === 'completed').length;
  const totalRevenue = operations.reduce((sum, op) => sum + (op.trip_cost || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
  const utilizationRate = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : 0;

  // Fleet composition data
  const fleetComposition = [
    { name: 'Company', value: vehicles.filter(v => v.ownership === 'company').length },
    { name: 'Subcontractor', value: vehicles.filter(v => v.ownership === 'subcontractor').length }
  ];

  // Status distribution
  const statusData = [
    { name: 'Active', value: vehicles.filter(v => v.status === 'active').length },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length },
    { name: 'Idle', value: vehicles.filter(v => v.status === 'idle').length }
  ].filter(item => item.value > 0);

  // Cargo type distribution
  const cargoTypeData = [
    { name: 'Container', value: operations.filter(o => o.cargo_type.includes('container')).length },
    { name: 'Bulk', value: operations.filter(o => o.cargo_type === 'bulk').length },
    { name: 'Break-bulk', value: operations.filter(o => o.cargo_type === 'break-bulk').length }
  ];

  // Daily revenue trend
  const revenueByDate = operations
    .filter(o => o.trip_status === 'completed')
    .reduce((acc, op) => {
      const date = op.trip_date.slice(5);
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.revenue += op.trip_cost;
        existing.trips += 1;
      } else {
        acc.push({ date, revenue: op.trip_cost, trips: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Port Fleet Management</h1>
                <p className="text-blue-100 text-sm">Operations Dashboard - Bouaké Port Authority</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Current Date</p>
                <p className="font-semibold">October 28, 2025</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {['overview', 'fleet', 'operations', 'subcontractors', 'maintenance'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Fleet</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalVehicles}</p>
                    <p className="text-green-600 text-sm mt-1">{activeVehicles} Active</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Completed Trips</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{completedTrips}</p>
                    <p className="text-blue-600 text-sm mt-1">This month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(0)}</p>
                    <p className="text-green-600 text-sm mt-1">+12% vs last month</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Utilization Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{utilizationRate}%</p>
                    <p className="text-gray-600 text-sm mt-1">Fleet efficiency</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Fleet Composition</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={fleetComposition}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fleetComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Vehicle Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Cargo Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cargoTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Vehicle
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo Capability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (Tons)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.vehicle_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.license_plate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vehicle.ownership === 'company' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {vehicle.ownership}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vehicle.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : vehicle.status === 'maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.cargo_capability}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.capacity_tons}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.make}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Operations Tracking</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                New Trip
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (Tons)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {operations.map((operation) => (
                      <tr key={operation.trip_number} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{operation.trip_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{operation.trip_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{operation.vehicle_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{operation.cargo_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{operation.cargo_weight_tons}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{operation.distance_km}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${operation.trip_cost}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            operation.trip_status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {operation.trip_status}
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

        {activeTab === 'subcontractors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Subcontractor Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Subcontractor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcontractors.map((subcontractor) => (
                <div key={subcontractor.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{subcontractor.company_name}</h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subcontractor.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subcontractor.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <Users className="inline w-4 h-4 mr-1" />
                      {subcontractor.contact_person}
                    </p>
                    <p className="text-sm text-gray-600">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      ${subcontractor.rate_per_km}/km
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Performance:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(subcontractor.performance_score) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{subcontractor.performance_score}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Maintenance Tracking</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Maintenance
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {maintenance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.vehicle_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.maintenance_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.maintenance_type === 'routine' 
                              ? 'bg-blue-100 text-blue-800' 
                              : record.maintenance_type === 'inspection'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.maintenance_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{record.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;