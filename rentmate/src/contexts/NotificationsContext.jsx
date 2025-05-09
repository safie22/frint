import { createContext, useState, useEffect, useContext } from 'react';
import dataService from '../services/dataService';

// Create context
const NotificationsContext = createContext();

// Provider component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    
    // Listen for notifications updates
    const handleNotificationsUpdated = (event) => {
      setNotifications(event.detail.notifications);
      setUnreadCount(event.detail.notifications.filter(n => !n.read).length);
    };
    
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, []);

  // Load notifications from service
  const loadNotifications = () => {
    const notificationsData = dataService.getNotifications();
    setNotifications(notificationsData);
    setUnreadCount(notificationsData.filter(n => !n.read).length);
  };

  // Add a notification
  const addNotification = (notification) => {
    const updatedNotifications = dataService.addNotification(notification);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    dataService.markNotificationAsRead(notificationId);
    loadNotifications();
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    dataService.markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export default NotificationsContext;