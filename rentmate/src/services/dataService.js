// Data service to centralize data management across components
import { properties, users, messages } from '../data/dummyData';

// Local storage keys
const STORAGE_KEYS = {
  LANDLORDS: 'rentmate_landlords',
  PROPERTIES: 'rentmate_properties',
  NOTIFICATIONS: 'rentmate_notifications',
  ACTIVITY_LOG: 'rentmate_activity_log'
};

// Initialize data in localStorage if not already present
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.LANDLORDS)) {
    localStorage.setItem(STORAGE_KEYS.LANDLORDS, JSON.stringify(users.landlords));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify([]));
  }
};

// Get all landlords
export const getLandlords = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LANDLORDS) || '[]');
};

// Get landlord by ID
export const getLandlordById = (id) => {
  const landlords = getLandlords();
  return landlords.find(l => l.id === id);
};

// Update landlord
export const updateLandlord = (landlordId, updatedData) => {
  const landlords = getLandlords();
  const index = landlords.findIndex(l => l.id === landlordId);
  
  if (index !== -1) {
    // Get the landlord before update
    const originalLandlord = landlords[index];
    
    // If we're disabling a landlord (changing from approved to rejected)
    if (originalLandlord.status === 'approved' && updatedData.status === 'rejected') {
      // Check if the landlord has any rented properties
      const properties = getProperties();
      const rentedProperties = properties.filter(p => 
        p.status === 'rented' && 
        (originalLandlord.properties && originalLandlord.properties.includes(p.id))
      );
      
      if (rentedProperties.length > 0) {
        // Return error info
        return {
          success: false,
          error: 'LANDLORD_HAS_RENTED_PROPERTIES',
          message: `This landlord has ${rentedProperties.length} rented properties and cannot be disabled.`,
          properties: rentedProperties
        };
      }
      
      // If landlord is being disabled, also update their properties
      const allProperties = getProperties();
      const landlordProperties = allProperties.filter(p => 
        originalLandlord.properties && originalLandlord.properties.includes(p.id)
      );
      
      // Mark all non-rented properties as unavailable
      landlordProperties.forEach(property => {
        if (property.status !== 'rented') {
          updateProperty(property.id, { status: 'unavailable' });
        }
      });
    }
    
    // Update the landlord data
    landlords[index] = { ...landlords[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.LANDLORDS, JSON.stringify(landlords));
    
    // Add to activity log, but don't create notifications here
    // (Notifications will be handled by the component that called this function)
    const activity = {
      id: Date.now(),
      type: 'landlord_update',
      landlordId,
      action: updatedData.status || 'update',
      timestamp: new Date().toISOString()
    };
    addToActivityLog(activity);
    
    return { success: true };
  }
  
  return { success: false, error: 'LANDLORD_NOT_FOUND' };
};

// Get all properties
export const getProperties = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
};

// Get property by ID
export const getPropertyById = (id) => {
  const properties = getProperties();
  return properties.find(p => p.id === id);
};

// Get available properties
export const getAvailableProperties = () => {
  const properties = getProperties();
  return properties.filter(p => 
    p.status === 'available' || p.status === 'approved'
  );
};

// Update property
export const updateProperty = (propertyId, updatedData) => {
  const properties = getProperties();
  const index = properties.findIndex(p => p.id === propertyId);
  
  if (index !== -1) {
    // Update the property data
    properties[index] = { ...properties[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    
    // Add to activity log, but don't create notifications here
    const activity = {
      id: Date.now(),
      type: 'property_update',
      propertyId,
      action: updatedData.status || 'update',
      timestamp: new Date().toISOString()
    };
    addToActivityLog(activity);
    
    return true;
  }
  
  return false;
};

// Get notifications
export const getNotifications = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
};

// Add notification
export const addNotification = (notification) => {
  const notifications = getNotifications();
  
  // Check for duplicates in the last 5 seconds
  const now = new Date();
  const last5Seconds = now.getTime() - 5000;
  
  const isDuplicate = notifications.some(n => 
    n.title === notification.title &&
    n.message === notification.message &&
    new Date(n.timestamp).getTime() > last5Seconds
  );
  
  if (isDuplicate) {
    // Skip duplicate notification
    return notifications;
  }
  
  // Add new notification at the beginning
  notifications.unshift({
    id: Date.now(),
    read: false,
    ...notification
  });
  
  // Keep only the latest 50 notifications
  const updatedNotifications = notifications.slice(0, 50);
  
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  
  // Dispatch a custom event to notify components
  const event = new CustomEvent('notificationsUpdated', {
    detail: { notifications: updatedNotifications }
  });
  window.dispatchEvent(event);
  
  return updatedNotifications;
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return true;
  }
  
  return false;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  
  const updatedNotifications = notifications.map(n => ({
    ...n,
    read: true
  }));
  
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  
  // Dispatch a custom event to notify components
  const event = new CustomEvent('notificationsUpdated', {
    detail: { notifications: updatedNotifications }
  });
  window.dispatchEvent(event);
  
  return true;
};

// Get activity log
export const getActivityLog = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG) || '[]');
};

// Add to activity log
export const addToActivityLog = (activity) => {
  const activityLog = getActivityLog();
  
  // Add new activity at the beginning
  activityLog.unshift({
    id: Date.now(),
    ...activity
  });
  
  // Keep only the latest 100 activities
  const updatedActivityLog = activityLog.slice(0, 100);
  
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(updatedActivityLog));
  
  return updatedActivityLog;
};

// Get pending landlords count
export const getPendingLandlordsCount = () => {
  const landlords = getLandlords();
  return landlords.filter(l => l.status === 'pending').length;
};

// Get pending properties count
export const getPendingPropertiesCount = () => {
  const properties = getProperties();
  return properties.filter(p => p.status === 'pending').length;
};

// Get unread notifications count
export const getUnreadNotificationsCount = () => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};

// Check if landlord has rented properties
export const landlordHasRentedProperties = (landlordId) => {
  const landlord = getLandlordById(landlordId);
  if (!landlord || !landlord.properties || landlord.properties.length === 0) {
    return false;
  }
  
  const properties = getProperties();
  const rentedProperties = properties.filter(p => 
    p.status === 'rented' && 
    landlord.properties.includes(p.id)
  );
  
  return rentedProperties.length > 0;
};

// Listen for storage changes (useful for multi-tab sync)
window.addEventListener('storage', (event) => {
  if (Object.values(STORAGE_KEYS).includes(event.key)) {
    // Dispatch a custom event to notify components
    const customEvent = new CustomEvent('dataUpdated', {
      detail: { key: event.key }
    });
    window.dispatchEvent(customEvent);
  }
});

// Export a default object with all functions
export default {
  getLandlords,
  getLandlordById,
  updateLandlord,
  getProperties,
  getPropertyById,
  getAvailableProperties,
  updateProperty,
  getNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getActivityLog,
  addToActivityLog,
  getPendingLandlordsCount,
  getPendingPropertiesCount,
  getUnreadNotificationsCount,
  landlordHasRentedProperties
};