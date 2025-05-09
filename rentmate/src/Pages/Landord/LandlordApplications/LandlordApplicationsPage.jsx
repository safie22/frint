import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaSearch, FaFilter, FaSort, FaCheck, FaTimes, 
  FaEye, FaFileAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegUser,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import services
import dataService from '../../../services/dataService';

const LandlordApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, rejected
    sortBy: 'date-desc' // date-desc, date-asc, property-az, property-za
  });
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState(null); // 'approve' or 'reject'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [applicantDetails, setApplicantDetails] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  
  // Get landlord ID from localStorage
  const landlordId = Number(localStorage.getItem('userId'));
  
  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, [landlordId]);
  
  // Function to fetch applications
  const fetchApplications = () => {
    setLoading(true);
    
    try {
      // Get landlord data
      const landlord = dataService.getLandlordById(landlordId);
      
      if (!landlord || !landlord.properties || landlord.properties.length === 0) {
        // No properties found
        setApplications([]);
        setFilteredApplications([]);
        setLoading(false);
        return;
      }
      
      // Get applications from localStorage
      const storedApplications = localStorage.getItem("tenant_applications");
      let applicationsData = storedApplications ? JSON.parse(storedApplications) : [];
      
      // Filter applications for properties owned by this landlord
      applicationsData = applicationsData.filter(app => 
        landlord.properties.includes(Number(app.propertyId))
      );
      
      // Get property details for each application
      const applicationsWithDetails = applicationsData.map(app => {
        const property = dataService.getPropertyById(Number(app.propertyId));
        
        // Get tenant info
        const tenant = app.applicantInfo || {
          name: "Unknown Tenant",
          email: "unknown@example.com",
          id: 0
        };
        
        return {
          ...app,
          property,
          tenant: {
            id: tenant.applicantId || tenant.id,
            name: tenant.fullName || tenant.name,
            email: tenant.email,
            phone: tenant.phone || "N/A",
            occupation: tenant.occupation || "Not specified"
          }
        };
      });
      
      // If no applications found in localStorage, create some mock data for demo
      if (applicationsWithDetails.length === 0 && landlord.properties.length > 0) {
        const mockApplications = [];
        
        // Create mock tenant data for each property
        const mockTenants = [
          {
            id: 1001,
            name: "James Wilson",
            email: "james@example.com",
            phone: "+1-555-123-4567",
            occupation: "Software Engineer",
            income: "$95,000"
          },
          {
            id: 1002,
            name: "Emily Clark",
            email: "emily@example.com",
            phone: "+1-555-987-6543",
            occupation: "Marketing Manager",
            income: "$85,000"
          },
          {
            id: 1003,
            name: "Michael Johnson",
            email: "michael@example.com",
            phone: "+1-555-567-8901",
            occupation: "Financial Analyst",
            income: "$92,000"
          }
        ];
        
        // Create a few mock applications
        landlord.properties.forEach((propertyId, index) => {
          const property = dataService.getPropertyById(propertyId);
          if (property) {
            const tenantIndex = index % mockTenants.length;
            const tenant = mockTenants[tenantIndex];
            
            // Create application date (random date within the last 30 days)
            const applicationDate = new Date();
            applicationDate.setDate(applicationDate.getDate() - Math.floor(Math.random() * 30));
            
            // Determine status based on property
            let status = "pending";
            if (property.status === "rented") {
              status = "approved";
            } else if (index % 3 === 2) { // Make some rejected
              status = "rejected";
            }
            
            mockApplications.push({
              id: `${propertyId}-${tenant.id}-${Date.now() + index}`,
              propertyId: propertyId,
              property,
              tenant,
              status,
              applicationDate: applicationDate.toISOString(),
              documents: ["id.pdf", "employment.pdf", "credit-report.pdf"],
              note: "I am very interested in this property and would like to rent it as soon as possible.",
              applicantInfo: {
                fullName: tenant.name,
                email: tenant.email,
                phone: tenant.phone,
                occupation: tenant.occupation,
                income: tenant.income,
                applicantId: tenant.id
              },
              rejectionReason: status === "rejected" ? "Another applicant was selected." : undefined
            });
          }
        });
        
        // Save mock applications to localStorage for persistence
        if (mockApplications.length > 0) {
          // Get existing applications, if any
          const existingApps = storedApplications ? JSON.parse(storedApplications) : [];
          localStorage.setItem("tenant_applications", JSON.stringify([...existingApps, ...mockApplications]));
          
          // Add to the applications list
          applicationsWithDetails.push(...mockApplications);
        }
      }
      
      setApplications(applicationsWithDetails);
      applyFilters(applicationsWithDetails, searchTerm, filters);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    
    setLoading(false);
  };
  
  // Apply filters to applications
  const applyFilters = (apps, search, filterOptions) => {
    let results = [...apps];
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(app => 
        (app.tenant?.name?.toLowerCase() || "").includes(searchLower) ||
        (app.property?.title?.toLowerCase() || "").includes(searchLower) ||
        (app.property?.location?.toLowerCase() || "").includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filterOptions.status !== 'all') {
      results = results.filter(app => app.status === filterOptions.status);
    }
    
    // Apply sorting
    if (filterOptions.sortBy === 'date-desc') {
      results.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
    } else if (filterOptions.sortBy === 'date-asc') {
      results.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
    } else if (filterOptions.sortBy === 'property-az') {
      results.sort((a, b) => (a.property?.title || "").localeCompare(b.property?.title || ""));
    } else if (filterOptions.sortBy === 'property-za') {
      results.sort((a, b) => (b.property?.title || "").localeCompare(a.property?.title || ""));
    }
    
    setFilteredApplications(results);
  };
  
  // Effect to reapply filters when they change
  useEffect(() => {
    if (!loading) {
      applyFilters(applications, searchTerm, filters);
    }
  }, [searchTerm, filters, loading]);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Get application status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center">
            <FaFileAlt className="mr-1" /> Pending
          </span>
        );
    }
  };
  
  // Open decision modal
  const openDecisionModal = (application, type) => {
    setSelectedApplication(application);
    setDecisionType(type);
    setRejectionReason('');
    setShowDecisionModal(true);
  };
  
  // Open applicant details modal
  const openApplicantModal = (tenant) => {
    setApplicantDetails(tenant);
    setShowApplicantModal(true);
  };
  
  // Handle application decision
  const handleApplicationDecision = () => {
    if (!selectedApplication) return;
    
    try {
      // Get applications from localStorage
      const storedApplications = localStorage.getItem("tenant_applications");
      const applicationsData = storedApplications ? JSON.parse(storedApplications) : [];
      
      // Update the selected application
      const updatedApplications = applicationsData.map(app => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            status: decisionType === 'approve' ? 'approved' : 'rejected',
            rejectionReason: decisionType === 'reject' ? rejectionReason : undefined
          };
        }
        return app;
      });
      
      // Save back to localStorage
      localStorage.setItem("tenant_applications", JSON.stringify(updatedApplications));
      
      // Update local state
      const updatedLocalApplications = applications.map(app => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            status: decisionType === 'approve' ? 'approved' : 'rejected',
            rejectionReason: decisionType === 'reject' ? rejectionReason : undefined
          };
        }
        return app;
      });
      
      setApplications(updatedLocalApplications);
      applyFilters(updatedLocalApplications, searchTerm, filters);
      
      // If approved, update property status to rented
      if (decisionType === 'approve' && selectedApplication.property) {
        dataService.updateProperty(selectedApplication.propertyId, { status: 'rented' });
      }
      
      // Close modal
      setShowDecisionModal(false);
      setSelectedApplication(null);
      setDecisionType(null);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/landlord/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Rental Applications</h1>
        <p className="text-gray-600 mt-1">
          View and manage applications for your properties
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto relative">
            <input
              type="text"
              placeholder="Search applications..."
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
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="property-az">Property (A-Z)</option>
                <option value="property-za">Property (Z-A)</option>
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
      
      {/* No applications */}
      {!loading && filteredApplications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileAlt className="text-gray-400 text-3xl" />
          </div>
          {applications.length === 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No applications yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't received any rental applications yet. When someone applies for your properties, they'll appear here.
              </p>
              <Link 
                to="/landlord/properties"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
              >
                Manage Properties
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No matching applications</h2>
              <p className="text-gray-600 mb-6">Try adjusting your search filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ status: 'all', sortBy: 'date-desc' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
              >
                Reset Filters
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Applications list */}
      {!loading && filteredApplications.length > 0 && (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property image and info */}
                  <div className="md:w-64 flex-shrink-0">
                    <img
                      src={application.property?.images && application.property.images[0] 
                        ? application.property.images[0] 
                        : `https://source.unsplash.com/random/300x200/?apartment&${application.propertyId}`
                      }
                      alt={application.property?.title || "Property"}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-medium text-gray-800">{application.property?.title || "Property"}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{application.property?.location || "Location unavailable"}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      ${application.property?.price || 0}/month
                    </div>
                  </div>
                  
                  {/* Application details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <FaRegUser className="text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{application.tenant?.name || "Applicant"}</h3>
                            <p className="text-sm text-gray-600">{application.tenant?.occupation || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Application Date</p>
                        <p className="font-medium">{formatDate(application.applicationDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documents Submitted</p>
                        <p className="font-medium">{application.documents?.length || 0} files</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-1" />
                          <a href={`mailto:${application.tenant?.email}`} className="text-blue-600 hover:text-blue-800">
                            {application.tenant?.email || "No email provided"}
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <div className="flex items-center">
                          <FaPhone className="text-gray-400 mr-1" />
                          <a href={`tel:${application.tenant?.phone}`} className="text-blue-600 hover:text-blue-800">
                            {application.tenant?.phone || "No phone provided"}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {application.note && (
                      <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-700 font-medium">Applicant's Note:</p>
                        <p className="text-sm text-gray-600">{application.note}</p>
                      </div>
                    )}
                    
                    {application.status === 'rejected' && application.rejectionReason && (
                      <div className="bg-red-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-700 font-medium">Rejection Reason:</p>
                        <p className="text-sm text-gray-600">{application.rejectionReason}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => openApplicantModal(application.tenant)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="inline-block mr-2" />
                        View Applicant Details
                      </button>
                      
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openDecisionModal(application, 'approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            disabled={application.property?.status === 'rented'}
                          >
                            <FaCheck className="inline-block mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => openDecisionModal(application, 'reject')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <FaTimes className="inline-block mr-2" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Decision Modal (Approve/Reject) */}
      {showDecisionModal && selectedApplication && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDecisionModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full relative z-50">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {decisionType === 'approve' ? 'Approve Application' : 'Reject Application'}
              </h2>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                {decisionType === 'approve' 
                  ? `Are you sure you want to approve ${selectedApplication.tenant?.name}'s application for "${selectedApplication.property?.title}"?`
                  : `Are you sure you want to reject ${selectedApplication.tenant?.name}'s application for "${selectedApplication.property?.title}"?`
                }
              </p>
              
              {decisionType === 'approve' && (
                <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <FaExclamationTriangle className="inline-block mr-2" />
                    By approving this application, the property will be marked as "Rented" and no longer available for other applicants.
                  </p>
                </div>
              )}
              
              {decisionType === 'reject' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for rejection (optional):
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide a reason that will be sent to the applicant"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDecisionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplicationDecision}
                className={`px-4 py-2 ${
                  decisionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-md`}
              >
                {decisionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Applicant Details Modal */}
      {showApplicantModal && applicantDetails && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowApplicantModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full relative z-50">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Applicant Details</h2>
              <button
                onClick={() => setShowApplicantModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <FaRegUser className="text-gray-500 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{applicantDetails.name}</h3>
                  <p className="text-gray-600">{applicantDetails.occupation || 'Professional'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <p className="font-medium">{applicantDetails.email}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-2" />
                    <p className="font-medium">{applicantDetails.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="font-medium">{applicantDetails.income || '$80,000/year'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Credit Score</p>
                  <p className="font-medium">740</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Current Address</p>
                  <p className="font-medium">{applicantDetails.currentAddress || '123 Current St, Anytown, USA'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Length of Stay</p>
                  <p className="font-medium">3 years</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Employment Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">Acme Corporation</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{applicantDetails.occupation || 'Professional'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Length of Employment</p>
                      <p className="font-medium">4 years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income</p>
                      <p className="font-medium">{applicantDetails.income ? 
                        (applicantDetails.income.includes('/year') ? 
                          '$' + Math.round(parseInt(applicantDetails.income.replace(/[^0-9]/g, '')) / 12).toLocaleString() : 
                          applicantDetails.income) : 
                        '$6,600'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Documents Submitted</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-500 mr-2" />
                        <span>ID Document.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-500 mr-2" />
                        <span>Employment Verification.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-500 mr-2" />
                        <span>Credit Report.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowApplicantModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordApplicationsPage;