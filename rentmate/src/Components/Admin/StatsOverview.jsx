import { useState, useEffect } from 'react';
import { 
  FaUsers, FaHome, FaCheckCircle, FaTimesCircle, 
  FaCalendarCheck, FaEye, FaChartLine
} from 'react-icons/fa';
import dataService from '../../services/dataService';

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    activeListings: 0,
    totalViews: 0,
    totalApplications: 0,
    weeklyGrowth: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      // Get all landlords
      const landlords = dataService.getLandlords();
      
      // Get all properties
      const properties = dataService.getProperties();
      
      // Calculate stats
      const pendingLandlords = landlords.filter(l => l.status === 'pending').length;
      const pendingProperties = properties.filter(p => p.status === 'pending').length;
      const pendingApprovals = pendingLandlords + pendingProperties;
      
      const activeListings = properties.filter(p => 
        p.status === 'approved' || p.status === 'available'
      ).length;
      
      const totalViews = properties.reduce((total, property) => total + (property.views || 0), 0);
      
      // Mock data for demo
      const totalApplications = 12; // This would come from applications data
      const weeklyGrowth = 15; // This would be calculated from historical data
      
      setStats({
        totalUsers: landlords.length + 2, // +2 for the mock tenants
        totalProperties: properties.length,
        pendingApprovals,
        activeListings,
        totalViews,
        totalApplications,
        weeklyGrowth
      });
      
      setLoading(false);
    };
    
    calculateStats();
    
    // Listen for data updates
    const handleDataUpdated = () => {
      calculateStats();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="ml-4 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FaUsers className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalUsers)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Landlords</span>
            <span className="font-medium">{formatNumber(dataService.getLandlords().length)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Tenants</span>
            <span className="font-medium">2</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <FaHome className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Properties</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalProperties)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Active Listings</span>
            <span className="font-medium">{formatNumber(stats.activeListings)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Pending Approval</span>
            <span className="font-medium text-yellow-600">{formatNumber(dataService.getProperties().filter(p => p.status === 'pending').length)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <FaEye className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Views</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalViews)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Avg. Views per Property</span>
            <span className="font-medium">
              {stats.totalProperties > 0 ? Math.round(stats.totalViews / stats.totalProperties) : 0}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <FaCalendarCheck className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Applications</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalApplications)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Conversion Rate</span>
            <span className="font-medium">
              {stats.totalViews > 0 ? ((stats.totalApplications / stats.totalViews) * 100).toFixed(1) + '%' : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;