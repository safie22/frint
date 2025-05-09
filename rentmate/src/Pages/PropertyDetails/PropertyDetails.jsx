import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaRegBookmark, FaBookmark,
  FaCheck, FaWifi, FaFan, FaParking, FaShower, FaUtensils, FaTv, FaSnowflake,
  FaWater, FaSwimmingPool, FaRegUser, FaRegStar, FaStar, FaRegHeart, FaRegClock,
  FaArrowRight, FaArrowLeft as FaArrowBack, FaChevronLeft, FaChevronRight, FaPaperPlane,
  FaExclamationTriangle
} from "react-icons/fa";

// Import services
import dataService from "../../services/dataService";

export default function PropertyDetailPage({ isAuthenticated, userRole, savedPropertyIds = [], onSaveToggle }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [contactMessage, setContactMessage] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [propertyNotAvailable, setPropertyNotAvailable] = useState(false);
  const [notAvailableReason, setNotAvailableReason] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if property is saved
      setIsSaved(savedPropertyIds.includes(Number(id)));
    }
  }, [id, isAuthenticated, savedPropertyIds]);

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = () => {
      // Find property
      const propertyData = dataService.getPropertyById(Number(id));

      if (propertyData) {
        // Check if property is accessible based on status and user role
        let canAccess = true;
        let reasonMessage = "";
        
        if (propertyData.status === 'rejected') {
          if (userRole === 'admin') {
            // Admin can see rejected properties
            reasonMessage = "This property has been rejected and is not visible to tenants.";
          } else {
            // Other users cannot see rejected properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        } else if (propertyData.status === 'unavailable') {
          if (userRole === 'admin') {
            // Admin can see unavailable properties
            reasonMessage = "This property is currently unavailable because the landlord account has been disabled.";
          } else {
            // Other users cannot see unavailable properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        } else if (propertyData.status === 'pending') {
          if (userRole === 'admin' || 
             (userRole === 'landlord' && getIsLandlordOwner(propertyData))) {
            // Admin and owner landlord can see pending properties
            reasonMessage = "This property is pending approval and is not visible to tenants.";
          } else {
            // Other users cannot see pending properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        }
        
        if (!canAccess && userRole !== 'admin') {
          setPropertyNotAvailable(true);
          setNotAvailableReason(reasonMessage);
          setLoading(false);
          return;
        }
        
        setProperty(propertyData);
        
        // If accessible but with a warning message
        if (reasonMessage && (userRole === 'admin' || 
           (userRole === 'landlord' && getIsLandlordOwner(propertyData)))) {
          setNotAvailableReason(reasonMessage);
        }

        // Find landlord data
        const landlords = dataService.getLandlords();
        const landlordData = landlords.find(l => 
          l.name === propertyData.landlordName || 
          (l.properties && l.properties.includes(propertyData.id))
        );
        setLandlord(landlordData);

        // Find similar properties (same location or similar price)
        const allProperties = dataService.getAvailableProperties();
        const similar = allProperties.filter(p =>
          p.id !== propertyData.id &&
          (p.location.includes(propertyData.location.split(',')[0]) ||
            Math.abs(p.price - propertyData.price) < 300)
        ).slice(0, 3);

        setSimilarProperties(similar);
      } else {
        // Property not found
        setPropertyNotAvailable(true);
        setNotAvailableReason("The property you're looking for doesn't exist or has been removed.");
      }

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(() => {
      fetchPropertyData();
    }, 500);
  }, [id, navigate, userRole]);

  // Check if current user is the landlord that owns this property
  const getIsLandlordOwner = (propertyData) => {
    if (!propertyData || userRole !== 'landlord') return false;
    
    const userId = Number(localStorage.getItem('userId'));
    const landlords = dataService.getLandlords();
    const landlord = landlords.find(l => l.id === userId);
    
    return landlord && 
           landlord.properties && 
           landlord.properties.includes(propertyData.id);
  };

  // Handle saving/unsaving property
  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/properties/${id}` } });
      return;
    }

    // Call the parent handler
    onSaveToggle(id);
    setIsSaved(!isSaved);
  };

  // Handle apply for rental
  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/apply/${id}` } });
      return;
    }

    navigate(`/apply/${id}`);
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!contactMessage.trim()) return;

    // In a real app, this would send the message to the backend
    alert(`Message sent to landlord: ${contactMessage}`);
    setContactMessage("");
    setShowContactForm(false);
  };

  // Next image in gallery
  const nextImage = () => {
    if (!property || !property.images) return;
    setActiveImageIndex((activeImageIndex + 1) % property.images.length);
  };

  // Previous image in gallery
  const prevImage = () => {
    if (!property || !property.images) return;
    setActiveImageIndex(activeImageIndex === 0 ? property.images.length - 1 : activeImageIndex - 1);
  };

  // Get image URL (using placeholders for demo)
  const getImageUrl = (index) => {
    return `https://source.unsplash.com/random/600x400/?apartment,interior&sig=${property.id}-${index}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (propertyNotAvailable) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md inline-block">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Available</h2>
          <p className="text-gray-600 mb-6">{notAvailableReason}</p>
          <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-md shadow-sm">
            <FaArrowLeft className="mr-2" /> Browse Available Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>

        {/* Status Warning (if any) */}
        {notAvailableReason && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {notAvailableReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Property Status Badge */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            property.status === 'available' || property.status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : property.status === 'rejected' 
                ? 'bg-red-100 text-red-800'
                : property.status === 'rented'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status === 'available' || property.status === 'approved' 
              ? 'Available' 
              : property.status === 'rejected'
                ? 'Rejected'
                : property.status === 'rented'
                  ? 'Rented'
                  : property.status === 'pending'
                    ? 'Pending Approval'
                    : 'Unavailable'}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-6">
          <FaMapMarkerAlt className="mr-2" />
          <span>{property.location}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Images and Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={getImageUrl(activeImageIndex)}
                  alt={`${property.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />

                {/* Image navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronLeft className="text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronRight className="text-gray-800" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {property.images?.length || 5}
                </div>

                {/* Save button */}
                {(property.status === 'available' || property.status === 'approved') && (
                  <button
                    onClick={handleSaveToggle}
                    className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                  >
                    {isSaved ? (
                      <FaBookmark className="text-blue-600" />
                    ) : (
                      <FaRegBookmark className="text-gray-800" />
                    )}
                  </button>
                )}
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-5 gap-2 p-4">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={getImageUrl(index)}
                      alt={`${property.title} - Thumbnail ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Price and basic info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-600 mb-2">${property.price}/month</h2>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <FaBed className="text-gray-500 mr-2" />
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="text-gray-500 mr-2" />
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="text-gray-500 mr-2" />
                    <span>{property.area} sq ft</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 mb-6">{property.description}</p>

              {/* Property details table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Property Details</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">Apartment</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">2018</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Parking</span>
                      <span className="font-medium">1 Spot</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Heating</span>
                      <span className="font-medium">Central</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Cooling</span>
                      <span className="font-medium">Central A/C</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-medium">${property.price}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">${property.price}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Application Fee</span>
                      <span className="font-medium">$50</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Lease Term</span>
                      <span className="font-medium">12 Months</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                {/* Hardcoded amenities for demo */}
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaWifi className="text-blue-600" />
                  </div>
                  <span>High-Speed Internet</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaParking className="text-blue-600" />
                  </div>
                  <span>Private Parking</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaFan className="text-blue-600" />
                  </div>
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaShower className="text-blue-600" />
                  </div>
                  <span>Modern Bathroom</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaUtensils className="text-blue-600" />
                  </div>
                  <span>Fully Equipped Kitchen</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaTv className="text-blue-600" />
                  </div>
                  <span>Cable TV</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaSnowflake className="text-blue-600" />
                  </div>
                  <span>Refrigerator</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaWater className="text-blue-600" />
                  </div>
                  <span>Water Included</span>
                </div>
                {property.amenities?.includes("Pool") && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <FaSwimmingPool className="text-blue-600" />
                    </div>
                    <span>Swimming Pool</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Landlord Info and Actions) */}
          <div className="space-y-6">
            {/* Landlord info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Listed by</h3>
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <FaRegUser className="text-gray-500 text-2xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{property.landlordName || (landlord && landlord.name) || "Property Owner"}</h4>
                  <p className="text-gray-500 text-sm">Property Owner</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span className="ml-2 text-gray-600">4.0 (12 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm">Member since {landlord ? formatDate(landlord.registrationDate || "2020-01-01") : "2020"}</p>
              </div>

              {(property.status === 'available' || property.status === 'approved') && (
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={userRole === 'landlord'}
                >
                  Contact Landlord
                </button>
              )}

              {showContactForm && (
                <div className="mt-4">
                  <form onSubmit={handleContactSubmit}>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="Write your message to the landlord..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FaPaperPlane className="mr-2" /> Send Message
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Property status and actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Status</h3>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    property.status === 'available' || property.status === 'approved'
                      ? 'bg-green-500' 
                      : property.status === 'rejected'
                        ? 'bg-red-500'
                        : property.status === 'rented'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-medium">
                    {property.status === 'available' || property.status === 'approved'
                      ? 'Available Now' 
                      : property.status === 'rejected'
                        ? 'Rejected'
                        : property.status === 'rented'
                          ? 'Rented'
                          : property.status === 'pending'
                            ? 'Pending Approval'
                            : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaRegClock className="mr-1" />
                  <span>{property.views} views</span>
                </div>
              </div>

              {/* Action buttons */}
              {(property.status === 'available' || property.status === 'approved') && userRole !== 'landlord' && userRole !== 'admin' && (
                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply for Rental
                  </button>

                  <button
                    onClick={handleSaveToggle}
                    className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center ${isSaved
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {isSaved ? (
                      <>
                        <FaBookmark className="mr-2 text-blue-600" />
                        Saved
                      </>
                    ) : (
                      <>
                        <FaRegBookmark className="mr-2" />
                        Save Property
                      </>
                    )}
                  </button>

                  <a
                    href={`tel:+1234567890`}
                    className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
                  >
                    Call Landlord
                  </a>
                </div>
              )}
              
              {/* Landlord/Admin view of rejected/pending property */}
              {(property.status === 'rejected' || property.status === 'pending' || property.status === 'unavailable') && (
                <div className={`p-4 rounded-lg text-center ${
                  property.status === 'rejected' ? 'bg-red-50' : 
                  property.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <p className={`font-medium mb-2 ${
                    property.status === 'rejected' ? 'text-red-700' : 
                    property.status === 'pending' ? 'text-yellow-700' : 'text-gray-700'
                  }`}>
                    {property.status === 'rejected' 
                      ? 'This property has been rejected' 
                      : property.status === 'pending'
                        ? 'This property is pending approval'
                        : 'This property is unavailable'}
                  </p>
                  
                  {property.rejectionReason && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Reason:</span> {property.rejectionReason}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-sm">
                    {property.status === 'rejected' 
                      ? 'This property is not visible to tenants.' 
                      : property.status === 'pending'
                        ? 'This property will be visible to tenants once approved.'
                        : 'This property is not visible to tenants.'}
                  </p>
                </div>
              )}
              
              {/* Rented property view */}
              {property.status === 'rented' && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-blue-700 font-medium mb-2">This property is currently rented</p>
                  <p className="text-gray-600 text-sm">Check back later or browse other available properties</p>
                </div>
              )}
            </div>

            {/* Key details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Details</h3>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Pets {property.amenities?.includes("Pet Friendly") ? 'allowed' : 'not allowed'}</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Smoking not allowed</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Background check required</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Income verification required</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">12-month lease term</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {(property.status === 'available' || property.status === 'approved') && similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map(similar => (
                <div key={similar.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={`https://source.unsplash.com/random/600x400/?apartment&${similar.id}`}
                      alt={similar.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-xs font-semibold ${similar.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                      {similar.status === 'available' ? 'Available' : 'Rented'}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{similar.title}</h3>

                    <p className="text-green-600 font-bold text-lg mb-2">${similar.price}/month</p>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="text-sm truncate">{similar.location}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 border-t pt-3 mb-4">
                      <div className="flex items-center">
                        <FaBed className="mr-1" />
                        <span className="text-sm">{similar.bedrooms} {similar.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="mr-1" />
                        <span className="text-sm">{similar.bathrooms} {similar.bathrooms === 1 ? 'bath' : 'baths'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaRulerCombined className="mr-1" />
                        <span className="text-sm">{similar.area} sq ft</span>
                      </div>
                    </div>

                    <Link
                      to={`/properties/${similar.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md transition-colors block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}