import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserTie, FaHome, FaCheck, FaTimes, 
  FaCalendarAlt, FaFilter, FaSortAmountDown
} from 'react-icons/fa';
import dataService from '../../services/dataService';
import emailService from '../../services/emailService'; 
import { useNotifications } from '../../contexts/NotificationsContext';

const ApprovalsPanel = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, landlords, properties
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [itemToReject, setItemToReject] = useState(null);
  
  // Get notifications context
  const { addNotification } = useNotifications();
  
  // Fetch pending approvals on component mount
  useEffect(() => {
    loadPendingItems();
    
    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_landlords' || event.detail.key === 'rentmate_properties') {
        loadPendingItems();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);
  
  // Load pending items from data services
  const loadPendingItems = () => {
    // Get pending landlords
    const landlords = dataService.getLandlords().filter(l => l.status === 'pending');
    
    // Get pending properties
    const properties = dataService.getProperties().filter(p => p.status === 'pending');
    
    // Combine and format for display
    const pendingLandlords = landlords.map(landlord => ({
      id: `landlord-${landlord.id}`,
      type: 'landlord',
      data: landlord,
      title: landlord.name,
      subtitle: landlord.email,
      date: landlord.registrationDate || new Date().toISOString()
    }));
    
    const pendingProperties = properties.map(property => {
      // Get landlord info for this property
      const landlord = dataService.getLandlords().find(l => 
        property.landlordName === l.name || 
        (l.properties && l.properties.includes(property.id))
      );
      
      return {
        id: `property-${property.id}`,
        type: 'property',
        data: property,
        landlord: landlord,
        title: property.title,
        subtitle: property.location,
        date: property.submissionDate || new Date().toISOString()
      };
    });
    
    // Combine all pending items
    const allPendingItems = [...pendingLandlords, ...pendingProperties];
    
    // Sort by date, newest first
    allPendingItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setPendingItems(allPendingItems);
    setLoading(false);
  };
  
  // Apply filter
  const filteredItems = filter === 'all' 
    ? pendingItems 
    : pendingItems.filter(item => item.type === filter);
  
  // Handle approve action
  const handleApprove = async (item) => {
    try {
      if (item.type === 'landlord') {
        // Update landlord status
        await dataService.updateLandlord(item.data.id, { status: 'approved' });
        
        // Send approval email
        await emailService.sendLandlordApprovalEmail(item.data);
        
        // Add notification
        addNotification({
          title: 'Landlord Approved',
          message: `${item.data.name} has been approved as a landlord`,
          type: 'success',
          timestamp: new Date().toISOString()
        });
      } else if (item.type === 'property') {
        // Update property status
        await dataService.updateProperty(item.data.id, { status: 'approved' });
        
        // Send approval email if landlord exists
        if (item.landlord) {
          await emailService.sendPropertyApprovalEmail(item.landlord, item.data);
        }
        
        // Add notification
        addNotification({
          title: 'Property Approved',
          message: `"${item.data.title}" has been approved`,
          type: 'success',
          timestamp: new Date().toISOString()
        });
      }
      
      // Refresh the list
      loadPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
      
      // Add error notification
      addNotification({
        title: 'Approval Failed',
        message: 'There was an error processing the approval',
        type: 'error',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Open rejection modal
  const openRejectionModal = (item) => {
    setItemToReject(item);
    setRejectionReason('');
    setShowRejectionModal(true);
  };
  
  // Handle reject action
  const handleReject = async () => {
    try {
      const item = itemToReject;
      
      if (item.type === 'landlord') {
        // Update landlord status
        await dataService.updateLandlord(item.data.id, { 
          status: 'rejected',
          rejectionReason: rejectionReason
        });
        
        // Send rejection email
        await emailService.sendLandlordRejectionEmail(item.data, rejectionReason);
        
        // Add notification
        addNotification({
          title: 'Landlord Rejected',
          message: `${item.data.name} has been rejected`,
          type: 'warning',
          timestamp: new Date().toISOString()
        });
      } else if (item.type === 'property') {
        // Update property status
        await dataService.updateProperty(item.data.id, { 
          status: 'rejected',
          rejectionReason: rejectionReason
        });
        
        // Send rejection email if landlord exists
        if (item.landlord) {
          await emailService.sendPropertyRejectionEmail(item.landlord, item.data, rejectionReason);
        }
        
        // Add notification
        addNotification({
          title: 'Property Rejected',
          message: `"${item.data.title}" has been rejected`,
          type: 'warning',
          timestamp: new Date().toISOString()
        });
      }
      
      // Close modal and refresh the list
      setShowRejectionModal(false);
      loadPendingItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      
      // Add error notification
      addNotification({
        title: 'Rejection Failed',
        message: 'There was an error processing the rejection',
        type: 'error',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // If it's today, show the time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday, show "Yesterday"
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, show the full date
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="landlord">Landlords Only</option>
                <option value="property">Properties Only</option>
              </select>
              <FaFilter className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            {filter === 'all' && pendingItems.length > 0 && (
              <div className="flex">
                <Link 
                  to="/admin/landlords"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center ml-2"
                >
                  View All
                </Link>
              </div>
            )}
            
            {filter === 'landlord' && pendingItems.filter(i => i.type === 'landlord').length > 0 && (
              <div className="flex">
                <Link 
                  to="/admin/landlords"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center ml-2"
                >
                  View All
                </Link>
              </div>
            )}
            
            {filter === 'property' && pendingItems.filter(i => i.type === 'property').length > 0 && (
              <div className="flex">
                <Link 
                  to="/admin/properties"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center ml-2"
                >
                  View All
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaCheck className="text-gray-400 text-xl" />
                </div>
                <p className="text-lg">No pending approvals</p>
                <p className="text-sm mt-1">All items have been reviewed</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredItems.map(item => (
                  <div key={item.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {item.type === 'landlord' ? (
                          <FaUserTie className="text-gray-600" />
                        ) : (
                          <FaHome className="text-gray-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800">{item.title}</p>
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                            {item.type === 'landlord' ? 'Landlord' : 'Property'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.subtitle}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        onClick={() => handleApprove(item)}
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        onClick={() => openRejectionModal(item)}
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Rejection Modal */}
      {showRejectionModal && (
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
              {itemToReject.type === 'landlord' ? (
                `Are you sure you want to reject ${itemToReject.data.name}'s landlord application?`
              ) : (
                `Are you sure you want to reject the property "${itemToReject.data.title}"?`
              )}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for rejection (optional):
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a reason that will be sent to the user"
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
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalsPanel;