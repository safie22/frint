import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHome, FaKey, FaUserCheck, FaMoneyBillWave, FaShieldAlt, FaArrowRight } from "react-icons/fa";

// This would come from your data file in a real application
import { properties } from "../../data/dummyData";

export default function HomePage({ isAuthenticated }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get featured properties (first 3)
  const featuredProperties = properties.slice(0, 3);
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${searchTerm}`);
  };
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-20" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://source.unsplash.com/random/1600x900/?luxury-apartment')",
          minHeight: "600px"
        }}
      >
        <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Home with RentMate</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl">Connecting tenants and landlords for a seamless renting experience.</p>
          
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl bg-white p-3 rounded-lg shadow-md flex"
          >
            <input 
              type="text"
              placeholder="Search by location, property type, or keyword..."
              className="flex-grow px-4 py-2 focus:outline-none text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </form>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">1,000+</p>
              <p>Available Properties</p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">500+</p>
              <p>Happy Tenants</p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">300+</p>
              <p>Verified Landlords</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 flex items-center">
            View All <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                {/* Using placeholder images */}
                <img 
                  src={`https://picsum.photos/seed/apt${property.id}/600/400`} 
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-sm font-semibold ${
                  property.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {property.status === 'available' ? 'Available' : 'Rented'}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                <p className="text-green-600 font-bold text-lg mb-2">${property.price}/month</p>
                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                
                <div className="flex justify-between text-gray-600">
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                  <span>{property.area} sq ft</span>
                </div>
                
                <Link 
                  to={`/properties/${property.id}`}
                  className="block mt-4 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How RentMate Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Tenants */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Search Properties</h3>
              <p className="text-gray-600">Browse thousands of verified properties with detailed information and photos.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaKey className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Book Viewings</h3>
              <p className="text-gray-600">Schedule property visits and communicate directly with landlords.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHome className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Your Home</h3>
              <p className="text-gray-600">Apply for properties, sign digital contracts, and move into your new home.</p>
            </div>
          </div>
          
          {/* CTA Button */}
          {!isAuthenticated && (
            <div className="text-center mt-12">
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 inline-block font-medium"
              >
                Get Started Today
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* For Tenants */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">For Tenants</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaSearch className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Extensive Search Options</h3>
                  <p className="text-gray-600">Filter properties by location, price, amenities, and more to find your perfect match.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaUserCheck className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verified Landlords</h3>
                  <p className="text-gray-600">All landlords on our platform are verified for your safety and peace of mind.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Applications</h3>
                  <p className="text-gray-600">Apply for properties through our secure platform with document protection.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* For Landlords */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">For Landlords</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaHome className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Showcase Your Properties</h3>
                  <p className="text-gray-600">Create detailed listings with photos, videos, and virtual tours to attract qualified tenants.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaMoneyBillWave className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Set Your Terms</h3>
                  <p className="text-gray-600">Define rent, deposit, lease terms, and requirements for potential tenants.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Tenant Screening</h3>
                  <p className="text-gray-600">Review applications and screen tenants with our comprehensive verification system.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-blue-600 text-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"RentMate made finding my new apartment so easy! I could filter exactly what I wanted and communicate directly with the landlord."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  S
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm opacity-80">Tenant</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"As a landlord, I've been able to find reliable tenants quickly. The platform handles all the screening and paperwork for me."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  M
                </div>
                <div>
                  <p className="font-medium">Michael Brown</p>
                  <p className="text-sm opacity-80">Landlord</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"The virtual tours feature saved me so much time. I was able to narrow down my options before scheduling in-person visits."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  R
                </div>
                <div>
                  <p className="font-medium">Rachel Chen</p>
                  <p className="text-sm opacity-80">Tenant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Find Your Perfect Match?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're looking for a new home or want to list your property, RentMate makes the process simple and secure.
        </p>
        {!isAuthenticated ? (
        
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md hover:bg-blue-50 font-medium"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link 
            to="/properties" 
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium inline-block"
          >
            Browse Properties
          </Link>
        )}
      </section>
    </div>
  );
}