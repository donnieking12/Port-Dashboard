import React, { useState, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, Truck, Package, DollarSign } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportComponent = React.forwardRef((props, ref) => {
  const { vehicles, operations, subcontractors, maintenance } = props;

  // Calculate report data
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const completedTrips = operations.filter(o => o.trip_status === 'completed').length;
  const totalRevenue = operations.reduce((sum, op) => sum + (op.trip_cost || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

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

  return (
    <div ref={ref} className="p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Port Fleet Management Report</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Total Fleet</p>
              <p className="text-2xl font-bold">{totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Completed Trips</p>
              <p className="text-2xl font-bold">{completedTrips}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Active Vehicles</p>
              <p className="text-2xl font-bold">{activeVehicles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fleet Composition</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Revenue Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>

      {/* Data Tables */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Vehicle Inventory</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Vehicle #</th>
              <th className="border border-gray-300 px-4 py-2 text-left">License Plate</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Ownership</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cargo Capability</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Capacity (Tons)</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="border border-gray-300 px-4 py-2">{vehicle.vehicle_number}</td>
                <td className="border border-gray-300 px-4 py-2">{vehicle.license_plate}</td>
                <td className="border border-gray-300 px-4 py-2">{vehicle.ownership}</td>
                <td className="border border-gray-300 px-4 py-2">{vehicle.status}</td>
                <td className="border border-gray-300 px-4 py-2">{vehicle.cargo_capability}</td>
                <td className="border border-gray-300 px-4 py-2">{vehicle.capacity_tons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Operations</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Trip #</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Vehicle #</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cargo Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Weight (Tons)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Distance (km)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((operation) => (
              <tr key={operation.trip_number}>
                <td className="border border-gray-300 px-4 py-2">{operation.trip_number}</td>
                <td className="border border-gray-300 px-4 py-2">{operation.trip_date}</td>
                <td className="border border-gray-300 px-4 py-2">{operation.vehicle_number}</td>
                <td className="border border-gray-300 px-4 py-2">{operation.cargo_type}</td>
                <td className="border border-gray-300 px-4 py-2">{operation.cargo_weight_tons}</td>
                <td className="border border-gray-300 px-4 py-2">{operation.distance_km}</td>
                <td className="border border-gray-300 px-4 py-2">${operation.trip_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const Reports = ({ vehicles, operations, subcontractors, maintenance }) => {
  const componentRef = useRef();
  const [reportType, setReportType] = useState('summary');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Port_Fleet_Management_Report',
  });

  const handleExportPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll just trigger the print dialog which can be used to save as PDF
    handlePrint();
  };

  const handleExportCSV = () => {
    // Export vehicles data as CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Vehicle Number,License Plate,Ownership,Status,Cargo Capability,Capacity (Tons),Make\n";
    
    // Data
    vehicles.forEach(vehicle => {
      csvContent += `${vehicle.vehicle_number},${vehicle.license_plate},${vehicle.ownership},${vehicle.status},${vehicle.cargo_capability},${vehicle.capacity_tons},${vehicle.make}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fleet_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="summary">Summary Report</option>
            <option value="fleet">Fleet Report</option>
            <option value="operations">Operations Report</option>
            <option value="financial">Financial Report</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <ReportComponent 
        ref={componentRef}
        vehicles={vehicles}
        operations={operations}
        subcontractors={subcontractors}
        maintenance={maintenance}
      />
    </div>
  );
};

export default Reports;