import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaFilter, FaSort, FaCheck, FaTimes, FaFileAlt, FaClock } from "react-icons/fa";

// Import services
import dataService from "../../services/dataService";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "date-desc" // date-desc, date-asc, property-az, property-za
  });

  useEffect(() => {
    const fetchApplications = () => {
      // Get tenant ID from localStorage
      const userId = Number(localStorage.getItem("userId"));
      
      try {
        // Get applications from localStorage
        const storedApplications = localStorage.getItem("tenant_applications");
        let applicationsData = storedApplications ? JSON.parse(storedApplications) : [];
        
        // Filter applications for current user
        applicationsData = applicationsData.filter(app => 
          app.applicantInfo && app.applicantInfo.applicantId === userId
        );
        
        // Get property details for each application
        const applicationsWithDetails = applicationsData.map(app => {
          const property = dataService.getPropertyById(app.propertyId);
          
          return {
            ...app,
            property
          };
        });
        
        // If no applications found in localStorage, generate some dummy ones for demo
        if (applicationsWithDetails.length === 0) {
          // Get all properties
          const allProperties = dataService.getProperties();
          
          // Create mock applications
          if (allProperties.length > 0) {
            const mockApplications = [];
            
            // Create a pending application
            const pendingProperty = allProperties.find(p => p.status === 'available' || p.status === 'approved');
            if (pendingProperty) {
              const pendingDate = new Date();
              pendingDate.setDate(pendingDate.getDate() - 2);
              
              mockApplications.push({
                propertyId: pendingProperty.id,
                status: "pending",
                documents: ["id.pdf", "employment.pdf", "credit-report.pdf"],
                applicationDate: pendingDate.toISOString(),
                id: `${pendingProperty.id}-${userId}-pending`,
                property: pendingProperty,
                applicantInfo: {
                  fullName: localStorage.getItem("userName") || "User",
                  email: localStorage.getItem("userEmail") || "user@example.com",
                  applicantId: userId
                }
              });
            }
            
            // Create an approved application
            const approvedProperty = allProperties.find(p => p.id !== (pendingProperty?.id || 0) && (p.status === 'available' || p.status === 'approved'));
            if (approvedProperty) {
              const approvedDate = new Date();
              approvedDate.setDate(approvedDate.getDate() - 15);
              
              mockApplications.push({
                propertyId: approvedProperty.id,
                status: "approved",
                documents: ["id.pdf", "employment.pdf", "credit-report.pdf"],
                applicationDate: approvedDate.toISOString(),
                id: `${approvedProperty.id}-${userId}-approved`,
                property: approvedProperty,
                applicantInfo: {
                  fullName: localStorage.getItem("userName") || "User",
                  email: localStorage.getItem("userEmail") || "user@example.com",
                  applicantId: userId
                }
              });
            }
            
            // Create a rejected application
            const rejectedProperty = allProperties.find(p => 
              p.id !== (pendingProperty?.id || 0) && 
              p.id !== (approvedProperty?.id || 0) && 
              (p.status === 'available' || p.status === 'approved')
            );
            
            if (rejectedProperty) {
              const rejectedDate = new Date();
              rejectedDate.setDate(rejectedDate.getDate() - 8);
              
              mockApplications.push({
                propertyId: rejectedProperty.id,
                status: "rejected",
                documents: ["id.pdf", "employment.pdf"],
                applicationDate: rejectedDate.toISOString(),
                id: `${rejectedProperty.id}-${userId}-rejected`,
                property: rejectedProperty,
                applicantInfo: {
                  fullName: localStorage.getItem("userName") || "User",
                  email: localStorage.getItem("userEmail") || "user@example.com",
                  applicantId: userId
                },
                rejectionReason: "Another applicant was selected."
              });
            }
            
            // Add mock applications to the list
            applicationsWithDetails.push(...mockApplications);
            
            // Save mock applications to localStorage for persistence
            if (mockApplications.length > 0) {
              localStorage.setItem("tenant_applications", JSON.stringify(mockApplications));
            }
          }
        }
        
        setApplications(applicationsWithDetails);
        setFilteredApplications(applicationsWithDetails);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
      
      setLoading(false);
    };

    // Fetch application data
    fetchApplications();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...applications];

    // Filter by status
    if (filters.status !== "all") {
      results = results.filter(app => app.status === filters.status);
    }

    // Apply sorting
    if (filters.sortBy === "date-desc") {
      results.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
    } else if (filters.sortBy === "date-asc") {
      results.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
    } else if (filters.sortBy === "property-az") {
      results.sort((a, b) => a.property?.title?.localeCompare(b.property?.title) || 0);
    } else if (filters.sortBy === "property-za") {
      results.sort((a, b) => b.property?.title?.localeCompare(a.property?.title) || 0);
    }

    setFilteredApplications(results);
  }, [applications, filters]);

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
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center">
            <FaClock className="mr-1" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <Link to="/tenant/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track the status of your rental applications
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="font-medium text-gray-700">
                {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''}
              </div>
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
            {filters.status !== "all" ? (
              <>
                <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                  <FaFileAlt className="h-8 w-8 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No {filters.status} applications</h2>
                <p className="text-gray-600 mb-6">You don't have any applications with the selected status.</p>
                <button
                  onClick={() => setFilters({ ...filters, status: "all" })}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
                >
                  View All Applications
                </button>
              </>
            ) : (
              <>
                <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                  <FaFileAlt className="h-8 w-8 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No applications yet</h2>
                <p className="text-gray-600 mb-6">When you apply for properties, your applications will appear here.</p>
                <Link
                  to="/properties"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
                >
                  Browse Properties
                </Link>
              </>
            )}
          </div>
        )}

        {/* Applications list */}
        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-6">
            {filteredApplications.map(application => (
              <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Property image */}
                    <div className="w-full md:w-48 flex-shrink-0">
                      <img
                        src={application.property?.images && application.property.images[0] 
                          ? application.property.images[0] 
                          : `https://source.unsplash.com/random/300x200/?apartment&${application.propertyId}`
                        }
                        alt={application.property?.title || "Property"}
                        className="w-full h-36 object-cover rounded-md"
                      />
                    </div>

                    {/* Application details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 mb-1">
                            {application.property?.title || "Property"}
                          </h2>
                          <p className="text-gray-600 text-sm mb-2">
                            {application.property?.location || "Location not available"}
                          </p>
                        </div>

                        {getStatusBadge(application.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Application Date</p>
                          <p className="font-medium">{formatDate(application.applicationDate)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Rent</p>
                          <p className="font-medium">${application.property?.price || 0}/month</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Documents Submitted</p>
                          <p className="font-medium">{application.documents?.length || 0} file(s)</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Property Size</p>
                          <p className="font-medium">{application.property?.bedrooms || 0} bed, {application.property?.bathrooms || 0} bath</p>
                        </div>
                      </div>

                      {/* Rejection reason if applicable */}
                      {application.status === "rejected" && application.rejectionReason && (
                        <div className="bg-red-50 p-3 rounded-md mb-4">
                          <p className="text-sm text-gray-700 font-medium">Reason for rejection:</p>
                          <p className="text-sm text-gray-600">{application.rejectionReason}</p>
                        </div>
                      )}

                      {/* Approval message if applicable */}
                      {application.status === "approved" && (
                        <div className="bg-green-50 p-3 rounded-md mb-4">
                          <p className="text-sm text-gray-700 font-medium">Your application has been approved!</p>
                          <p className="text-sm text-gray-600">Please check your messages for next steps from the landlord.</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/applications/${application.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                          <FaFileAlt className="mr-2" /> View Application
                        </Link>

                        <Link
                          to={`/properties/${application.propertyId}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          View Property
                        </Link>

                        {application.status === "pending" && (
                          <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors">
                            Withdraw Application
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}