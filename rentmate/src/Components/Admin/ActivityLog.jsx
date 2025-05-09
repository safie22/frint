import { useState, useEffect } from 'react';
import { 
  FaHistory, FaUserTie, FaHome, FaCheckCircle, 
  FaTimesCircle, FaPencilAlt, FaTrash, FaEye
} from 'react-icons/fa';
import dataService from '../../services/dataService';

const ActivityLog = ({ limit = 5, showViewAll = true }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load activity log on mount
  useEffect(() => {
    loadActivityLog();
    
    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_activity_log') {
        loadActivityLog();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, [limit]);

  // Load activity log from service
  const loadActivityLog = () => {
    const activityLog = dataService.getActivityLog();
    setActivities(activityLog.slice(0, limit));
    setLoading(false);
  };

  // Format the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get activity icon and color based on type and action
  const getActivityDetails = (activity) => {
    if (activity.type === 'landlord_update') {
      if (activity.action === 'approved') {
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          title: 'Landlord Approved',
          description: `Landlord account approved`,
          color: 'green'
        };
      } else if (activity.action === 'rejected') {
        return {
          icon: <FaTimesCircle className="text-red-500" />,
          title: 'Landlord Rejected',
          description: `Landlord account rejected`,
          color: 'red'
        };
      } else {
        return {
          icon: <FaUserTie className="text-blue-500" />,
          title: 'Landlord Updated',
          description: `Landlord information updated`,
          color: 'blue'
        };
      }
    } else if (activity.type === 'property_update') {
      if (activity.action === 'approved') {
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          title: 'Property Approved',
          description: `Property listing approved`,
          color: 'green'
        };
      } else if (activity.action === 'rejected') {
        return {
          icon: <FaTimesCircle className="text-red-500" />,
          title: 'Property Rejected',
          description: `Property listing rejected`,
          color: 'red'
        };
      } else {
        return {
          icon: <FaHome className="text-purple-500" />,
          title: 'Property Updated',
          description: `Property listing updated`,
          color: 'purple'
        };
      }
    } else {
      return {
        icon: <FaHistory className="text-gray-500" />,
        title: 'Activity',
        description: `System activity recorded`,
        color: 'gray'
      };
    }
  };

  // Get additional details about the activity
  const getEntityDetails = (activity) => {
    if (activity.type === 'landlord_update' && activity.landlordId) {
      const landlord = dataService.getLandlordById(activity.landlordId);
      return landlord ? `${landlord.name} (${landlord.email})` : `Landlord ID: ${activity.landlordId}`;
    } else if (activity.type === 'property_update' && activity.propertyId) {
      const property = dataService.getPropertyById(activity.propertyId);
      return property ? property.title : `Property ID: ${activity.propertyId}`;
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaHistory className="mr-2" />
          Activity Log
        </h2>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading activity log...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No activities recorded yet.
        </div>
      ) : (
        <div className="divide-y">
          {activities.map(activity => {
            const details = getActivityDetails(activity);
            const entityDetails = getEntityDetails(activity);
            
            return (
              <div key={activity.id} className="p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full bg-${details.color}-100 flex items-center justify-center`}>
                      {details.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{details.title}</p>
                    <p className="text-sm text-gray-600">{details.description}</p>
                    {entityDetails && (
                      <p className="text-sm text-gray-800 mt-1">{entityDetails}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {showViewAll && activities.length > 0 && (
        <div className="p-4 border-t">
          <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center">
            <FaEye className="mr-2" /> View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;