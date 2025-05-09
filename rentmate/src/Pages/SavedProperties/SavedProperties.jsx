import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaRegBookmark, FaBookmark, FaSort, FaFilter, FaSearch, FaArrowLeft } from "react-icons/fa";

// Import dummy data
import { properties } from "../../data/dummyData";

export default function SavedPropertiesPage({ savedPropertyIds = [], onSaveToggle }) {
  const [savedProperties, setSavedProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    sortBy: "default" // default, price-low, price-high, newest
  });
  const [loading, setLoading] = useState(true);

  // Fetch saved properties on component mount or when savedPropertyIds changes
  useEffect(() => {
    const fetchSavedProperties = () => {
      // Filter properties to get only saved ones based on the IDs passed from App
      const savedProps = properties.filter(prop => savedPropertyIds.includes(prop.id));

      setSavedProperties(savedProps);
      setFilteredProperties(savedProps);
      setLoading(false);
    };

    fetchSavedProperties();
  }, [savedPropertyIds]);

  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      const updatedIds = event.detail.savedProperties;
      const updatedProps = properties.filter(prop => updatedIds.includes(prop.id));
      setSavedProperties(updatedProps);
      setFilteredProperties(updatedProps);
    };

    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);

    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);

  // Handle removing a property from saved list
  const handleRemoveSaved = (propertyId) => {
    // Use the function passed from App.jsx
    onSaveToggle(propertyId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterProperties(e.target.value, filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    filterProperties(searchTerm, updatedFilters);
  };

  // Apply filters to properties
  const filterProperties = (search, filterOptions) => {
    let results = [...savedProperties];

    // Apply search term
    if (search) {
      results = results.filter(
        property =>
          property.title.toLowerCase().includes(search.toLowerCase()) ||
          property.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price filters
    if (filterOptions.minPrice) {
      results = results.filter(property => property.price >= parseInt(filterOptions.minPrice));
    }
    if (filterOptions.maxPrice) {
      results = results.filter(property => property.price <= parseInt(filterOptions.maxPrice));
    }

    // Apply bedroom filter
    if (filterOptions.bedrooms) {
      results = results.filter(property => property.bedrooms >= parseInt(filterOptions.bedrooms));
    }

    // Apply bathroom filter
    if (filterOptions.bathrooms) {
      results = results.filter(property => property.bathrooms >= parseInt(filterOptions.bathrooms));
    }

    // Apply sorting
    if (filterOptions.sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (filterOptions.sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (filterOptions.sortBy === "newest") {
      results.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
    }

    setFilteredProperties(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">Saved Properties</h1>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search saved properties..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <button
            className="ml-4 p-3 bg-gray-100 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-600" />
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Min Bedrooms"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Min Bathrooms"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sortBy"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No saved properties found</h2>
          <p className="text-gray-600 mb-6">You haven't saved any properties yet or none match your filters.</p>
          <Link to="/properties" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/properties/${property.id}`}>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <Link to={`/properties/${property.id}`}>
                    <h2 className="text-xl font-semibold mb-1 hover:text-blue-500">{property.title}</h2>
                  </Link>
                  <button
                    onClick={() => handleRemoveSaved(property.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaBookmark size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-2">${property.price.toLocaleString()}{property.rentOrSale === 'rent' ? '/month' : ''}</p>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaBed className="mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="mr-1" />
                    <span>{property.squareFeet} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}