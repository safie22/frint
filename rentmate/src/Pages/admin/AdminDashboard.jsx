import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaClipboardList, FaHistory } from 'react-icons/fa';

// Import components
import NotificationsPanel from '../../components/Admin/NotificationsPanel';
import StatsOverview from '../../components/Admin/StatsOverview';
import ApprovalsPanel from '../../components/Admin/ApprovalsPanel';
import ActivityLog from '../../components/Admin/ActivityLog';

// Import services
import dataService from '../../services/dataService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, activity
  
  useEffect(() => {
    // Initialize data
    const initializeData = async () => {
      // Load data
      dataService.getLandlords();
      dataService.getProperties();
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    
    initializeData();
  }, []);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'approvals':
        return <ApprovalsPanel />;
      case 'activity':
        return <ActivityLog limit={10} showViewAll={false} />;
      case 'overview':
      default:
        return (
          <>
            <StatsOverview />
            <div className="mt-8">
              <ApprovalsPanel />
            </div>
            <div className="mt-8">
              <ActivityLog limit={5} showViewAll={true} />
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage landlords, properties, and review platform metrics
          </p>
        </div>
        <NotificationsPanel />
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaChartLine className="mr-2" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'approvals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaClipboardList className="mr-2" />
            Pending Approvals
            {dataService.getPendingLandlordsCount() + dataService.getPendingPropertiesCount() > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {dataService.getPendingLandlordsCount() + dataService.getPendingPropertiesCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'activity'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaHistory className="mr-2" />
            Activity Log
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default AdminDashboard;