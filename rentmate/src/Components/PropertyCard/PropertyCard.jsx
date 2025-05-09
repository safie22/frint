// src/components/PropertyCard.jsx
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, isAuthenticated, isSaved, onSaveToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { id, title, price, location, images, status, bedrooms, bathrooms, area } = property;
  
  // Function to handle placeholder images if we're using dummies
  const getImageUrl = (url) => {
    // If using real images, return the URL
    // return url;
    
    // For dummy data, use placeholder
    return `https://picsum.photos/seed/apt${id}/600/400`;
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={getImageUrl(images[0])} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status badge */}
        <div className={`absolute top-2 right-2 py-1 px-2 rounded-full text-xs font-semibold ${
          status === 'available' || status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {status === 'available' ? 'Available' : status === 'pending'? 'Pending' : status === 'rented'? 'Rented' : status === 'approved' ? 'Available' : ''}
        </div>
        
        {/* Save button - only show if authenticated */}
        {isAuthenticated && (
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              onSaveToggle(id);
            }}
            className="absolute top-2 left-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-200"
          >
            {isSaved ? (
              <FaBookmark className="text-primary" />
            ) : (
              <FaRegBookmark className="text-gray-600" />
            )}
          </button>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${id}`}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors mb-2 truncate">
            {title}
          </h3>
        </Link>
        
        <p className="text-green-600 font-bold text-lg mb-2">${price}/month</p>
        
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1" />
          <span className="text-sm truncate">{location}</span>
        </div>
        
        <div className="flex justify-between text-gray-600 border-t pt-3">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span className="text-sm">{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span className="text-sm">{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span className="text-sm">{area} sq ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;