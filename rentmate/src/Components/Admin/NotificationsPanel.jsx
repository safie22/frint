import { useState } from 'react';
import { 
  FaBell, FaCheck, FaTimes, FaUserTie, FaHome, 
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaEye
} from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationsContext';

const NotificationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Format the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      case 'landlord':
        return <FaUserTie className="text-blue-500" />;
      case 'property':
        return <FaHome className="text-purple-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={togglePanel}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={togglePanel}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <FaCheck />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t text-center">
              <button 
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
              >
                <FaEye className="mr-1" /> View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;