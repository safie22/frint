import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaClipboardList, FaUser, FaPlus, FaRegFileAlt, 
  FaBell, FaCalendarCheck, FaChartLine, FaEye, FaMapMarkerAlt,
  FaBed, FaBath, FaRulerCombined, FaCheckCircle, FaTimesCircle,
  FaExclamationCircle, FaFacebookMessenger, FaHourglassHalf
} from 'react-icons/fa';

// Import services and data
import dataService from '../../../services/dataService';
import { messages as allMessages } from '../../../data/dummyData';

const LandlordDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalProperties: 0,
    activeApplications: 0,
    activeListings: 0,
    pendingProperties: 0,
    propertiesViews: 0,
    messages: 0
  });
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  
  // Get landlord ID from localStorage
  const landlordId = Number(localStorage.getItem('userId'));
  
  // Load data on component mount
  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Get landlord data
        const landlord = dataService.getLandlordById(landlordId);
        
        if (!landlord) {
          setLoading(false);
          return;
        }
        
        // Get landlord's properties
        const allProperties = dataService.getProperties();
        const landlordProperties = allProperties.filter(p => 
          landlord.properties && landlord.properties.includes(p.id)
        );
        
        // Set properties state
        setProperties(landlordProperties);
        
        // Get property statistics
        const activeListings = landlordProperties.filter(p => 
          p.status === 'approved' || p.status === 'available'
        ).length;
        
        const pendingProperties = landlordProperties.filter(p => p.status === 'pending').length;
        
        const totalViews = landlordProperties.reduce((total, property) => 
          total + (property.views || 0), 0
        );
        
        // Generate mock applications
        const mockApplications = [];
        for (const property of landlordProperties) {
          // 50% chance to have an application
          if (Math.random() > 0.5) {
            mockApplications.push({
              id: `app-${property.id}-${Date.now()}`,
              propertyId: property.id,
              property: property,
              tenant: {
                id: Math.floor(Math.random() * 1000),
                name: ['James Wilson', 'Emily Clark', 'Michael Brown', 'Sarah Johnson'][Math.floor(Math.random() * 4)],
              },
              status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
              applicationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            });
          }
        }
        
        // Add a few more pending applications to make the dashboard interesting
        const pendingApps = mockApplications.filter(a => a.status === 'pending').length;
        if (pendingApps < 2 && landlordProperties.length > 0) {
          for (let i = 0; i < (2 - pendingApps); i++) {
            const randomPropertyIndex = Math.floor(Math.random() * landlordProperties.length);
            mockApplications.push({
              id: `app-extra-${i}-${Date.now()}`,
              propertyId: landlordProperties[randomPropertyIndex].id,
              property: landlordProperties[randomPropertyIndex],
              tenant: {
                id: Math.floor(Math.random() * 1000),
                name: ['Alex White', 'Jessica Taylor', 'Ryan Garcia', 'Amanda Jones'][i % 4],
              },
              status: 'pending',
              applicationDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
            });
          }
        }
        
        setApplications(mockApplications);
        
        // Generate unread messages
        const landlordMessages = allMessages.filter(m => m.receiverId === landlordId && !m.read);
        setUnreadMessages(landlordMessages);
        
        // Set statistics
        setStatistics({
          totalProperties: landlordProperties.length,
          activeApplications: mockApplications.filter(a => a.status === 'pending').length,
          activeListings,
          pendingProperties,
          propertiesViews: totalViews,
          messages: landlordMessages.length
        });
        
        // Generate recent activity
        const activities = [
          {
            id: 1,
            type: 'property_approved',
            title: 'Property Approved',
            description: 'Your listing "Modern Downtown Apartment" has been approved by admin.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: 'application_received',
            title: 'New Application',
            description: 'Jessica Taylor has applied for "Cozy Studio Near University".',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            type: 'message_received',
            title: 'New Message',
            description: 'You received a message from Alex White about "Luxury Beach House".',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setRecentActivity(activities);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading landlord dashboard:', error);
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [landlordId]);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric'
      }).format(date);
    }
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'property_approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'property_rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'application_received':
        return <FaRegFileAlt className="text-blue-500" />;
      case 'application_approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'application_rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'message_received':
        return <FaBell className="text-purple-500" />;
      case 'property_viewed':
        return <FaEye className="text-gray-500" />;
      default:
        return <FaExclamationCircle className="text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Landlord Dashboard</h1>
      
      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaHome className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.totalProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Listings</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.activeListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaHourglassHalf className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.pendingProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaRegFileAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.activeApplications}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FaEye className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.propertiesViews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              {/* TODO : CHANGE COLOR  */}
              <FaFacebookMessenger className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <p className="text-2xl font-semibold text-gray-800">{statistics.messages}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Properties */}
        <div className="lg:col-span-2 space-y-8">
          {/* Properties section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold text-gray-800">My Properties</h2>
              <Link 
                to="/landlord/properties"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                View All
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200">
              {properties.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHome className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first property listing</p>
                  <Link 
                    to="/landlord/properties/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" />
                    Add Property
                  </Link>
                </div>
              ) : (
                properties.slice(0, 3).map(property => (
                  <div key={property.id} className="p-4 flex">
                    <img 
                      src={property.images ? property.images[0] : `https://source.unsplash.com/random/100x100/?apartment&${property.id}`}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{property.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          property.status === 'approved' || property.status === 'available'
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : property.status === 'rented'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status === 'approved' || property.status === 'available' 
                            ? 'Active' 
                            : property.status === 'rejected'
                              ? 'Rejected'
                              : property.status === 'rented'
                                ? 'Rented'
                                : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{property.location}</span>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <FaRulerCombined className="mr-1" /> {property.area} sq ft
                          </span>
                        </div>
                        <div className="text-green-600 font-medium">${property.price}/mo</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t">
              <Link 
                to="/landlord/properties/new"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Add New Property
              </Link>
            </div>
          </div>
          
          {/* Applications section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
              <Link 
                to="/landlord/applications"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                View All
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegFileAlt className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No applications yet</h3>
                  <p className="text-gray-600">
                    You haven't received any rental applications yet.
                  </p>
                </div>
              ) : (
                applications.filter(app => app.status === 'pending').slice(0, 3).map(application => (
                  <div key={application.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">{application.tenant.name}</h3>
                          <p className="text-sm text-gray-600">
                            Applied for: {application.property.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(application.applicationDate)}
                          </p>
                        </div>
                      </div>
                      <Link 
                        to="/landlord/applications" 
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {applications.length > 0 && (
              <div className="p-4 border-t text-center">
                <Link 
                  to="/landlord/applications"
                  className="text-blue-600 hover:text-blue-800"
                >
                  See All Applications
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Activity and Quick Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <Link 
                to="/landlord/properties/new"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaPlus className="h-4 w-4" />
                </div>
                <span>Add New Property</span>
              </Link>
              
              <Link 
                to="/landlord/properties"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaHome className="h-4 w-4" />
                </div>
                <span>Manage Properties</span>
              </Link>
              
              <Link 
                to="/landlord/applications"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaClipboardList className="h-4 w-4" />
                </div>
                <span>Review Applications</span>
                {statistics.activeApplications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {statistics.activeApplications}
                  </span>
                )}
              </Link>
              
              <Link 
                to="/messages"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaBell className="h-4 w-4" />
                </div>
                <span>Messages</span>
                {unreadMessages.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            </div>
            
            <div>
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="mt-1 text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Listing Performance</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Total Views
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {statistics.propertiesViews}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Application Rate
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {properties.length > 0 
                        ? `${Math.round((applications.length / properties.length) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: properties.length > 0 
                        ? `${Math.min(100, Math.round((applications.length / properties.length) * 100))}%` 
                        : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Occupancy Rate
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {properties.length > 0 
                        ? `${Math.round((properties.filter(p => p.status === 'rented').length / properties.length) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: properties.length > 0 
                        ? `${Math.round((properties.filter(p => p.status === 'rented').length / properties.length) * 100)}%` 
                        : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="#"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                >
                  <FaChartLine className="mr-1" /> View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;