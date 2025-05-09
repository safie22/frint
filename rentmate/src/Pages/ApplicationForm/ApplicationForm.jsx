import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaCheck, FaExclamationTriangle } from "react-icons/fa";

// Import services
import dataService from "../../services/dataService";

export default function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    income: "",
    occupation: "",
    currentAddress: "",
    moveInDate: "",
    additionalInfo: "",
    agreeToTerms: false
  });

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/apply/${id}` } });
      return;
    }

    // Fetch property data
    const fetchPropertyData = () => {
      // Get property from dataService instead of dummy data
      const propertyData = dataService.getPropertyById(Number(id));

      if (propertyData) {
        setProperty(propertyData);
        
        // Pre-fill form with user data from localStorage
        const userId = Number(localStorage.getItem("userId"));
        
        // Get tenant data from localStorage or dataService
        const tenantData = {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          id: userId
        };
        
        // Set form data with user info
        setFormData(prevData => ({
          ...prevData,
          fullName: tenantData.name || "",
          email: tenantData.email || ""
        }));
      } else {
        // Property not found, redirect to properties page
        navigate("/properties");
      }

      setLoading(false);
    };

    // Fetch the data
    fetchPropertyData();
  }, [id, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // In a real app, you would upload these files to a server
    // For this demo, we'll just store the file names
    const newDocuments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }));
    
    setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
  };

  // Remove uploaded document
  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...uploadedDocuments];
    updatedDocuments.splice(index, 1);
    setUploadedDocuments(updatedDocuments);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.income) {
      setFormError("Please fill in all required fields");
      return;
    }
    
    if (uploadedDocuments.length === 0) {
      setFormError("Please upload at least one document");
      return;
    }
    
    if (!formData.agreeToTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }
    
    // Get current user ID from localStorage
    const userId = Number(localStorage.getItem("userId"));
    
    // Create application object
    const newApplication = {
      propertyId: Number(id),
      status: "pending",
      documents: uploadedDocuments.map(doc => doc.name),
      applicationDate: new Date().toISOString(),
      id: `${id}-${userId}-${Date.now()}`,
      applicantInfo: {
        ...formData,
        applicantId: userId
      }
    };
    
    // Store the application in localStorage
    try {
      // Get existing applications from localStorage
      const existingApplicationsStr = localStorage.getItem("tenant_applications") || "[]";
      const existingApplications = JSON.parse(existingApplicationsStr);
      
      // Add the new application
      const updatedApplications = [...existingApplications, newApplication];
      
      // Save back to localStorage
      localStorage.setItem("tenant_applications", JSON.stringify(updatedApplications));
      
      // Update property data if needed
      if (property) {
        // Increment the property views or any other relevant stats
        dataService.updateProperty(property.id, {
          applications: (property.applications || 0) + 1
        });
      }
      
      // Show success message
      setFormSubmitted(true);
      setFormError("");
      
      // Redirect to applications page after a delay
      setTimeout(() => {
        navigate("/applications");
      }, 3000);
    } catch (error) {
      console.error("Error saving application:", error);
      setFormError("There was an error submitting your application. Please try again.");
    }
  };

  // Format currency input
  const formatCurrency = (value) => {
    if (!value) return "";
    
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    
    // Format with dollar sign and commas
    return `$${parseInt(numericValue).toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-600 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Your application for <span className="font-semibold">{property.title}</span> has been submitted successfully. 
              The landlord will review your application and contact you soon.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/applications" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Applications
              </Link>
              <Link 
                to="/tenant/dashboard" 
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link to={`/properties/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Property
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Apply for Rental</h1>
          <p className="text-gray-600 mt-2">
            Complete the application form for {property.title}
          </p>
        </div>

        {/* Property Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-6">
          <img 
            src={property.images && property.images[0] ? property.images[0] : `https://source.unsplash.com/random/300x200/?apartment&${property.id}`}
            alt={property.title}
            className="w-full md:w-48 h-32 object-cover rounded-md"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h2>
            <p className="text-gray-600 mb-2">{property.location}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-gray-700">${property.price}/month</span>
              <span className="text-gray-700">{property.bedrooms} bed</span>
              <span className="text-gray-700">{property.bathrooms} bath</span>
              <span className="text-gray-700">{property.area} sq ft</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 flex items-start">
              <FaExclamationTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="currentAddress" className="block text-gray-700 font-medium mb-2">Current Address *</label>
                  <input
                    type="text"
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Employment & Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="occupation" className="block text-gray-700 font-medium mb-2">Occupation *</label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="income" className="block text-gray-700 font-medium mb-2">Monthly Income *</label>
                  <input
                    type="text"
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    placeholder="$"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="moveInDate" className="block text-gray-700 font-medium mb-2">Preferred Move-in Date *</label>
                  <input
                    type="date"
                    id="moveInDate"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Required Documents</h3>
              <p className="text-gray-600 mb-4">
                Please upload the following documents to complete your application:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li>Proof of identity (ID card, passport)</li>
                <li>Proof of income (pay stubs, bank statements)</li>
                <li>Employment verification letter</li>
                <li>Rental history or references (optional)</li>
              </ul>
              
              {/* Document upload */}
              <div className="mt-4">
                <label htmlFor="documents" className="block text-gray-700 font-medium mb-2">Upload Documents *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <FaUpload className="text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-700 font-medium">Drag files here or click to browse</p>
                      <p className="text-gray-500 text-sm mt-1">PDF, JPG, or PNG files (max 10MB each)</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Uploaded documents list */}
              {uploadedDocuments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                  <ul className="space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(doc.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Additional Information</h3>
              <div>
                <label htmlFor="additionalInfo" className="block text-gray-700 font-medium mb-2">Anything else you'd like to share with the landlord?</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="mb-8">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I confirm that all information provided is accurate and complete. I authorize the landlord to verify this information and perform background and credit checks. *
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}