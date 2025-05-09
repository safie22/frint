import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEllipsisH, FaRegEdit, FaRegTrashAlt, FaFilter, 
  FaSearch, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, 
  FaBed, FaBath, FaRulerCombined, FaArrowLeft
} from 'react-icons/fa';

// Import services
import dataService from '../../../services/dataService';

const ManagePropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, rejected, rented
    sortBy: 'newest' // newest, oldest, price-low, price-high
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);

  // Get landlord ID from localStorage
  const landlordId = Number(localStorage.getItem('userId'));

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, [landlordId]);

  // Load properties from data service
  const loadProperties = () => {
    setLoading(true);
    
    // Get all properties
    const allProperties = dataService.getProperties();
    
    // Get landlord data
    const landlord = dataService.getLandlordById(landlordId);
    
    // Filter properties to only those belonging to this landlord
    let landlordProperties = [];
    
    if (landlord && landlord.properties) {
      landlordProperties = allProperties.filter(p => landlord.properties.includes(p.id));
    }
    
    setProperties(landlordProperties);
    setFilteredProperties(landlordProperties);
    setLoading(false);
  };

  // Apply filters and search
  useEffect(() => {
    if (!loading) {
      let results = [...properties];
      
      // Apply search term
      if (searchTerm) {
        const searchText = searchTerm.toLowerCase();
        results = results.filter(
          property =>
            property.title.toLowerCase().includes(searchText) ||
            property.location.toLowerCase().includes(searchText)
        );
      }
      
      // Apply status filter
      if (filters.status !== 'all') {
        results = results.filter(property => property.status === filters.status);
      }
      
      // Apply sorting
      if (filters.sortBy === 'newest') {
        results.sort((a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0));
      } else if (filters.sortBy === 'oldest') {
        results.sort((a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0));
      } else if (filters.sortBy === 'price-low') {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-high') {
        results.sort((a, b) => b.price - a.price);
      }
      
      setFilteredProperties(results);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [searchTerm, filters, properties, loading]);

  // Handle property deletion
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      // Get landlord data
      const landlord = dataService.getLandlordById(landlordId);
      
      if (landlord) {
        // Remove property ID from landlord's properties array
        const updatedProperties = landlord.properties.filter(id => id !== propertyToDelete.id);
        
        // Update landlord
        dataService.updateLandlord(landlordId, { properties: updatedProperties });
        
        // Update property status to deleted/unavailable
        dataService.updateProperty(propertyToDelete.id, { status: 'unavailable' });
        
        // Close modal and refresh data
        setShowDeleteModal(false);
        setPropertyToDelete(null);
        loadProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
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
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Available</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Rejected</span>;
      case 'rented':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Rented</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Unknown</span>;
    }
  };

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/landlord/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
          <Link 
            to="/landlord/properties/new"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Property
          </Link>
        </div>
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="rented">Rented</option>
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
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
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
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHome className="text-gray-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No properties found</h2>
          {properties.length === 0 ? (
            <>
              <p className="text-gray-600 mb-6">You haven't listed any properties yet.</p>
              <Link 
                to="/landlord/properties/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
              >
                Add Your First Property
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">No properties match your current filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ status: 'all', sortBy: 'newest' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
              >
                Reset Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Properties grid */}
      {!loading && filteredProperties.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProperties.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images && property.images[0] ? property.images[0] : `https://source.unsplash.com/random/600x400/?apartment&${property.id}`}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(property.status)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{property.title}</h3>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === property.id ? null : property.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <FaEllipsisH />
                      </button>
                      
                      {activeDropdown === property.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <Link 
                              to={`/landlord/properties/${property.id}/edit`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaRegEdit className="mr-2" />
                              Edit Property
                            </Link>
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                setPropertyToDelete(property);
                                setShowDeleteModal(true);
                                setActiveDropdown(null);
                              }}
                            >
                              <FaRegTrashAlt className="mr-2" />
                              Delete Property
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm truncate">{property.location}</span>
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
                      <FaRulerCombined className="mr-1" />
                      <span className="text-sm">{property.area} sq ft</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Posted: {formatDate(property.submissionDate || new Date().toISOString())}
                    </span>
                    <span className="text-gray-500">
                      Views: {property.views || 0}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/properties/${property.id}`}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="flex items-center">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`px-3 py-1 mx-1 rounded-md ${
                      currentPage === idx + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && propertyToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDeleteModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full relative z-50">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete "{propertyToDelete.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePropertiesPage;