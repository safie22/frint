import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaSearch, FaFilter, FaSort, FaCheck, FaTimes, FaEye,
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaBath, FaUserTie
} from 'react-icons/fa';

// Import services and hooks
import dataService from '../../services/dataService';
import { useNotifications } from '../../contexts/NotificationsContext';

const ManageAllPropertiesPage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, rejected, available, rented
    sortBy: 'newest', // newest, oldest, price-low, price-high
    priceRange: 'all' // all, low, medium, high
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get notifications context
  const { addNotification } = useNotifications();

  // Fetch properties on component mount
  useEffect(() => {
    loadProperties();

    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_properties') {
        loadProperties();
      }
    };

    window.addEventListener('dataUpdated', handleDataUpdated);

    // Clean up event listener
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);

  // Load properties from data service
  const loadProperties = () => {
    const propertiesData = dataService.getProperties();

    // Enhance properties with landlord info
    const propertiesWithLandlords = propertiesData.map(property => {
      const landlords = dataService.getLandlords();

      // Find the landlord for this property
      const landlord = landlords.find(l =>
        property.landlordName === l.name ||
        (l.properties && l.properties.includes(property.id))
      );

      // Return enhanced property object
      return {
        ...property,
        landlord
      };
    });

    setAllProperties(propertiesWithLandlords);

    // Apply filters to the loaded data
    applyFilters(propertiesWithLandlords, searchTerm, filters);

    setLoading(false);
  };

  // Apply filters and search
  const applyFilters = (propertyList, term, filterOptions) => {
    let results = [...propertyList];

    // Apply search term
    if (term) {
      const searchText = term.toLowerCase();
      results = results.filter(
        property =>
          property.title.toLowerCase().includes(searchText) ||
          property.location.toLowerCase().includes(searchText) ||
          (property.landlord && property.landlord.name.toLowerCase().includes(searchText))
      );
    }

    // Apply status filter
    if (filterOptions.status !== 'all') {
      results = results.filter(property => property.status === filterOptions.status);
    }

    // Apply price range filter
    if (filterOptions.priceRange !== 'all') {
      if (filterOptions.priceRange === 'low') {
        results = results.filter(property => property.price < 1000);
      } else if (filterOptions.priceRange === 'medium') {
        results = results.filter(property => property.price >= 1000 && property.price < 2000);
      } else if (filterOptions.priceRange === 'high') {
        results = results.filter(property => property.price >= 2000);
      }
    }

    // Apply sorting
    if (filterOptions.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0));
    } else if (filterOptions.sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0));
    } else if (filterOptions.sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filterOptions.sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(results);
  };

  // Effect to reapply filters when search or filters change
  useEffect(() => {
    if (!loading) {
      applyFilters(allProperties, searchTerm, filters);
    }
  }, [searchTerm, filters]);

  // Handle property status change
  const handleStatusChange = (propertyId, newStatus) => {
    const property = allProperties.find(p => p.id === propertyId);

    if (property) {
      // Update property status
      const success = dataService.updateProperty(propertyId, {
        status: newStatus
      });

      if (success) {
        // Add a notification
        addNotification({
          title: `Property ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `"${property.title}" was ${newStatus === 'approved' ? 'approved' : 'rejected'}`,
          type: newStatus === 'approved' ? 'success' : 'warning',
          timestamp: new Date().toISOString()
        });

        // Reload properties
        loadProperties();
      }
    }

    // Close modal if open
    if (showDetailsModal) {
      setShowDetailsModal(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'available':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> {status === 'approved' ? 'Approved' : 'Available'}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      case 'rented':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> Rented
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center">
            <FaFilter className="mr-1" /> Pending
          </span>
        );
    }
  };

  // View property details
  const viewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Manage Properties</h1>
        <p className="text-gray-600 mt-1">
          Review and approve property listings
        </p>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Price Range filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="all">All Prices</option>
                <option value="low">Low (&lt; $1000)</option>
                <option value="medium">Medium ($1000-$2000)</option>
                <option value="high">High (&gt; $2000)</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <FaSort className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No properties */}
      {!loading && filteredProperties.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
            <FaHome className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No properties found</h2>
          <p className="text-gray-600 mb-6">No properties match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ status: 'all', sortBy: 'newest', priceRange: 'all' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Properties grid */}
      {!loading && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={`https://source.unsplash.com/random/600x400/?apartment&${property.id}`}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(property.status)}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <p className="text-green-600 font-bold mb-3">${property.price}/month</p>

                <div className="flex justify-between text-gray-600 border-t pt-3 mb-3">
                  <div className="flex items-center">
                    <FaBed className="mr-1" />
                    <span className="text-sm">{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" />
                    <span className="text-sm">{property.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm">{property.area} sq ft</span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserTie className="text-gray-600 text-sm" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-800">
                      {property.landlord ? property.landlord.name : property.landlordName || "Unknown Landlord"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted on {formatDate(property.submissionDate || new Date().toISOString())}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => viewPropertyDetails(property)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center justify-center"
                  >
                    <FaEye className="mr-1" /> View Details
                  </button>

                  {property.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(property.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(property.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Detail Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full relative z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`https://source.unsplash.com/random/600x400/?apartment&${selectedProperty.id}`}
                    alt={selectedProperty.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="mb-2">
                    {getStatusBadge(selectedProperty.status)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{selectedProperty.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <p className="text-green-600 font-bold text-xl mb-4">${selectedProperty.price}/month</p>

                  <div className="flex space-x-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">{selectedProperty.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">{selectedProperty.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{selectedProperty.area} sq ft</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Landlord</p>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <FaUserTie className="text-gray-600 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedProperty.landlord ? selectedProperty.landlord.name : selectedProperty.landlordName || "Unknown Landlord"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Posted on {formatDate(selectedProperty.submissionDate || new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Property Views</p>
                    <p className="font-medium">{selectedProperty.views || 0} views</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{selectedProperty.description}</p>
              </div>

              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-end space-x-3">
                {selectedProperty.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedProperty.id, 'rejected')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Reject Listing
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProperty.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Listing
                    </button>
                  </>
                )}

                {selectedProperty.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedProperty.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove Listing
                  </button>
                )}

                {selectedProperty.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedProperty.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Listing
                  </button>
                )}

                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAllPropertiesPage;