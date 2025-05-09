import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaRegBookmark, FaRegFileAlt, FaCalendarAlt, FaRegBell, FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

// Importing dummy data
import { properties, users, messages } from "../../data/dummyData";

export default function TenantDashboard({ savedPropertyIds = [] }) {
  const [tenant, setTenant] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Simulate fetching tenant data
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, use localStorage and dummy data
    const userId = localStorage.getItem("userId");
    const tenantData = users.tenants.find(t => t.id === Number(userId)) || users.tenants[0];
    
    setTenant(tenantData);
    
    // Get saved properties from props instead of localStorage
    const savedPropsData = properties.filter(p => savedPropertyIds.includes(p.id));
    setSavedProperties(savedPropsData);
    
    // Get applications
    const applicationsData = tenantData.applications || [];
    // Map application data to include property details
    const applicationsWithDetails = applicationsData.map(app => {
      const property = properties.find(p => p.id === app.propertyId);
      return {
        ...app,
        property
      };
    });
    setApplications(applicationsWithDetails);
    
    // Unread messages (simulated)
    const userMessages = messages.filter(m => m.receiverId === tenantData.id && !m.read);
    setUnreadMessages(userMessages);
    
    // Recently viewed properties (simulated)
    // In a real app, this would be tracked in localStorage or database
    const recentlyViewedData = properties.slice(0, 3); // Just take first 3 for demo
    setRecentlyViewed(recentlyViewedData);
  }, [savedPropertyIds]);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Generate a random future date for viewing appointment
  const getRandomFutureDate = () => {
    const now = new Date();
    const futureDate = new Date(now.setDate(now.getDate() + Math.floor(Math.random() * 14) + 1));
    return futureDate;
  };
  
  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      const updatedIds = event.detail.savedProperties;
      const updatedProps = properties.filter(prop => updatedIds.includes(prop.id));
      setSavedProperties(updatedProps);
    };
    
    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    
    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);
  
  if (!tenant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {tenant.name}!</h1>
          <p className="opacity-90">Here's an overview of your rental activities and saved properties.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaRegBookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saved Properties</p>
              <p className="text-xl font-semibold">{savedProperties.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaRegFileAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Applications</p>
              <p className="text-xl font-semibold">{applications.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Viewings</p>
              <p className="text-xl font-semibold">2</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaRegBell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Messages</p>
              <p className="text-xl font-semibold">{unreadMessages.length}</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Properties Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Saved Properties</h2>
                <Link to="/saved-properties" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="divide-y">
                {savedProperties.length > 0 ? (
                  savedProperties.slice(0, 3).map(property => (
                    <div key={property.id} className="p-4 flex">
                      <img 
                        src={`https://source.unsplash.com/random/150x100/?apartment&${property.id}`} 
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-800">{property.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mt-2 space-x-4">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <FaRulerCombined className="mr-1" /> {property.area} sqft
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-semibold text-green-600">${property.price}/month</span>
                          <Link to={`/properties/${property.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>You haven't saved any properties yet.</p>
                    <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Applications Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Applications</h2>
                <Link to="/applications" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="divide-y">
                {applications.length > 0 ? (
                  applications.map(application => (
                    <div key={application.propertyId} className="p-4">
                      <div className="flex items-start">
                        <img 
                          src={`https://source.unsplash.com/random/150x100/?apartment&${application.propertyId}`} 
                          alt={application.property?.title || "Property"}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{application.property?.title || "Property"}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-gray-600 text-sm mt-1">
                            Applied on: {formatDate(new Date().toISOString())}
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-600">
                            {application.documents?.length > 0 && (
                              <div>Documents submitted: {application.documents.join(", ")}</div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <Link 
                              to={`/applications/${application.propertyId}`} 
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Application
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>You haven't submitted any applications yet.</p>
                    <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="p-4 space-y-3">
                <Link 
                  to="/properties" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaSearch className="h-4 w-4" />
                  </div>
                  <span>Search for Properties</span>
                </Link>
                
                <Link 
                  to="/saved-properties" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegBookmark className="h-4 w-4" />
                  </div>
                  <span>View Saved Properties</span>
                </Link>
                
                <Link 
                  to="/applications" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegFileAlt className="h-4 w-4" />
                  </div>
                  <span>Check Application Status</span>
                </Link>
                
                <Link 
                  to="/messages" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegBell className="h-4 w-4" />
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
            
            {/* Upcoming Viewings */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Viewings</h2>
              </div>
              
              <div className="divide-y">
                {/* Hard-coded viewing appointments for demo */}
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaCalendarAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Modern Downtown Apartment</h3>
                      <p className="text-sm text-gray-600">{formatDate(getRandomFutureDate())} at 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaCalendarAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Luxury Beach House</h3>
                      <p className="text-sm text-gray-600">{formatDate(getRandomFutureDate())} at 11:30 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recently Viewed */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Recently Viewed</h2>
              </div>
              
              <div className="divide-y">
                {recentlyViewed.map(property => (
                  <div key={property.id} className="p-4">
                    <Link to={`/properties/${property.id}`} className="flex items-center">
                      <img 
                        src={`https://source.unsplash.com/random/150x100/?apartment&${property.id}`} 
                        alt={property.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800 text-sm">{property.title}</h3>
                        <p className="text-sm text-gray-600">${property.price}/month</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
