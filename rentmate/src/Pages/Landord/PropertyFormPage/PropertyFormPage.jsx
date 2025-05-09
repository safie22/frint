import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTrash, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

// Import services
import dataService from '../../../services/dataService';

// Property form component - handles both create and edit
const PropertyFormPage = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    status: 'pending'
  });
  
  // Get landlord ID from localStorage
  const landlordId = Number(localStorage.getItem('userId'));
  const landlordName = localStorage.getItem('userName');
  
  // Amenities options
  const amenitiesOptions = [
    'Parking', 'Pool', 'Gym', 'Elevator', 'Internet', 
    'Furnished', 'Laundry', 'Pet Friendly', 'Air Conditioning',
    'Balcony', 'Fireplace', 'Dishwasher'
  ];
  
  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchPropertyData = () => {
      if (isEdit && id) {
        try {
          // Get property by ID
          const property = dataService.getPropertyById(Number(id));
          
          if (!property) {
            setErrorMessage('Property not found');
            setLoading(false);
            return;
          }
          
          // Check if current user is the owner of this property
          const landlord = dataService.getLandlordById(landlordId);
          if (!landlord || !landlord.properties || !landlord.properties.includes(Number(id))) {
            setErrorMessage('You do not have permission to edit this property');
            setLoading(false);
            return;
          }
          
          // Set form data
          setFormData({
            title: property.title || '',
            description: property.description || '',
            price: property.price ? property.price.toString() : '',
            location: property.location || '',
            bedrooms: property.bedrooms ? property.bedrooms.toString() : '',
            bathrooms: property.bathrooms ? property.bathrooms.toString() : '',
            area: property.area ? property.area.toString() : '',
            amenities: property.amenities || [],
            status: property.status || 'pending'
          });
          
          // Set preview images if available
          if (property.images && property.images.length > 0) {
            // For demo, we're using placeholder images
            setPreviewImages(property.images.map((_, index) => (
              `https://source.unsplash.com/random/600x400/?apartment&${property.id}-${index}`
            )));
          }
        } catch (error) {
          console.error('Error fetching property:', error);
          setErrorMessage('Error loading property data');
        }
      }
      
      setLoading(false);
    };
    
    fetchPropertyData();
  }, [isEdit, id, landlordId]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'amenities') {
      // Handle amenities checkboxes
      setFormData(prevData => {
        if (checked) {
          return {
            ...prevData,
            amenities: [...prevData.amenities, value]
          };
        } else {
          return {
            ...prevData,
            amenities: prevData.amenities.filter(amenity => amenity !== value)
          };
        }
      });
    } else {
      // Handle regular inputs
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setImageFiles(prevFiles => [...prevFiles, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };
  
  // Remove preview image
  const removeImage = (index) => {
    setPreviewImages(prevPreviews => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    setImageFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price.trim()) errors.price = 'Price is required';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Price must be a positive number';
    
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.bedrooms.trim()) errors.bedrooms = 'Bedrooms is required';
    else if (isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) errors.bedrooms = 'Bedrooms must be a positive number';
    
    if (!formData.bathrooms.trim()) errors.bathrooms = 'Bathrooms is required';
    else if (isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) errors.bathrooms = 'Bathrooms must be a positive number';
    
    if (!formData.area.trim()) errors.area = 'Area is required';
    else if (isNaN(formData.area) || Number(formData.area) <= 0) errors.area = 'Area must be a positive number';
    
    if (!isEdit && previewImages.length === 0) errors.images = 'At least one image is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    try {
      setLoading(true);
      
      // Create property data object
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: formData.amenities,
        landlordName: landlordName,
        status: 'pending', // New properties are pending by default
        views: 0,
        submissionDate: new Date().toISOString()
      };
      
      // Add mocked image URLs
      propertyData.images = previewImages.map((_, index) => 
        `https://source.unsplash.com/random/600x400/?apartment&${Date.now()}-${index}`
      );
      
      if (isEdit) {
        // Update existing property
        const property = dataService.getPropertyById(Number(id));
        if (property) {
          // Preserve original submission date and views
          propertyData.submissionDate = property.submissionDate || propertyData.submissionDate;
          propertyData.views = property.views || 0;
          propertyData.status = property.status === 'approved' ? 'approved' : 'pending';
          
          // Update property
          dataService.updateProperty(Number(id), propertyData);
        }
      } else {
        // Get all existing properties
        const allProperties = dataService.getProperties();
        
        // Find the maximum ID and add 1 for the new property
        const maxId = allProperties.length > 0 
          ? Math.max(...allProperties.map(p => p.id))
          : 0;
          
        const newPropertyId = maxId + 1;
        
        // Set the new ID
        propertyData.id = newPropertyId;
        
        // Add property to database
        allProperties.push(propertyData);
        localStorage.setItem('rentmate_properties', JSON.stringify(allProperties));
        
        // Update landlord's properties list
        const landlord = dataService.getLandlordById(landlordId);
        if (landlord) {
          const updatedProperties = landlord.properties ? [...landlord.properties, newPropertyId] : [newPropertyId];
          dataService.updateLandlord(landlordId, { properties: updatedProperties });
        }
      }
      
      // Show success message and redirect
      setFormSubmitted(true);
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/landlord/properties');
      }, 2000);
    } catch (error) {
      console.error('Error saving property:', error);
      setErrorMessage('Error saving property. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading && !errorMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (formSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isEdit ? 'Property Updated Successfully!' : 'Property Submitted Successfully!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isEdit 
              ? 'Your property listing has been updated.' 
              : 'Your property listing has been submitted and is now pending approval by an admin.'}
          </p>
          <p className="text-gray-600">
            Redirecting to your properties...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/landlord/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Properties
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit 
            ? 'Update your property listing details' 
            : 'Fill out the form below to list your property'}
        </p>
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-500 mt-1 mr-3" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
      
      {/* Property form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Property Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Modern 2 Bedroom Apartment in Downtown"
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your property in detail..."
                ></textarea>
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (USD)*</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">$</span>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1200"
                  />
                </div>
                {validationErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                )}
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. New York, NY"
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                )}
              </div>
              
              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms*</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2"
                />
                {validationErrors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bedrooms}</p>
                )}
              </div>
              
              {/* Bathrooms */}
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms*</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1"
                />
                {validationErrors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bathrooms}</p>
                )}
              </div>
              
              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)*</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="850"
                />
                {validationErrors.area && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.area}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenitiesOptions.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Property Images</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos ({previewImages.length} uploaded)
              </label>
              
              <div className={`border-2 border-dashed rounded-lg p-6 ${
                validationErrors.images ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500'
              }`}>
                <div className="text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Drag and drop image files here, or
                  </p>
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                      Browse Files
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              
              {validationErrors.images && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
              )}
            </div>
            
            {/* Preview images */}
            {previewImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/landlord/properties"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Property' : 'Submit Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormPage;