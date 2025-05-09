// src/pages/PropertyListingPage.jsx
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import PropertyCard from '../../Components/PropertyCard/PropertyCard';
import { useNavigate } from 'react-router-dom';

// Import services instead of directly using dummy data
import dataService from '../../services/dataService';

const PropertyListingPage = ({ isAuthenticated, savedPropertyIds = [], onSaveToggle }) => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [localSavedProperties, setLocalSavedProperties] = useState(savedPropertyIds);
  const [loading, setLoading] = useState(true);
  
  // Load properties when component mounts
  useEffect(() => {
    loadProperties();
    
    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_properties') {
        loadProperties();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);
  
  // Load all available properties
  const loadProperties = () => {
    // Get only available and approved properties
    const properties = dataService.getProperties().filter(p => 
      p.status === 'available' || p.status === 'approved' ||  p.status === 'rented'
    );
    
    setAllProperties(properties);
    // Important: Set filtered properties directly to show all data initially
    setFilteredProperties(properties); 
    setLoading(false);
  };
  
  // Update local state when savedPropertyIds prop changes
  useEffect(() => {
    setLocalSavedProperties(savedPropertyIds);
  }, [savedPropertyIds]);
  
  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      setLocalSavedProperties(event.detail.savedProperties);
    };
    
    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    
    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);
  
  // Function to handle saving/unsaving property
  const handleSaveToggle = (id) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    
    // Use the function passed from App.jsx
    onSaveToggle(id);
  };
  
  // Apply filters
  const applyFilters = () => {
    let results = [...allProperties];
    
    // Apply search term to title and description
    if (searchTerm) {
      const searchText = searchTerm.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchText) || 
        property.description.toLowerCase().includes(searchText) ||
        property.location.toLowerCase().includes(searchText)
      );
    }
    
    // Apply numeric filters - only if they have values
    if (filters.minPrice) results = results.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) results = results.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.bedrooms) results = results.filter(p => p.bedrooms >= Number(filters.bedrooms));
    if (filters.bathrooms) results = results.filter(p => p.bathrooms >= Number(filters.bathrooms));
    
    // Apply location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      results = results.filter(p => p.location.toLowerCase().includes(locationTerm));
    }
    
    setFilteredProperties(results);
  };
  
  // Effect for when search or filters change
  useEffect(() => {
    // Only apply filters if not in loading state
    if (!loading) {
      applyFilters();
    }
  }, [searchTerm, filters.minPrice, filters.maxPrice, filters.location, filters.bedrooms, filters.bathrooms, loading]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Perfect Home</h1>
      
      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by location, property name, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.bathrooms}
                  onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setFilters({
                  minPrice: '',
                  maxPrice: '',
                  location: '',
                  bedrooms: '',
                  bathrooms: ''
                })}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Results count */}
      {!loading && (
        <p className="text-gray-600 mb-4">Showing {filteredProperties.length} properties</p>
      )}
      
      {/* Property grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id}
              property={property}
              isAuthenticated={isAuthenticated}
              isSaved={localSavedProperties.includes(property.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListingPage;