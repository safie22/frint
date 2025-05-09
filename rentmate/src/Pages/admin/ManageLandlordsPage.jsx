import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserTie, FaSearch, FaFilter, FaSort, FaCheck, FaTimes,
    FaEye, FaArrowLeft, FaEnvelope, FaExclamationCircle
} from 'react-icons/fa';

// Import services and hooks
import dataService from '../../services/dataService';
import emailService from '../../services/emailService';
import { useNotifications } from '../../contexts/NotificationsContext';

const ManageLandlordsPage = () => {
    const [landlords, setLandlords] = useState([]);
    const [filteredLandlords, setFilteredLandlords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all', // all, pending, approved, rejected
        sortBy: 'newest' // newest, oldest, name-az, name-za
    });
    const [selectedLandlord, setSelectedLandlord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [landlordToReject, setLandlordToReject] = useState(null);
    const [processingAction, setProcessingAction] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [rentedProperties, setRentedProperties] = useState([]);

    // Get notifications context
    const { addNotification } = useNotifications();

    // Fetch landlords on component mount
    useEffect(() => {
        loadLandlords();

        // Listen for data updates
        const handleDataUpdated = (event) => {
            if (event.detail.key === 'rentmate_landlords') {
                loadLandlords();
            }
        };

        window.addEventListener('dataUpdated', handleDataUpdated);

        // Clean up event listener
        return () => {
            window.removeEventListener('dataUpdated', handleDataUpdated);
        };
    }, []);

    // Load landlords from data service
    const loadLandlords = () => {
        const landlordsData = dataService.getLandlords();
        setLandlords(landlordsData);

        // Apply filters to the loaded data
        applyFilters(landlordsData, searchTerm, filters);

        setLoading(false);
    };

    // Apply filters and search
    const applyFilters = (landlordsList, term, filterOptions) => {
        let results = [...landlordsList];

        // Apply search term
        if (term) {
            const searchText = term.toLowerCase();
            results = results.filter(
                landlord =>
                    landlord.name.toLowerCase().includes(searchText) ||
                    landlord.email.toLowerCase().includes(searchText)
            );
        }

        // Apply status filter
        if (filterOptions.status !== 'all') {
            results = results.filter(landlord => landlord.status === filterOptions.status);
        }

        // Apply sorting
        if (filterOptions.sortBy === 'newest') {
            results.sort((a, b) => new Date(b.registrationDate || 0) - new Date(a.registrationDate || 0));
        } else if (filterOptions.sortBy === 'oldest') {
            results.sort((a, b) => new Date(a.registrationDate || 0) - new Date(b.registrationDate || 0));
        } else if (filterOptions.sortBy === 'name-az') {
            results.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filterOptions.sortBy === 'name-za') {
            results.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredLandlords(results);
    };

    // Effect to reapply filters when search or filters change
    useEffect(() => {
        if (!loading) {
            applyFilters(landlords, searchTerm, filters);
        }
    }, [searchTerm, filters]);

    // Handle landlord status change
    const handleStatusChange = async (landlordId, newStatus) => {
        setProcessingAction(true);
        setErrorMessage('');

        try {
            const landlord = landlords.find(l => l.id === landlordId);

            if (landlord) {
                // Update landlord status
                const result = await dataService.updateLandlord(landlordId, {
                    status: newStatus
                });

                if (result.success) {
                    // Send email notification
                    if (newStatus === 'approved') {
                        await emailService.sendLandlordApprovalEmail(landlord);
                        addNotification({
                            title: 'Landlord Approved',
                            message: `${landlord.name} was approved and notified via email`,
                            type: 'success',
                            timestamp: new Date().toISOString()
                        });
                    }

                    // Reload landlords
                    loadLandlords();
                } else {
                    // Handle error
                    if (result.error === 'LANDLORD_HAS_RENTED_PROPERTIES') {
                        setErrorMessage(result.message);
                        setRentedProperties(result.properties);
                        setShowErrorModal(true);
                    } else {
                        addNotification({
                            title: 'Action Failed',
                            message: result.message || 'Failed to update landlord status',
                            type: 'error',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }

            // Close modal if open
            if (showDetailsModal) {
                setShowDetailsModal(false);
            }
        } catch (error) {
            console.error('Error updating landlord status:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to update landlord status',
                type: 'error',
                timestamp: new Date().toISOString()
            });
        } finally {
            setProcessingAction(false);
        }
    };

    // Open rejection modal
    const openRejectionModal = (landlord) => {
        // First check if landlord has rented properties
        if (landlord.status === 'approved') {
            const properties = dataService.getProperties();
            const rentedProps = properties.filter(p =>
                p.status === 'rented' &&
                (landlord.properties && landlord.properties.includes(p.id))
            );

            if (rentedProps.length > 0) {
                setErrorMessage(`This landlord has ${rentedProps.length} rented properties and cannot be disabled.`);
                setRentedProperties(rentedProps);
                setShowErrorModal(true);
                return;
            }
        }

        setLandlordToReject(landlord);
        setRejectionReason('');
        setShowRejectionModal(true);
        // Close details modal if open
        if (showDetailsModal) {
            setShowDetailsModal(false);
        }
    };

    // Handle reject with reason
    const handleReject = async () => {
        setProcessingAction(true);

        try {
            if (!landlordToReject) return;

            // Update landlord status with rejection reason
            const result = await dataService.updateLandlord(landlordToReject.id, {
                status: 'rejected',
                rejectionReason: rejectionReason
            });

            if (result.success) {
                // Send rejection email
                await emailService.sendLandlordRejectionEmail(landlordToReject, rejectionReason);

                // Add notification
                addNotification({
                    title: 'Landlord Rejected',
                    message: `${landlordToReject.name} was rejected and notified via email`,
                    type: 'warning',
                    timestamp: new Date().toISOString()
                });

                // Reload landlords and close modal
                loadLandlords();
                setShowRejectionModal(false);
            } else {
                // Handle error
                if (result.error === 'LANDLORD_HAS_RENTED_PROPERTIES') {
                    setShowRejectionModal(false);
                    setErrorMessage(result.message);
                    setRentedProperties(result.properties);
                    setShowErrorModal(true);
                } else {
                    addNotification({
                        title: 'Action Failed',
                        message: result.message || 'Failed to reject landlord',
                        type: 'error',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Error rejecting landlord:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to reject landlord',
                type: 'error',
                timestamp: new Date().toISOString()
            });
        } finally {
            setProcessingAction(false);
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
                        <FaFilter className="mr-1" /> Pending
                    </span>
                );
        }
    };

    // View landlord details
    const viewLandlordDetails = (landlord) => {
        // Get landlord with properties
        const landlordWithProperties = {
            ...landlord,
            properties: dataService.getProperties().filter(p =>
                landlord.properties && landlord.properties.includes(p.id)
            )
        };

        setSelectedLandlord(landlordWithProperties);
        setShowDetailsModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Manage Landlords</h1>
                <p className="text-gray-600 mt-1">
                    Review and approve landlord registrations
                </p>
            </div>

            {/* Filters and search */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto relative">
                        <input
                            type="text"
                            placeholder="Search landlords..."
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
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name-az">Name (A-Z)</option>
                                <option value="name-za">Name (Z-A)</option>
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

            {/* No landlords */}
            {!loading && filteredLandlords.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                        <FaUserTie className="h-8 w-8 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No landlords found</h2>
                    <p className="text-gray-600 mb-6">No landlords match your filter criteria.</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilters({ status: 'all', sortBy: 'newest' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            {/* Landlords list */}
            {!loading && filteredLandlords.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Landlord
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Properties
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLandlords.map((landlord) => (
                                <tr key={landlord.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <FaUserTie className="text-gray-500" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{landlord.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    {landlord.email}
                                                    <FaEnvelope className="ml-2 text-gray-400 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {landlord.properties ? landlord.properties.length : 0} properties
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{formatDate(landlord.registrationDate)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(landlord.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => viewLandlordDetails(landlord)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>

                                            {landlord.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(landlord.id, 'approved')}
                                                        className="text-green-600 hover:text-green-900"
                                                        disabled={processingAction}
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectionModal(landlord)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={processingAction}
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}

                                            {landlord.status === 'rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(landlord.id, 'approved')}
                                                    className="text-green-600 hover:text-green-900"
                                                    disabled={processingAction}
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}

                                            {landlord.status === 'approved' && (
                                                <button
                                                    onClick={() => openRejectionModal(landlord)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={processingAction}
                                                    title="Disable Account"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Landlord Detail Modal */}
            {showDetailsModal && selectedLandlord && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full relative z-50">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Landlord Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                    <FaUserTie className="text-gray-500 text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedLandlord.name}</h3>
                                    <div className="flex items-center text-gray-600">
                                        {selectedLandlord.email}
                                        <FaEnvelope className="ml-2 text-gray-400 text-xs" />
                                    </div>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedLandlord.status)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Registration Date</p>
                                    <p className="font-medium">{formatDate(selectedLandlord.registrationDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Properties</p>
                                    <p className="font-medium">{selectedLandlord.properties ? selectedLandlord.properties.length : 0} listed</p>
                                </div>
                                {selectedLandlord.phone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedLandlord.phone}</p>
                                    </div>
                                )}
                            </div>

                            {selectedLandlord.rejectionReason && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
                                    <p className="text-sm text-gray-800 font-medium">Rejection Reason:</p>
                                    <p className="text-sm text-gray-600">{selectedLandlord.rejectionReason}</p>
                                </div>
                            )}

                            {selectedLandlord.properties && selectedLandlord.properties.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Properties</h4>
                                    <div className="space-y-3">
                                        {selectedLandlord.properties.map(property => (
                                            <div key={property.id} className="flex items-center">
                                                <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                                                    <img
                                                        src={`https://source.unsplash.com/random/100x100/?apartment&${property.id}`}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <div className="flex justify-between">
                                                        <p className="font-medium text-gray-800">{property.title}</p>
                                                        {property.status === 'rented' && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                                Rented
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{property.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            {selectedLandlord.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => openRejectionModal(selectedLandlord)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                        disabled={processingAction}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedLandlord.id, 'approved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        disabled={processingAction}
                                    >
                                        {processingAction ? 'Processing...' : 'Approve'}
                                    </button>
                                </>
                            )}

                            {selectedLandlord.status === 'approved' && (
                                <button
                                    onClick={() => openRejectionModal(selectedLandlord)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    disabled={processingAction}
                                >
                                    {processingAction ? 'Processing...' : 'Disable Account'}
                                </button>
                            )}

                            {selectedLandlord.status === 'rejected' && (
                                <button
                                    onClick={() => handleStatusChange(selectedLandlord.id, 'approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    disabled={processingAction}
                                >
                                    {processingAction ? 'Processing...' : 'Approve Account'}
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
            )}

            {/* Rejection Modal */}
            {showRejectionModal && landlordToReject && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowRejectionModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full relative z-50">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Confirm Rejection</h2>
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="mb-4 text-gray-600">
                            Are you sure you want to reject {landlordToReject.name}'s account? This will send an email notification to the landlord.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for rejection (optional):
                            </label>
                            <textarea
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Provide a reason that will be sent to the landlord"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={processingAction}
                            >
                                {processingAction ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal (for rented properties) */}
            {showErrorModal && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowErrorModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full relative z-50">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaExclamationCircle className="text-red-500 mr-2" /> Cannot Disable Account
                            </h2>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="mb-4 text-gray-600">
                            {errorMessage}
                        </p>

                        {rentedProperties && rentedProperties.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Currently Rented Properties:</h3>
                                <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
                                    {rentedProperties.map(property => (
                                        <div key={property.id} className="flex items-center mb-2 last:mb-0">
                                            <div className="h-8 w-8 bg-gray-200 rounded overflow-hidden mr-2">
                                                <img
                                                    src={`https://source.unsplash.com/random/50x50/?apartment&${property.id}`}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{property.title}</p>
                                                <p className="text-xs text-gray-600">{property.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-yellow-50 p-3 rounded-md mb-6">
                            <p className="text-sm text-yellow-800">
                                <FaExclamationCircle className="inline mr-1" /> Landlords with active rentals cannot be disabled.
                                You must wait for all properties to be unrented before disabling the account.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageLandlordsPage;