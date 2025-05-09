# .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

# eslint.config.js

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]

```

# index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

# package.json

```json
{
  "name": "rentmate",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "vite"
  },
  "dependencies": {
    "@fontsource-variable/roboto": "^5.2.5",
    "@fortawesome/fontawesome-free": "^6.7.2",
    "@tailwindcss/vite": "^4.1.4",
    "axios": "^1.8.4",
    "formik": "^2.4.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.5.2",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.5.1",
    "yup": "^1.6.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.22.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.4",
    "vite": "^6.3.1"
  }
}

```

# public\vite.svg

This is a file of the type: SVG Image

# README.md

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

# src.rar

This is a binary file of the type: Compressed Archive

# src\App.jsx

```jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import HomePage from './pages/Home/Home';
import PropertyListingPage from './pages/PropertyListings/PropertyListings';
import PropertyDetailPage from './pages/PropertyDetails/PropertyDetails';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Signup/Signup';
import TenantDashboard from './pages/TenantDashboard/TenantDashboard';
import SavedPropertiesPage from './pages/SavedProperties/SavedProperties';
import ApplicationsPage from './pages/TenantApplications/TenantApplications';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm';
import LandlordDashboard from './pages/Landord/LandlordDashboard/LandlordDashboard';
// import ManagePropertiesPage from './pages/landlord/ManagePropertiesPage';
// import PropertyFormPage from './pages/landlord/PropertyFormPage';
// import LandlordApplicationsPage from './pages/landlord/LandlordApplicationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageLandlordsPage from './pages/admin/ManageLandlordsPage';
import ManageAllPropertiesPage from './pages/admin/ManageAllPropertiesPage';
import MessagesPage from './pages/Messeges/Messages';

// Context providers
import { NotificationsProvider } from './contexts/NotificationsContext';

// Services
import dataService from './services/dataService';

// Mock data
import { users } from './data/dummyData';
// import { initializeSocket } from './services/mockSocketService';

// Protected Route component
const ProtectedRoute = ({ children, userRole, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const storedRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(storedRole)) {
    // Redirect to appropriate dashboard
    if (storedRole === 'tenant') {
      return <Navigate to="/tenant/dashboard" />;
    } else if (storedRole === 'landlord') {
      return <Navigate to="/landlord/dashboard" />;
    } else if (storedRole === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  // Check for authentication on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');
    const storedId = localStorage.getItem('userId');

    setIsAuthenticated(storedAuth);
    setUserRole(storedRole);
    setUserId(storedId);

    // If authenticated, initialize data
    if (storedAuth && storedId) {
      // Set saved properties from local storage
      const savedProps = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      setSavedProperties(savedProps);
    }
  }, []);

  // Add a function to handle saving/unsaving properties
  const handleSaveProperty = (propertyId) => {
    if (!isAuthenticated) return;

    const numericId = Number(propertyId);
    const isSaved = savedProperties.includes(numericId);
    let updatedSavedProperties;

    if (isSaved) {
      // Remove from saved
      updatedSavedProperties = savedProperties.filter(id => id !== numericId);
    } else {
      // Add to saved
      updatedSavedProperties = [...savedProperties, numericId];
    }

    // Update localStorage
    localStorage.setItem('savedProperties', JSON.stringify(updatedSavedProperties));

    // Update state
    setSavedProperties(updatedSavedProperties);

    // Dispatch a custom event to notify other components
    const event = new CustomEvent('savedPropertiesUpdated', {
      detail: { savedProperties: updatedSavedProperties }
    });
    window.dispatchEvent(event);
  };

  // Mock auth functions
  const handleLogin = (role, redirectPath) => {
    let user;
    
    // Find a user based on role
    if (role === 'tenant') {
      user = users.tenants[0];
    } else if (role === 'landlord') {
      user = users.landlords[0];
    } else if (role === 'admin') {
      user = users.admins[0];
    }
  
    if (user) {
      // Set localStorage and state as before
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
  
      // If tenant, setup saved properties
      if (role === 'tenant' && user.savedProperties) {
        localStorage.setItem('savedProperties', JSON.stringify(user.savedProperties));
        setSavedProperties(user.savedProperties);
      }
  
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(user.id);
      
      // For admin, add welcome notification
      if (role === 'admin') {
        // Add a slight delay to ensure the notification provider is mounted
        setTimeout(() => {
          // Add notifications for pending items
          const pendingLandlords = dataService.getLandlords().filter(l => l.status === 'pending').length;
          const pendingProperties = dataService.getProperties().filter(p => p.status === 'pending').length;
          
          if (pendingLandlords > 0 || pendingProperties > 0) {
            dataService.addNotification({
              title: 'Items Require Approval',
              message: `You have ${pendingLandlords} landlord${pendingLandlords !== 1 ? 's' : ''} and ${pendingProperties} propert${pendingProperties !== 1 ? 'ies' : 'y'} pending approval.`,
              type: 'info',
              timestamp: new Date().toISOString()
            });
          }
        }, 500);
      }
  
      return true;
    }
  
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <NotificationsProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar
            userRole={userRole}
            isAuthenticated={isAuthenticated}
            logout={handleLogout}
          />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
              <Route
                path="/properties"
                element={
                  <PropertyListingPage
                    isAuthenticated={isAuthenticated}
                    savedPropertyIds={savedProperties}
                    onSaveToggle={handleSaveProperty}
                  />
                }
              />
              <Route
                path="/properties/:id"
                element={
                  <PropertyDetailPage
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                    savedPropertyIds={savedProperties}
                    onSaveToggle={handleSaveProperty}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ?
                    <Navigate to={`/${userRole}/dashboard`} /> :
                    <LoginPage onLogin={(role, redirectPath) => handleLogin(role, redirectPath)} />
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ?
                    <Navigate to={`/${userRole}/dashboard`} /> :
                    <RegisterPage />
                }
              />

              {/* Tenant Routes */}
              <Route
                path="/tenant/dashboard"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['tenant']}>
                    <TenantDashboard savedPropertyIds={savedProperties} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-properties"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['tenant']}>
                    <SavedPropertiesPage
                      savedPropertyIds={savedProperties}
                      onSaveToggle={handleSaveProperty}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['tenant']}>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply/:id"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['tenant']}>
                    <ApplicationForm />
                  </ProtectedRoute>
                }
              />

              {/* Landlord Routes */}
              <Route
                path="/landlord/dashboard"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['landlord']}>
                    <LandlordDashboard />
                  </ProtectedRoute>
                }
              />
              {/*
              <Route 
                path="/landlord/properties" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['landlord']}>
                    <ManagePropertiesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/landlord/properties/new" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['landlord']}>
                    <PropertyFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/landlord/properties/:id/edit" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['landlord']}>
                    <PropertyFormPage isEdit={true} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/landlord/applications" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['landlord']}>
                    <LandlordApplicationsPage />
                  </ProtectedRoute>
                } 
              />
              */}
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/landlords" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                    <ManageLandlordsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties" 
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                    <ManageAllPropertiesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Messages - available to authenticated users */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute userRole={userRole} allowedRoles={['tenant', 'landlord']}>
                    <MessagesPage userId={userId} userRole={userRole} />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </NotificationsProvider>
  );
}

export default App;
```

# src\assets\react.svg

This is a file of the type: SVG Image

# src\Components\Admin\ActivityLog.jsx

```jsx
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
```

# src\Components\Admin\ApprovalsPanel.jsx

```jsx
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
```

# src\Components\Admin\NotificationsPanel.jsx

```jsx
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
```

# src\Components\Admin\StatsOverview.jsx

```jsx
import { useState, useEffect } from 'react';
import { 
  FaUsers, FaHome, FaCheckCircle, FaTimesCircle, 
  FaCalendarCheck, FaEye, FaChartLine
} from 'react-icons/fa';
import dataService from '../../services/dataService';

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    activeListings: 0,
    totalViews: 0,
    totalApplications: 0,
    weeklyGrowth: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      // Get all landlords
      const landlords = dataService.getLandlords();
      
      // Get all properties
      const properties = dataService.getProperties();
      
      // Calculate stats
      const pendingLandlords = landlords.filter(l => l.status === 'pending').length;
      const pendingProperties = properties.filter(p => p.status === 'pending').length;
      const pendingApprovals = pendingLandlords + pendingProperties;
      
      const activeListings = properties.filter(p => 
        p.status === 'approved' || p.status === 'available'
      ).length;
      
      const totalViews = properties.reduce((total, property) => total + (property.views || 0), 0);
      
      // Mock data for demo
      const totalApplications = 12; // This would come from applications data
      const weeklyGrowth = 15; // This would be calculated from historical data
      
      setStats({
        totalUsers: landlords.length + 2, // +2 for the mock tenants
        totalProperties: properties.length,
        pendingApprovals,
        activeListings,
        totalViews,
        totalApplications,
        weeklyGrowth
      });
      
      setLoading(false);
    };
    
    calculateStats();
    
    // Listen for data updates
    const handleDataUpdated = () => {
      calculateStats();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="ml-4 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FaUsers className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalUsers)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Landlords</span>
            <span className="font-medium">{formatNumber(dataService.getLandlords().length)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Tenants</span>
            <span className="font-medium">2</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <FaHome className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Properties</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalProperties)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Active Listings</span>
            <span className="font-medium">{formatNumber(stats.activeListings)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Pending Approval</span>
            <span className="font-medium text-yellow-600">{formatNumber(dataService.getProperties().filter(p => p.status === 'pending').length)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <FaEye className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Views</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalViews)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Avg. Views per Property</span>
            <span className="font-medium">
              {stats.totalProperties > 0 ? Math.round(stats.totalViews / stats.totalProperties) : 0}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <FaCalendarCheck className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Applications</p>
            <p className="text-2xl font-semibold text-gray-800">{formatNumber(stats.totalApplications)}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Conversion Rate</span>
            <span className="font-medium">
              {stats.totalViews > 0 ? ((stats.totalApplications / stats.totalViews) * 100).toFixed(1) + '%' : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
```

# src\Components\Footer\Footer.jsx

```jsx

export default function Footer() {
  return <>
  <footer>
    <div className="container text-white text-center bg-blue-600 py-10 fixed bottom-0 left-0">
<h3>Copy Right 2019 © By RentMate All Rights Reserved</h3>
    </div>
  </footer>
  </>
}

```

# src\Components\Layout\Layout.jsx

```jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  return <>
  <Navbar/>
  <Outlet></Outlet>
  <Footer/>
  </>
}

```

# src\Components\Looding\Looding.jsx

```jsx

export default function Looding() {
  return (
    <div>Looding</div>
  )
}

```

# src\Components\Navbar\Navbar.jsx

```jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield, FaUsers, FaHome } from "react-icons/fa";

export default function Navbar({ userRole, isAuthenticated, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };
  
  const navLinkClass = ({ isActive }) => {
    return `relative before:absolute before:w-0 before:h-0.5 before:bg-black before:left-0 before:-bottom-1 hover:before:w-full before:transition-all before:duration-300 ${
      isActive ? "before:w-full font-semibold" : ""
    }`;
  };
  
  return (
    <>
      <nav className="container flex justify-between bg-blue-600 py-6 text-white shadow-md">
        <Link className="pl-5 text-2xl" to={"/"}>
          <i className="fa-solid fa-building-user"></i>{" "}
          <span className="font-bold font-serif">RentMate</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex justify-between gap-5 mr-10 text-xl">
          <li>
            <NavLink className={navLinkClass} to={"/"}>
              Home
            </NavLink>
          </li>
          
          <li>
            <NavLink className={navLinkClass} to={"/properties"}>
              Properties
            </NavLink>
          </li>
          
          {!isAuthenticated ? (
            <>
              <li>
                <NavLink className={navLinkClass} to={"/signup"}>
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink className={navLinkClass} to={"/login"}>
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {/* Tenant Links */}
              {userRole === "tenant" && (
                <>
                  <li>
                    <NavLink className={navLinkClass} to={"/tenant/dashboard"}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/saved-properties"}>
                      Saved
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/applications"}>
                      Applications
                    </NavLink>
                  </li>
                </>
              )}
              
              {/* Landlord Links */}
              {userRole === "landlord" && (
                <>
                  <li>
                    <NavLink className={navLinkClass} to={"/landlord/dashboard"}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/landlord/properties"}>
                      My Properties
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/landlord/applications"}>
                      Applications
                    </NavLink>
                  </li>
                </>
              )}
              
              {/* Admin Links */}
              {userRole === "admin" && (
                <>
                  <li>
                    <NavLink className={navLinkClass} to={"/admin/dashboard"}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/admin/landlords"}>
                      Landlords
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to={"/admin/properties"}>
                      Properties
                    </NavLink>
                  </li>
                </>
              )}
              
              {/* Messages - Common for tenant and landlord */}
              {(userRole === "tenant" || userRole === "landlord") && (
                <li>
                  <NavLink className={navLinkClass} to={"/messages"}>
                    Messages
                  </NavLink>
                </li>
              )}
              
              {/* Logout */}
              <li>
                <button 
                  onClick={handleLogout}
                  className="focus:outline-none"
                >
                  <i className="fa-solid fa-right-from-bracket cursor-pointer"></i>
                </button>
              </li>
            </>
          )}
        </ul>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center mr-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 text-white">
          <ul className="flex flex-col py-4 px-5 space-y-4 text-lg">
            <li>
              <NavLink 
                className={({ isActive }) => isActive ? "font-semibold" : ""}
                to={"/"}
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                className={({ isActive }) => isActive ? "font-semibold" : ""}
                to={"/properties"}
                onClick={() => setIsOpen(false)}
              >
                Properties
              </NavLink>
            </li>
            
            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink 
                    className={({ isActive }) => isActive ? "font-semibold" : ""}
                    to={"/signup"}
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className={({ isActive }) => isActive ? "font-semibold" : ""}
                    to={"/login"}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* Role-specific mobile links (same as desktop but formatted for mobile) */}
                {userRole === "tenant" && (
                  <>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/tenant/dashboard"}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/saved-properties"}
                        onClick={() => setIsOpen(false)}
                      >
                        Saved Properties
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/applications"}
                        onClick={() => setIsOpen(false)}
                      >
                        My Applications
                      </NavLink>
                    </li>
                  </>
                )}
                
                {userRole === "landlord" && (
                  <>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/landlord/dashboard"}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/landlord/properties"}
                        onClick={() => setIsOpen(false)}
                      >
                        My Properties
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/landlord/applications"}
                        onClick={() => setIsOpen(false)}
                      >
                        Applications
                      </NavLink>
                    </li>
                  </>
                )}
                
                {userRole === "admin" && (
                  <>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/admin/dashboard"}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/admin/landlords"}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center">
                          <FaUsers className="mr-2" />
                          Manage Landlords
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        className={({ isActive }) => isActive ? "font-semibold" : ""}
                        to={"/admin/properties"}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center">
                          <FaHome className="mr-2" />
                          Manage Properties
                        </div>
                      </NavLink>
                    </li>
                  </>
                )}
                
                {(userRole === "tenant" || userRole === "landlord") && (
                  <li>
                    <NavLink 
                      className={({ isActive }) => isActive ? "font-semibold" : ""}
                      to={"/messages"}
                      onClick={() => setIsOpen(false)}
                    >
                      Messages
                    </NavLink>
                  </li>
                )}
                
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center focus:outline-none"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
```

# src\Components\PropertyCard\PropertyCard.jsx

```jsx
// src/components/PropertyCard.jsx
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, isAuthenticated, isSaved, onSaveToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { id, title, price, location, images, status, bedrooms, bathrooms, area } = property;
  
  // Function to handle placeholder images if we're using dummies
  const getImageUrl = (url) => {
    // If using real images, return the URL
    // return url;
    
    // For dummy data, use placeholder
    return `https://picsum.photos/seed/apt${id}/600/400`;
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={getImageUrl(images[0])} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status badge */}
        <div className={`absolute top-2 right-2 py-1 px-2 rounded-full text-xs font-semibold ${
          status === 'available' || status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {status === 'available' ? 'Available' : status === 'pending'? 'Pending' : status === 'rented'? 'Rented' : status === 'approved' ? 'Available' : ''}
        </div>
        
        {/* Save button - only show if authenticated */}
        {isAuthenticated && (
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              onSaveToggle(id);
            }}
            className="absolute top-2 left-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-200"
          >
            {isSaved ? (
              <FaBookmark className="text-primary" />
            ) : (
              <FaRegBookmark className="text-gray-600" />
            )}
          </button>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${id}`}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors mb-2 truncate">
            {title}
          </h3>
        </Link>
        
        <p className="text-green-600 font-bold text-lg mb-2">${price}/month</p>
        
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1" />
          <span className="text-sm truncate">{location}</span>
        </div>
        
        <div className="flex justify-between text-gray-600 border-t pt-3">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span className="text-sm">{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span className="text-sm">{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span className="text-sm">{area} sq ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
```

# src\contexts\NotificationsContext.jsx

```jsx
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
```

# src\data\dummyData.js

```js
export const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    description: "A beautiful modern apartment in the heart of downtown with amazing views.",
    price: 1200,
    location: "New York, NY",
    landlordName: "John Smith",
    images: [
      "/images/property1-1.jpg",
      "/images/property1-2.jpg",
      "/images/property1-3.jpg"
    ],
    views: 245,
    status: "available", // available, rented, pending, approved, rejected
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    amenities: ["Parking", "Pool", "Gym", "Elevator"]
  },
  {
    id: 2,
    title: "Cozy Studio Near University",
    description: "Perfect for students! A cozy studio apartment walking distance from the university.",
    price: 800,
    location: "Boston, MA",
    landlordName: "Sarah Johnson",
    images: [
      "/images/property2-1.jpg",
      "/images/property2-2.jpg"
    ],
    views: 187,
    status: "available",
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    amenities: ["Internet", "Furnished", "Laundry"]
  },
  {
    id: 3,
    title: "Luxury Beach House",
    description: "Stunning beach house with direct access to the shore and panoramic ocean views.",
    price: 3500,
    location: "Miami, FL",
    landlordName: "Robert Williams",
    images: [
      "/images/property3-1.jpg",
      "/images/property3-2.jpg",
      "/images/property3-3.jpg"
    ],
    views: 356,
    status: "rented",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    amenities: ["Swimming Pool", "Beachfront", "Air Conditioning", "Balcony"]
  },
  {
    id: 4,
    title: "Mountain View Cabin",
    description: "Cozy cabin with stunning mountain views, perfect for a weekend getaway.",
    price: 1500,
    location: "Denver, CO",
    landlordName: "John Smith",
    images: [
      "/images/property4-1.jpg",
      "/images/property4-2.jpg"
    ],
    views: 128,
    status: "pending", // Admin needs to approve this listing
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    amenities: ["Fireplace", "Hiking Trails", "Pet Friendly"]
  },
  {
    id: 5,
    title: "Urban Loft with Rooftop",
    description: "Modern loft in the arts district with exclusive access to rooftop patio.",
    price: 1800,
    location: "Chicago, IL", 
    landlordName: "Emma Davis",
    images: [
      "/images/property5-1.jpg"
    ],
    views: 210,
    status: "pending", // Admin needs to approve this listing
    bedrooms: 1,
    bathrooms: 1,
    area: 780,
    amenities: ["Rooftop Patio", "Gym", "Doorman", "Pet Friendly"]
  },
  {
    id: 6,
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet suburban neighborhood with a large backyard.",
    price: 2200,
    location: "Austin, TX",
    landlordName: "Michael Brown",
    images: [
      "/images/property6-1.jpg"
    ],
    views: 175,
    status: "rejected", // Admin rejected this listing
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    amenities: ["Backyard", "Garage", "Washer/Dryer", "Pet Friendly"]
  }
];

export const users = {
  tenants: [
    {
      id: 1,
      name: "Alice Brown",
      email: "alice@example.com",
      savedProperties: [1, 3],
      applications: [
        { propertyId: 2, status: "pending", documents: ["id.pdf", "employment.pdf"] }
      ]
    },
    {
      id: 2,
      name: "David Miller", 
      email: "david@example.com",
      savedProperties: [2, 5],
      applications: [
        { propertyId: 1, status: "approved", documents: ["id.pdf", "employment.pdf", "credit-report.pdf"] }
      ]
    }
  ],
  landlords: [
    {
      id: 101,
      name: "John Smith",
      email: "john@example.com",
      properties: [1, 4],
      status: "approved" // approved, pending, rejected
    },
    {
      id: 102,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      properties: [2],
      status: "approved"
    },
    {
      id: 103,
      name: "Robert Williams",
      email: "robert@example.com",
      properties: [3],
      status: "approved"
    },
    {
      id: 104,
      name: "Emma Davis",
      email: "emma@example.com",
      properties: [5],
      status: "pending" // Pending admin approval
    },
    {
      id: 105,
      name: "Michael Brown",
      email: "michael@example.com",
      properties: [6],
      status: "rejected" // Rejected by admin
    }
  ],
  admins: [
    {
      id: 501,
      name: "Admin User",
      email: "admin@rentmate.com"
    }
  ]
};

export const messages = [
  {
    id: 1,
    conversationId: "tenant1-landlord101-property1",
    senderId: 1,
    receiverId: 101,
    propertyId: 1,
    content: "Hi, I'm interested in your apartment. Is it still available?",
    timestamp: "2023-04-15T14:32:00Z",
    read: true
  },
  {
    id: 2,
    conversationId: "tenant1-landlord101-property1",
    senderId: 101,
    receiverId: 1,
    propertyId: 1,
    content: "Yes, it's available! Would you like to schedule a viewing?",
    timestamp: "2023-04-15T15:05:22Z",
    read: true
  },
  {
    id: 3,
    conversationId: "tenant1-landlord101-property1",
    senderId: 1,
    receiverId: 101,
    propertyId: 1,
    content: "That would be great! How about this Friday at 3pm?",
    timestamp: "2023-04-15T15:30:45Z",
    read: true
  },
  {
    id: 4,
    conversationId: "tenant1-landlord101-property1",
    senderId: 101,
    receiverId: 1,
    propertyId: 1,
    content: "Friday at 3pm works for me. I'll see you then at the property.",
    timestamp: "2023-04-15T16:02:11Z",
    read: false
  },
  {
    id: 5,
    conversationId: "tenant1-landlord103-property3",
    senderId: 1,
    receiverId: 103,
    propertyId: 3,
    content: "Hello, I noticed your beach house listing. Is it still available for July?",
    timestamp: "2023-04-16T10:15:30Z",
    read: true
  },
  {
    id: 6,
    conversationId: "tenant1-landlord103-property3",
    senderId: 103,
    receiverId: 1,
    propertyId: 3,
    content: "Hi Alice, I'm afraid it's already been rented for the summer. I'll let you know if that changes.",
    timestamp: "2023-04-16T11:20:15Z",
    read: false
  }
];

// Group conversations by unique conversationId
export const conversations = messages.reduce((acc, message) => {
  const { conversationId } = message;
  if (!acc[conversationId]) {
    acc[conversationId] = [];
  }
  acc[conversationId].push(message);
  return acc;
}, {});
```

# src\index.css

```css
@import "tailwindcss";

body {
    font-family: 'Roboto Variable', sans-serif;
  }




```

# src\main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import '@fontsource-variable/roboto';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

# src\Pages\admin\AdminDashboard.jsx

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaClipboardList, FaHistory } from 'react-icons/fa';

// Import components
import NotificationsPanel from '../../components/Admin/NotificationsPanel';
import StatsOverview from '../../components/Admin/StatsOverview';
import ApprovalsPanel from '../../components/Admin/ApprovalsPanel';
import ActivityLog from '../../components/Admin/ActivityLog';

// Import services
import dataService from '../../services/dataService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, activity
  
  useEffect(() => {
    // Initialize data
    const initializeData = async () => {
      // Load data
      dataService.getLandlords();
      dataService.getProperties();
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    
    initializeData();
  }, []);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'approvals':
        return <ApprovalsPanel />;
      case 'activity':
        return <ActivityLog limit={10} showViewAll={false} />;
      case 'overview':
      default:
        return (
          <>
            <StatsOverview />
            <div className="mt-8">
              <ApprovalsPanel />
            </div>
            <div className="mt-8">
              <ActivityLog limit={5} showViewAll={true} />
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage landlords, properties, and review platform metrics
          </p>
        </div>
        <NotificationsPanel />
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaChartLine className="mr-2" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'approvals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaClipboardList className="mr-2" />
            Pending Approvals
            {dataService.getPendingLandlordsCount() + dataService.getPendingPropertiesCount() > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {dataService.getPendingLandlordsCount() + dataService.getPendingPropertiesCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-1 py-4 font-medium text-sm flex items-center ${
              activeTab === 'activity'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaHistory className="mr-2" />
            Activity Log
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default AdminDashboard;
```

# src\Pages\admin\ManageAllPropertiesPage.jsx

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaSearch, FaFilter, FaSort, FaCheck, FaTimes, FaEye,
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaBath, FaUserTie
} from 'react-icons/fa';

// Import services and hooks
import dataService from '../../services/dataService';
import { useNotifications } from '../../contexts/NotificationsContext';

const ManageAllPropertiesPage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, rejected, available, rented
    sortBy: 'newest', // newest, oldest, price-low, price-high
    priceRange: 'all' // all, low, medium, high
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get notifications context
  const { addNotification } = useNotifications();

  // Fetch properties on component mount
  useEffect(() => {
    loadProperties();

    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_properties') {
        loadProperties();
      }
    };

    window.addEventListener('dataUpdated', handleDataUpdated);

    // Clean up event listener
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);

  // Load properties from data service
  const loadProperties = () => {
    const propertiesData = dataService.getProperties();

    // Enhance properties with landlord info
    const propertiesWithLandlords = propertiesData.map(property => {
      const landlords = dataService.getLandlords();

      // Find the landlord for this property
      const landlord = landlords.find(l =>
        property.landlordName === l.name ||
        (l.properties && l.properties.includes(property.id))
      );

      // Return enhanced property object
      return {
        ...property,
        landlord
      };
    });

    setAllProperties(propertiesWithLandlords);

    // Apply filters to the loaded data
    applyFilters(propertiesWithLandlords, searchTerm, filters);

    setLoading(false);
  };

  // Apply filters and search
  const applyFilters = (propertyList, term, filterOptions) => {
    let results = [...propertyList];

    // Apply search term
    if (term) {
      const searchText = term.toLowerCase();
      results = results.filter(
        property =>
          property.title.toLowerCase().includes(searchText) ||
          property.location.toLowerCase().includes(searchText) ||
          (property.landlord && property.landlord.name.toLowerCase().includes(searchText))
      );
    }

    // Apply status filter
    if (filterOptions.status !== 'all') {
      results = results.filter(property => property.status === filterOptions.status);
    }

    // Apply price range filter
    if (filterOptions.priceRange !== 'all') {
      if (filterOptions.priceRange === 'low') {
        results = results.filter(property => property.price < 1000);
      } else if (filterOptions.priceRange === 'medium') {
        results = results.filter(property => property.price >= 1000 && property.price < 2000);
      } else if (filterOptions.priceRange === 'high') {
        results = results.filter(property => property.price >= 2000);
      }
    }

    // Apply sorting
    if (filterOptions.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0));
    } else if (filterOptions.sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0));
    } else if (filterOptions.sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filterOptions.sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(results);
  };

  // Effect to reapply filters when search or filters change
  useEffect(() => {
    if (!loading) {
      applyFilters(allProperties, searchTerm, filters);
    }
  }, [searchTerm, filters]);

  // Handle property status change
  const handleStatusChange = (propertyId, newStatus) => {
    const property = allProperties.find(p => p.id === propertyId);

    if (property) {
      // Update property status
      const success = dataService.updateProperty(propertyId, {
        status: newStatus
      });

      if (success) {
        // Add a notification
        addNotification({
          title: `Property ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `"${property.title}" was ${newStatus === 'approved' ? 'approved' : 'rejected'}`,
          type: newStatus === 'approved' ? 'success' : 'warning',
          timestamp: new Date().toISOString()
        });

        // Reload properties
        loadProperties();
      }
    }

    // Close modal if open
    if (showDetailsModal) {
      setShowDetailsModal(false);
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
      case 'available':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> {status === 'approved' ? 'Approved' : 'Available'}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      case 'rented':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center">
            <FaCheck className="mr-1" /> Rented
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

  // View property details
  const viewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Manage Properties</h1>
        <p className="text-gray-600 mt-1">
          Review and approve property listings
        </p>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto relative">
            <input
              type="text"
              placeholder="Search properties..."
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
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Price Range filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="all">All Prices</option>
                <option value="low">Low (&lt; $1000)</option>
                <option value="medium">Medium ($1000-$2000)</option>
                <option value="high">High (&gt; $2000)</option>
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
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

      {/* No properties */}
      {!loading && filteredProperties.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
            <FaHome className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No properties found</h2>
          <p className="text-gray-600 mb-6">No properties match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ status: 'all', sortBy: 'newest', priceRange: 'all' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Properties grid */}
      {!loading && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={`https://source.unsplash.com/random/600x400/?apartment&${property.id}`}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(property.status)}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <p className="text-green-600 font-bold mb-3">${property.price}/month</p>

                <div className="flex justify-between text-gray-600 border-t pt-3 mb-3">
                  <div className="flex items-center">
                    <FaBed className="mr-1" />
                    <span className="text-sm">{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" />
                    <span className="text-sm">{property.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm">{property.area} sq ft</span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserTie className="text-gray-600 text-sm" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-800">
                      {property.landlord ? property.landlord.name : property.landlordName || "Unknown Landlord"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted on {formatDate(property.submissionDate || new Date().toISOString())}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => viewPropertyDetails(property)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center justify-center"
                  >
                    <FaEye className="mr-1" /> View Details
                  </button>

                  {property.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(property.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(property.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Detail Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full relative z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`https://source.unsplash.com/random/600x400/?apartment&${selectedProperty.id}`}
                    alt={selectedProperty.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="mb-2">
                    {getStatusBadge(selectedProperty.status)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{selectedProperty.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <p className="text-green-600 font-bold text-xl mb-4">${selectedProperty.price}/month</p>

                  <div className="flex space-x-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">{selectedProperty.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">{selectedProperty.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{selectedProperty.area} sq ft</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Landlord</p>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <FaUserTie className="text-gray-600 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedProperty.landlord ? selectedProperty.landlord.name : selectedProperty.landlordName || "Unknown Landlord"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Posted on {formatDate(selectedProperty.submissionDate || new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Property Views</p>
                    <p className="font-medium">{selectedProperty.views || 0} views</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{selectedProperty.description}</p>
              </div>

              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-end space-x-3">
                {selectedProperty.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedProperty.id, 'rejected')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Reject Listing
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProperty.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Listing
                    </button>
                  </>
                )}

                {selectedProperty.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedProperty.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove Listing
                  </button>
                )}

                {selectedProperty.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedProperty.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Listing
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
        </div>
      )}
    </div>
  );
};

export default ManageAllPropertiesPage;
```

# src\Pages\admin\ManageLandlordsPage.jsx

```jsx
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
```

# src\Pages\AdminPanel\AdminPanel.jsx

```jsx

```

# src\Pages\ApplicationForm\ApplicationForm.jsx

```jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaCheck, FaExclamationTriangle } from "react-icons/fa";

// Import dummy data
import { properties, users } from "../../data/dummyData";

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
      // Find property in dummy data
      const propertyData = properties.find(p => p.id === Number(id));

      if (propertyData) {
        setProperty(propertyData);
        
        // Pre-fill form with user data if available
        const userId = localStorage.getItem("userId");
        const tenant = users.tenants.find(t => t.id === Number(userId));
        
        if (tenant) {
          setFormData(prevData => ({
            ...prevData,
            fullName: tenant.name || "",
            email: tenant.email || ""
          }));
        }
      } else {
        // Property not found, redirect to properties page
        navigate("/properties");
      }

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(() => {
      fetchPropertyData();
    }, 500);
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
    
    // In a real app, this would submit the application to the backend
    // For this demo, we'll simulate a successful submission
    
    // Get current user ID
    const userId = localStorage.getItem("userId");
    const tenant = users.tenants.find(t => t.id === Number(userId)) || users.tenants[0];
    
    // Create application object
    const newApplication = {
      propertyId: Number(id),
      status: "pending",
      documents: uploadedDocuments.map(doc => doc.name),
      applicationDate: new Date().toISOString(),
      id: `${id}-${tenant.id}-${Date.now()}`,
      applicantInfo: {
        ...formData,
        applicantId: tenant.id
      }
    };
    
    // In a real app, this would be sent to the backend
    console.log("Application submitted:", newApplication);
    
    // Show success message
    setFormSubmitted(true);
    setFormError("");
    
    // Redirect to applications page after a delay
    setTimeout(() => {
      navigate("/applications");
    }, 3000);
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
            src={`https://source.unsplash.com/random/300x200/?apartment&${property.id}`}
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
```

# src\Pages\Home\Home.jsx

```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHome, FaKey, FaUserCheck, FaMoneyBillWave, FaShieldAlt, FaArrowRight } from "react-icons/fa";

// This would come from your data file in a real application
import { properties } from "../../data/dummyData";

export default function HomePage({ isAuthenticated }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get featured properties (first 3)
  const featuredProperties = properties.slice(0, 3);
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${searchTerm}`);
  };
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-20" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://source.unsplash.com/random/1600x900/?luxury-apartment')",
          minHeight: "600px"
        }}
      >
        <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Home with RentMate</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl">Connecting tenants and landlords for a seamless renting experience.</p>
          
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl bg-white p-3 rounded-lg shadow-md flex"
          >
            <input 
              type="text"
              placeholder="Search by location, property type, or keyword..."
              className="flex-grow px-4 py-2 focus:outline-none text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </form>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">1,000+</p>
              <p>Available Properties</p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">500+</p>
              <p>Happy Tenants</p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-3xl font-bold">300+</p>
              <p>Verified Landlords</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 flex items-center">
            View All <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                {/* Using placeholder images */}
                <img 
                  src={`https://picsum.photos/seed/apt${property.id}/600/400`} 
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-sm font-semibold ${
                  property.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {property.status === 'available' ? 'Available' : 'Rented'}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                <p className="text-green-600 font-bold text-lg mb-2">${property.price}/month</p>
                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                
                <div className="flex justify-between text-gray-600">
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                  <span>{property.area} sq ft</span>
                </div>
                
                <Link 
                  to={`/properties/${property.id}`}
                  className="block mt-4 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How RentMate Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Tenants */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Search Properties</h3>
              <p className="text-gray-600">Browse thousands of verified properties with detailed information and photos.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaKey className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Book Viewings</h3>
              <p className="text-gray-600">Schedule property visits and communicate directly with landlords.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHome className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Your Home</h3>
              <p className="text-gray-600">Apply for properties, sign digital contracts, and move into your new home.</p>
            </div>
          </div>
          
          {/* CTA Button */}
          {!isAuthenticated && (
            <div className="text-center mt-12">
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 inline-block font-medium"
              >
                Get Started Today
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* For Tenants */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">For Tenants</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaSearch className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Extensive Search Options</h3>
                  <p className="text-gray-600">Filter properties by location, price, amenities, and more to find your perfect match.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaUserCheck className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verified Landlords</h3>
                  <p className="text-gray-600">All landlords on our platform are verified for your safety and peace of mind.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Applications</h3>
                  <p className="text-gray-600">Apply for properties through our secure platform with document protection.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* For Landlords */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">For Landlords</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaHome className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Showcase Your Properties</h3>
                  <p className="text-gray-600">Create detailed listings with photos, videos, and virtual tours to attract qualified tenants.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaMoneyBillWave className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Set Your Terms</h3>
                  <p className="text-gray-600">Define rent, deposit, lease terms, and requirements for potential tenants.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Tenant Screening</h3>
                  <p className="text-gray-600">Review applications and screen tenants with our comprehensive verification system.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-blue-600 text-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"RentMate made finding my new apartment so easy! I could filter exactly what I wanted and communicate directly with the landlord."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  S
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm opacity-80">Tenant</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"As a landlord, I've been able to find reliable tenants quickly. The platform handles all the screening and paperwork for me."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  M
                </div>
                <div>
                  <p className="font-medium">Michael Brown</p>
                  <p className="text-sm opacity-80">Landlord</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4 italic">"The virtual tours feature saved me so much time. I was able to narrow down my options before scheduling in-person visits."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  R
                </div>
                <div>
                  <p className="font-medium">Rachel Chen</p>
                  <p className="text-sm opacity-80">Tenant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Find Your Perfect Match?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're looking for a new home or want to list your property, RentMate makes the process simple and secure.
        </p>
        {!isAuthenticated ? (
        
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md hover:bg-blue-50 font-medium"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link 
            to="/properties" 
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium inline-block"
          >
            Browse Properties
          </Link>
        )}
      </section>
    </div>
  );
}
```

# src\Pages\LandlordDashboard\LandlordDashboard.jsx

```jsx

```

# src\Pages\Landord\LandlordDashboard\LandlordDashboard.jsx

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUser, FaPlus, FaEllipsisH, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { properties, users } from '../../../data/dummyData';

const LandlordDashboard = () => {
  // Get landlord data - in a real app, this would come from context/redux
  const landlord = users.landlords[0];
  
  // Filter properties for this landlord
  const landlordProperties = properties.filter(p => 
    landlord.properties.includes(p.id)
  );
  
  // Track which property's dropdown is open
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Landlord Dashboard</h1>
      
      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-primary">
              <FaHome className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-800">{landlordProperties.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaClipboardList className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Applications</p>
              <p className="text-2xl font-semibold text-gray-800">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaUser className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Tenants</p>
              <p className="text-2xl font-semibold text-gray-800">1</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800">My Properties</h2>
          <Link 
            to="/landlord/properties/new"
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Property
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {landlordProperties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://source.unsplash.com/random/100x100/?apartment&${property.id}`} 
                          alt="" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {property.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${property.price}/month</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status === 'available' ? 'Available' : 'Rented'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === property.id ? null : property.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <FaEllipsisH />
                      </button>
                      
                      {activeDropdown === property.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <Link 
                              to={`/landlord/properties/${property.id}/edit`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaRegEdit className="mr-2" />
                              Edit Property
                            </Link>
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                // Handle delete logic
                                console.log(`Delete property ${property.id}`);
                                setActiveDropdown(null);
                              }}
                            >
                              <FaRegTrashAlt className="mr-2" />
                              Delete Property
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {landlordProperties.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    You haven't listed any properties yet. 
                    <Link to="/landlord/properties/new" className="text-primary hover:underline ml-1">
                      Add your first property.
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent activity section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New rental application received</p>
                <p className="text-sm text-gray-500">Alice Brown has applied for "Modern Downtown Apartment"</p>
                <p className="mt-1 text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaHome className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Property post approved</p>
                <p className="text-sm text-gray-500">Your listing "Cozy Studio Near University" was approved by the admin</p>
                <p className="mt-1 text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
```

# src\Pages\Login\Login.jsx

```jsx
// import axios from "axios";
// import { useFormik } from "formik";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { object, string } from "yup";

// export default function Login() {
//     const [incorrectEmail, setIncorrectEmail] = useState(null);
//     const navigate = useNavigate();

//     const passwordRegex =
//         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

//     const validationSchema = object({
//         email: string()
//             .required("Email Is Required")
//             .email("Please Enter A Valid Email"),
//         password: string()
//             .required("Password Is required")
//             .matches(
//                 passwordRegex,
//                 "Minimum 8 characters, one uppercase, one lowercase, one number, one special character"
//             ),
//     });

//     async function sendLoginData(values) {
//         const loadingToastId = toast.loading("Please Wait...");
//         try {
//             const options = {
//                 url: "https://ecommerce.routemisr.com/api/v1/auth/signin",
//                 method: "POST",
//                 data: values,
//             };

//             let { data } = await axios.request(options);

//             if (data.message === "success") {
//                 localStorage.setItem("token", data.token);
//                 toast.success("Welcome Back");

//                 // ⬇️ Decode the token to extract the role
//                 const payload = JSON.parse(atob(data.token.split(".")[1]));
//                 const userRole = payload.role;

//                 // Navigate based on role
//                 if (userRole === "admin") {
//                     navigate("/adminDashboard");
//                 } else if (userRole === "landlord") {
//                     navigate("/landlordDashboard");
//                 } else if (userRole === "tenant") {
//                     navigate("/tenantDashboard");
//                 } else {
//                     navigate("/");
//                 }
//             }
//         } catch (error) {
//             toast.error(error.response.data.message);
//             setIncorrectEmail(error.response.data.message);
//         } finally {
//             toast.dismiss(loadingToastId);
//         }
//     }

//     const formik = useFormik({
//         initialValues: {
//             email: "",
//             password: "",
//         },
//         validationSchema,
//         onSubmit: sendLoginData,
//     });

//     return (
//         <>
//             <h1 className="text-xl text-slate-700 font-semibold pt-5 ml-96">
//                 <i className="fa-solid fa-circle-user me-2"></i> Login :
//             </h1>
//             <form className="pt-4 space-y-3 ml-96" onSubmit={formik.handleSubmit}>
//                 {/* Email */}
//                 <div>
//                     <input
//                         className="px-2 py-1 rounded-md border-2 w-[50%]"
//                         type="email"
//                         placeholder="Enter Your Email"
//                         {...formik.getFieldProps("email")}
//                     />
//                     {formik.touched.email && formik.errors.email && (
//                         <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
//                     )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                     <input
//                         className="px-2 py-1 rounded-md border-2 w-[50%]"
//                         type="password"
//                         placeholder="Enter Your Password"
//                         {...formik.getFieldProps("password")}
//                     />
//                     {formik.touched.password && formik.errors.password && (
//                         <p className="text-red-600 text-sm mt-1">
//                             *{formik.errors.password}
//                         </p>
//                     )}
//                     {incorrectEmail && (
//                         <p className="text-red-600 text-sm mt-1">*{incorrectEmail}</p>
//                     )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                     className="px-3 py-1 mb-5 rounded-md bg-blue-600 text-white w-[50%]"
//                     type="submit"
//                 >
//                     Login
//                 </button>
//             </form>
//         </>
//     );
// }


import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { object, string } from "yup";

export default function Login({ onLogin }) {
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // For demo purposes, we're using a simpler password validation for login
    const validationSchema = object({
        email: string()
            .required("Email is required")
            .email("Please enter a valid email"),
        password: string()
            .required("Password is required"),
    });

    async function handleLogin(values) {
        const loadingToastId = toast.loading("Logging in...");
        try {
            // For demo purpose, we'll use these hardcoded demo credentials
            // In production, replace with actual validation against stored users
            const demoCredentials = [
                { email: "admin@rentmate.com", password: "Admin123!", role: "admin", id: 501, name: "Admin User" },
                { email: "john@example.com", password: "Landlord123!", role: "landlord", id: 101, name: "John Smith" },
                { email: "alice@example.com", password: "Tenant123!", role: "tenant", id: 1, name: "Alice Brown" }
            ];
            
            // Check if credentials match any demo user
            const user = demoCredentials.find(
                user => user.email === values.email && user.password === values.password
            );
            
            if (user) {
                // Store user data in localStorage (in a real app, use JWT or other secure method)
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userRole", user.role);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userName", user.name);
                
                // If tenant, set saved properties
                if (user.role === "tenant") {
                    localStorage.setItem("savedProperties", JSON.stringify([1, 3]));
                }
                
                toast.success(`Welcome back, ${user.name}!`);
                
                const redirectPath = location.state?.from;

                onLogin(user.role);
                

                // Navigate based on redirect path or role
                if (redirectPath) {
                    navigate(redirectPath);
                } else if (user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (user.role === "landlord") {
                    navigate("/landlord/dashboard");
                } else if (user.role === "tenant") {
                    navigate("/tenant/dashboard");
                }
            } else {
                // Check if registered in localStorage (for newly registered users)
                const registeredUsers = JSON.parse(localStorage.getItem("rentmateUsers")) || { 
                    tenants: [], 
                    landlords: [], 
                    admins: [] 
                };
                
                // Find user in any category
                const allUsers = [
                    ...registeredUsers.tenants,
                    ...registeredUsers.landlords,
                    ...registeredUsers.admins
                ];
                
                const registeredUser = allUsers.find(
                    user => user.email === values.email && user.password === values.password
                );
                
                if (registeredUser) {
                    // Check if landlord is approved
                    if (registeredUser.role === "landlord" && registeredUser.status === "pending") {
                        setLoginError("Your landlord account is pending approval");
                        toast.error("Your account is pending admin approval");
                        return;
                    }
                    
                    // Handle successful login for registered user
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("userRole", registeredUser.role);
                    localStorage.setItem("userId", registeredUser.id);
                    localStorage.setItem("userName", registeredUser.name);
                    
                    toast.success(`Welcome back, ${registeredUser.name}!`);
                    
                    // Call the onLogin prop to update app state
                    onLogin(registeredUser.role);
                    
                    // Check if there's a redirect path in location state
                    const redirectPath = location.state?.from;
                    
                    // Navigate based on redirect path or role
                    if (redirectPath) {
                        navigate(redirectPath);
                    } else if (registeredUser.role === "admin") {
                        navigate("/admin/dashboard");
                    } else if (registeredUser.role === "landlord") {
                        navigate("/landlord/dashboard");
                    } else if (registeredUser.role === "tenant") {
                        navigate("/tenant/dashboard");
                    }
                } else {
                    setLoginError("Invalid email or password");
                    toast.error("Invalid email or password");
                }
            }
        } catch (error) {
            toast.error("Login failed");
            console.error(error);
            setLoginError("Login failed. Please try again.");
        } finally {
            toast.dismiss(loadingToastId);
        }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: handleLogin,
    });

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h1 className="text-2xl text-gray-800 font-semibold mb-6">
                <i className="fa-solid fa-right-to-bracket mr-2"></i> Login to RentMate
            </h1>
            
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        id="email"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        type="email"
                        placeholder="Enter your email"
                        {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        id="password"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        type="password"
                        placeholder="Enter your password"
                        {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            *{formik.errors.password}
                        </p>
                    )}
                    {loginError && (
                        <p className="text-red-600 text-sm mt-1">*{loginError}</p>
                    )}
                </div>

                {/* Demo Credentials */}
                <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
                    <p><strong>Admin:</strong> admin@rentmate.com / Admin123!</p>
                    <p><strong>Landlord:</strong> john@example.com / Landlord123!</p>
                    <p><strong>Tenant:</strong> alice@example.com / Tenant123!</p>
                </div>

                {/* Submit */}
                <button
                    className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
    );
}
```

# src\Pages\Messeges\Messages.jsx

```jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaRegUser, FaHome, FaPaperPlane, FaRegClock } from "react-icons/fa";

// Import dummy data
import { properties, users, messages as allMessages } from "../../data/dummyData";

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  
  // Fetch user data from localStorage
  const userId = Number(localStorage.getItem("userId")) || 1; // Default to first tenant if not found
  const userRole = localStorage.getItem("userRole") || "tenant";
  
  // Fetch conversations and messages
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call

      // First, organize messages into conversations
      // Group by a unique conversation ID that combines sender and receiver
      const tenantMessages = allMessages.filter(
        msg => msg.senderId === userId || msg.receiverId === userId
      );
      
      // Create a map of conversation IDs to conversation data
      const conversationMap = new Map();
      
      tenantMessages.forEach(msg => {
        // Determine the other party in the conversation
        const otherPartyId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const conversationId = `conversation-${Math.min(userId, otherPartyId)}-${Math.max(userId, otherPartyId)}-${msg.propertyId}`;
        
        // Find property and other party info
        const property = properties.find(p => p.id === msg.propertyId);
        
        // Find other party (landlord or tenant)
        let otherParty;
        if (userRole === "tenant") {
          otherParty = users.landlords.find(l => l.id === otherPartyId);
        } else {
          otherParty = users.tenants.find(t => t.id === otherPartyId);
        }
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            otherParty,
            property,
            messages: [],
            latestMessage: null,
            unreadCount: 0
          });
        }
        
        // Add message to conversation
        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(msg);
        
        // Update latest message
        if (!conversation.latestMessage || new Date(msg.timestamp) > new Date(conversation.latestMessage.timestamp)) {
          conversation.latestMessage = msg;
        }
        
        // Count unread messages
        if (msg.receiverId === userId && !msg.read) {
          conversation.unreadCount++;
        }
      });
      
      // Convert map to array and sort by latest message timestamp
      const sortedConversations = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.latestMessage?.timestamp || 0) - new Date(a.latestMessage?.timestamp || 0));
      
      setConversations(sortedConversations);
      
      // If there are conversations, set the active one
      if (sortedConversations.length > 0) {
        setActiveConversation(sortedConversations[0]);
        setMessages(sortedConversations[0].messages);
      }
      
      setLoading(false);
    };
    
    // Simulate API delay
    setTimeout(() => {
      fetchData();
    }, 500);
  }, [userId, userRole]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle conversation click
  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
    
    // Mark messages as read in this conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({
            ...msg,
            read: msg.receiverId === userId ? true : msg.read
          }))
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };
  
  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    // Create a new message object
    const newMessageObj = {
      id: Date.now(),
      conversationId: activeConversation.id,
      senderId: userId,
      receiverId: activeConversation.otherParty.id,
      propertyId: activeConversation.property.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Update messages state
    const updatedMessages = [...messages, newMessageObj];
    setMessages(updatedMessages);
    
    // Update conversations state
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: updatedMessages,
          latestMessage: newMessageObj
        };
      }
      return conv;
    });
    
    // Sort conversations by latest message
    const sortedConversations = [...updatedConversations].sort(
      (a, b) => new Date(b.latestMessage?.timestamp || 0) - new Date(a.latestMessage?.timestamp || 0)
    );
    
    setConversations(sortedConversations);
    setNewMessage("");
    
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(conv => {
    const propertyTitle = conv.property?.title?.toLowerCase() || "";
    const otherPartyName = conv.otherParty?.name?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    
    return propertyTitle.includes(term) || otherPartyName.includes(term);
  });
  
  // Format date and time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/tenant/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communicate with property owners about your rentals
          </p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* No messages */}
        {!loading && conversations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaPaperPlane className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6">
              You don't have any messages yet. Browse properties and contact landlords to start a conversation.
            </p>
            <Link 
              to="/properties" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
            >
              Browse Properties
            </Link>
          </div>
        )}
        
        {/* Messaging interface */}
        {!loading && conversations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Conversations sidebar */}
              <div className="w-full md:w-80 md:border-r border-gray-200 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                
                {/* Conversations list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No conversations match your search
                    </div>
                  ) : (
                    filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors flex ${
                          activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleConversationClick(conversation)}
                      >
                        {/* Profile icon or image */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <FaRegUser className="text-gray-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-800 truncate">
                              {conversation.otherParty.name}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                              {formatMessageTime(conversation.latestMessage?.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.property.title}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.latestMessage?.senderId === userId ? 'You: ' : ''}
                              {conversation.latestMessage?.content}
                            </p>
                            
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Message area */}
              <div className="w-full flex-1 flex flex-col">
                {activeConversation ? (
                  <>
                    {/* Conversation header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <FaRegUser className="text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {activeConversation.otherParty.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaHome className="mr-1" />
                            <span>{activeConversation.property.title}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/properties/${activeConversation.property.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Property
                      </Link>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.senderId === userId
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-white border border-gray-200 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <div
                                className={`text-xs mt-1 flex justify-end ${
                                  msg.senderId === userId ? 'text-blue-200' : 'text-gray-500'
                                }`}
                              >
                                <span>{formatMessageTime(msg.timestamp)}</span>
                                {msg.senderId === userId && (
                                  <span className="ml-2">
                                    {msg.read ? 'Read' : 'Sent'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    
                    {/* Message input */}
                    <div className="p-4 border-t bg-white">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                          disabled={!newMessage.trim()}
                        >
                          <FaPaperPlane />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 text-center">
                    <div>
                      <div className="bg-gray-200 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                        <FaRegClock className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                      <p className="text-gray-600">
                        Choose a conversation from the list to view messages
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

# src\Pages\Properties\Properties.jsx

```jsx

```

# src\Pages\PropertyDetails\PropertyDetails.jsx

```jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaRegBookmark, FaBookmark,
  FaCheck, FaWifi, FaFan, FaParking, FaShower, FaUtensils, FaTv, FaSnowflake,
  FaWater, FaSwimmingPool, FaRegUser, FaRegStar, FaStar, FaRegHeart, FaRegClock,
  FaArrowRight, FaArrowLeft as FaArrowBack, FaChevronLeft, FaChevronRight, FaPaperPlane,
  FaExclamationTriangle
} from "react-icons/fa";

// Import services
import dataService from "../../services/dataService";

export default function PropertyDetailPage({ isAuthenticated, userRole, savedPropertyIds = [], onSaveToggle }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [contactMessage, setContactMessage] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [propertyNotAvailable, setPropertyNotAvailable] = useState(false);
  const [notAvailableReason, setNotAvailableReason] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if property is saved
      setIsSaved(savedPropertyIds.includes(Number(id)));
    }
  }, [id, isAuthenticated, savedPropertyIds]);

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = () => {
      // Find property
      const propertyData = dataService.getPropertyById(Number(id));

      if (propertyData) {
        // Check if property is accessible based on status and user role
        let canAccess = true;
        let reasonMessage = "";
        
        if (propertyData.status === 'rejected') {
          if (userRole === 'admin') {
            // Admin can see rejected properties
            reasonMessage = "This property has been rejected and is not visible to tenants.";
          } else {
            // Other users cannot see rejected properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        } else if (propertyData.status === 'unavailable') {
          if (userRole === 'admin') {
            // Admin can see unavailable properties
            reasonMessage = "This property is currently unavailable because the landlord account has been disabled.";
          } else {
            // Other users cannot see unavailable properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        } else if (propertyData.status === 'pending') {
          if (userRole === 'admin' || 
             (userRole === 'landlord' && getIsLandlordOwner(propertyData))) {
            // Admin and owner landlord can see pending properties
            reasonMessage = "This property is pending approval and is not visible to tenants.";
          } else {
            // Other users cannot see pending properties
            canAccess = false;
            reasonMessage = "This property is not available for viewing.";
          }
        }
        
        if (!canAccess && userRole !== 'admin') {
          setPropertyNotAvailable(true);
          setNotAvailableReason(reasonMessage);
          setLoading(false);
          return;
        }
        
        setProperty(propertyData);
        
        // If accessible but with a warning message
        if (reasonMessage && (userRole === 'admin' || 
           (userRole === 'landlord' && getIsLandlordOwner(propertyData)))) {
          setNotAvailableReason(reasonMessage);
        }

        // Find landlord data
        const landlords = dataService.getLandlords();
        const landlordData = landlords.find(l => 
          l.name === propertyData.landlordName || 
          (l.properties && l.properties.includes(propertyData.id))
        );
        setLandlord(landlordData);

        // Find similar properties (same location or similar price)
        const allProperties = dataService.getAvailableProperties();
        const similar = allProperties.filter(p =>
          p.id !== propertyData.id &&
          (p.location.includes(propertyData.location.split(',')[0]) ||
            Math.abs(p.price - propertyData.price) < 300)
        ).slice(0, 3);

        setSimilarProperties(similar);
      } else {
        // Property not found
        setPropertyNotAvailable(true);
        setNotAvailableReason("The property you're looking for doesn't exist or has been removed.");
      }

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(() => {
      fetchPropertyData();
    }, 500);
  }, [id, navigate, userRole]);

  // Check if current user is the landlord that owns this property
  const getIsLandlordOwner = (propertyData) => {
    if (!propertyData || userRole !== 'landlord') return false;
    
    const userId = Number(localStorage.getItem('userId'));
    const landlords = dataService.getLandlords();
    const landlord = landlords.find(l => l.id === userId);
    
    return landlord && 
           landlord.properties && 
           landlord.properties.includes(propertyData.id);
  };

  // Handle saving/unsaving property
  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/properties/${id}` } });
      return;
    }

    // Call the parent handler
    onSaveToggle(id);
    setIsSaved(!isSaved);
  };

  // Handle apply for rental
  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/apply/${id}` } });
      return;
    }

    navigate(`/apply/${id}`);
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!contactMessage.trim()) return;

    // In a real app, this would send the message to the backend
    alert(`Message sent to landlord: ${contactMessage}`);
    setContactMessage("");
    setShowContactForm(false);
  };

  // Next image in gallery
  const nextImage = () => {
    if (!property || !property.images) return;
    setActiveImageIndex((activeImageIndex + 1) % property.images.length);
  };

  // Previous image in gallery
  const prevImage = () => {
    if (!property || !property.images) return;
    setActiveImageIndex(activeImageIndex === 0 ? property.images.length - 1 : activeImageIndex - 1);
  };

  // Get image URL (using placeholders for demo)
  const getImageUrl = (index) => {
    return `https://source.unsplash.com/random/600x400/?apartment,interior&sig=${property.id}-${index}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (propertyNotAvailable) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md inline-block">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Available</h2>
          <p className="text-gray-600 mb-6">{notAvailableReason}</p>
          <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-md shadow-sm">
            <FaArrowLeft className="mr-2" /> Browse Available Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>

        {/* Status Warning (if any) */}
        {notAvailableReason && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {notAvailableReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Property Status Badge */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            property.status === 'available' || property.status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : property.status === 'rejected' 
                ? 'bg-red-100 text-red-800'
                : property.status === 'rented'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status === 'available' || property.status === 'approved' 
              ? 'Available' 
              : property.status === 'rejected'
                ? 'Rejected'
                : property.status === 'rented'
                  ? 'Rented'
                  : property.status === 'pending'
                    ? 'Pending Approval'
                    : 'Unavailable'}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-6">
          <FaMapMarkerAlt className="mr-2" />
          <span>{property.location}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Images and Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={getImageUrl(activeImageIndex)}
                  alt={`${property.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />

                {/* Image navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronLeft className="text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronRight className="text-gray-800" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {property.images?.length || 5}
                </div>

                {/* Save button */}
                {(property.status === 'available' || property.status === 'approved') && (
                  <button
                    onClick={handleSaveToggle}
                    className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                  >
                    {isSaved ? (
                      <FaBookmark className="text-blue-600" />
                    ) : (
                      <FaRegBookmark className="text-gray-800" />
                    )}
                  </button>
                )}
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-5 gap-2 p-4">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={getImageUrl(index)}
                      alt={`${property.title} - Thumbnail ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Price and basic info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-600 mb-2">${property.price}/month</h2>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <FaBed className="text-gray-500 mr-2" />
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="text-gray-500 mr-2" />
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="text-gray-500 mr-2" />
                    <span>{property.area} sq ft</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 mb-6">{property.description}</p>

              {/* Property details table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Property Details</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">Apartment</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">2018</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Parking</span>
                      <span className="font-medium">1 Spot</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Heating</span>
                      <span className="font-medium">Central</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Cooling</span>
                      <span className="font-medium">Central A/C</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-medium">${property.price}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">${property.price}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Application Fee</span>
                      <span className="font-medium">$50</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Lease Term</span>
                      <span className="font-medium">12 Months</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                {/* Hardcoded amenities for demo */}
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaWifi className="text-blue-600" />
                  </div>
                  <span>High-Speed Internet</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaParking className="text-blue-600" />
                  </div>
                  <span>Private Parking</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaFan className="text-blue-600" />
                  </div>
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaShower className="text-blue-600" />
                  </div>
                  <span>Modern Bathroom</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaUtensils className="text-blue-600" />
                  </div>
                  <span>Fully Equipped Kitchen</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaTv className="text-blue-600" />
                  </div>
                  <span>Cable TV</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaSnowflake className="text-blue-600" />
                  </div>
                  <span>Refrigerator</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaWater className="text-blue-600" />
                  </div>
                  <span>Water Included</span>
                </div>
                {property.amenities?.includes("Pool") && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <FaSwimmingPool className="text-blue-600" />
                    </div>
                    <span>Swimming Pool</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Landlord Info and Actions) */}
          <div className="space-y-6">
            {/* Landlord info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Listed by</h3>
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <FaRegUser className="text-gray-500 text-2xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{property.landlordName || (landlord && landlord.name) || "Property Owner"}</h4>
                  <p className="text-gray-500 text-sm">Property Owner</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span className="ml-2 text-gray-600">4.0 (12 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm">Member since {landlord ? formatDate(landlord.registrationDate || "2020-01-01") : "2020"}</p>
              </div>

              {(property.status === 'available' || property.status === 'approved') && (
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={userRole === 'landlord'}
                >
                  Contact Landlord
                </button>
              )}

              {showContactForm && (
                <div className="mt-4">
                  <form onSubmit={handleContactSubmit}>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="Write your message to the landlord..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FaPaperPlane className="mr-2" /> Send Message
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Property status and actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Status</h3>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    property.status === 'available' || property.status === 'approved'
                      ? 'bg-green-500' 
                      : property.status === 'rejected'
                        ? 'bg-red-500'
                        : property.status === 'rented'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-medium">
                    {property.status === 'available' || property.status === 'approved'
                      ? 'Available Now' 
                      : property.status === 'rejected'
                        ? 'Rejected'
                        : property.status === 'rented'
                          ? 'Rented'
                          : property.status === 'pending'
                            ? 'Pending Approval'
                            : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaRegClock className="mr-1" />
                  <span>{property.views} views</span>
                </div>
              </div>

              {/* Action buttons */}
              {(property.status === 'available' || property.status === 'approved') && userRole !== 'landlord' && userRole !== 'admin' && (
                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply for Rental
                  </button>

                  <button
                    onClick={handleSaveToggle}
                    className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center ${isSaved
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {isSaved ? (
                      <>
                        <FaBookmark className="mr-2 text-blue-600" />
                        Saved
                      </>
                    ) : (
                      <>
                        <FaRegBookmark className="mr-2" />
                        Save Property
                      </>
                    )}
                  </button>

                  <a
                    href={`tel:+1234567890`}
                    className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
                  >
                    Call Landlord
                  </a>
                </div>
              )}
              
              {/* Landlord/Admin view of rejected/pending property */}
              {(property.status === 'rejected' || property.status === 'pending' || property.status === 'unavailable') && (
                <div className={`p-4 rounded-lg text-center ${
                  property.status === 'rejected' ? 'bg-red-50' : 
                  property.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <p className={`font-medium mb-2 ${
                    property.status === 'rejected' ? 'text-red-700' : 
                    property.status === 'pending' ? 'text-yellow-700' : 'text-gray-700'
                  }`}>
                    {property.status === 'rejected' 
                      ? 'This property has been rejected' 
                      : property.status === 'pending'
                        ? 'This property is pending approval'
                        : 'This property is unavailable'}
                  </p>
                  
                  {property.rejectionReason && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Reason:</span> {property.rejectionReason}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-sm">
                    {property.status === 'rejected' 
                      ? 'This property is not visible to tenants.' 
                      : property.status === 'pending'
                        ? 'This property will be visible to tenants once approved.'
                        : 'This property is not visible to tenants.'}
                  </p>
                </div>
              )}
              
              {/* Rented property view */}
              {property.status === 'rented' && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-blue-700 font-medium mb-2">This property is currently rented</p>
                  <p className="text-gray-600 text-sm">Check back later or browse other available properties</p>
                </div>
              )}
            </div>

            {/* Key details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Details</h3>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Pets {property.amenities?.includes("Pet Friendly") ? 'allowed' : 'not allowed'}</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Smoking not allowed</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Background check required</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">Income verification required</span>
                </li>
                <li className="flex items-start">
                  <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-600">12-month lease term</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {(property.status === 'available' || property.status === 'approved') && similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map(similar => (
                <div key={similar.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={`https://source.unsplash.com/random/600x400/?apartment&${similar.id}`}
                      alt={similar.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-xs font-semibold ${similar.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                      {similar.status === 'available' ? 'Available' : 'Rented'}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{similar.title}</h3>

                    <p className="text-green-600 font-bold text-lg mb-2">${similar.price}/month</p>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="text-sm truncate">{similar.location}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 border-t pt-3 mb-4">
                      <div className="flex items-center">
                        <FaBed className="mr-1" />
                        <span className="text-sm">{similar.bedrooms} {similar.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="mr-1" />
                        <span className="text-sm">{similar.bathrooms} {similar.bathrooms === 1 ? 'bath' : 'baths'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaRulerCombined className="mr-1" />
                        <span className="text-sm">{similar.area} sq ft</span>
                      </div>
                    </div>

                    <Link
                      to={`/properties/${similar.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md transition-colors block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

# src\Pages\PropertyListings\PropertyListings.jsx

```jsx
// src/pages/PropertyListingPage.jsx
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import PropertyCard from '../../Components/PropertyCard/PropertyCard';
import { useNavigate } from 'react-router-dom';

// Import services instead of directly using dummy data
import dataService from '../../services/dataService';

const PropertyListingPage = ({ isAuthenticated, savedPropertyIds = [], onSaveToggle }) => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [localSavedProperties, setLocalSavedProperties] = useState(savedPropertyIds);
  const [loading, setLoading] = useState(true);
  
  // Load properties when component mounts
  useEffect(() => {
    loadProperties();
    
    // Listen for data updates
    const handleDataUpdated = (event) => {
      if (event.detail.key === 'rentmate_properties') {
        loadProperties();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdated);
    };
  }, []);
  
  // Load all available properties
  const loadProperties = () => {
    // Get only available and approved properties
    const properties = dataService.getProperties().filter(p => 
      p.status === 'available' || p.status === 'approved' ||  p.status === 'rented'
    );
    
    setAllProperties(properties);
    // Important: Set filtered properties directly to show all data initially
    setFilteredProperties(properties); 
    setLoading(false);
  };
  
  // Update local state when savedPropertyIds prop changes
  useEffect(() => {
    setLocalSavedProperties(savedPropertyIds);
  }, [savedPropertyIds]);
  
  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      setLocalSavedProperties(event.detail.savedProperties);
    };
    
    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    
    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);
  
  // Function to handle saving/unsaving property
  const handleSaveToggle = (id) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    
    // Use the function passed from App.jsx
    onSaveToggle(id);
  };
  
  // Apply filters
  const applyFilters = () => {
    let results = [...allProperties];
    
    // Apply search term to title and description
    if (searchTerm) {
      const searchText = searchTerm.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchText) || 
        property.description.toLowerCase().includes(searchText) ||
        property.location.toLowerCase().includes(searchText)
      );
    }
    
    // Apply numeric filters - only if they have values
    if (filters.minPrice) results = results.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) results = results.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.bedrooms) results = results.filter(p => p.bedrooms >= Number(filters.bedrooms));
    if (filters.bathrooms) results = results.filter(p => p.bathrooms >= Number(filters.bathrooms));
    
    // Apply location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      results = results.filter(p => p.location.toLowerCase().includes(locationTerm));
    }
    
    setFilteredProperties(results);
  };
  
  // Effect for when search or filters change
  useEffect(() => {
    // Only apply filters if not in loading state
    if (!loading) {
      applyFilters();
    }
  }, [searchTerm, filters.minPrice, filters.maxPrice, filters.location, filters.bedrooms, filters.bathrooms, loading]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Perfect Home</h1>
      
      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by location, property name, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.bathrooms}
                  onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setFilters({
                  minPrice: '',
                  maxPrice: '',
                  location: '',
                  bedrooms: '',
                  bathrooms: ''
                })}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Results count */}
      {!loading && (
        <p className="text-gray-600 mb-4">Showing {filteredProperties.length} properties</p>
      )}
      
      {/* Property grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id}
              property={property}
              isAuthenticated={isAuthenticated}
              isSaved={localSavedProperties.includes(property.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListingPage;
```

# src\Pages\SavedProperties\SavedProperties.jsx

```jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaRegBookmark, FaBookmark, FaSort, FaFilter, FaSearch, FaArrowLeft } from "react-icons/fa";

// Import dummy data
import { properties } from "../../data/dummyData";

export default function SavedPropertiesPage({ savedPropertyIds = [], onSaveToggle }) {
  const [savedProperties, setSavedProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    sortBy: "default" // default, price-low, price-high, newest
  });
  const [loading, setLoading] = useState(true);

  // Fetch saved properties on component mount or when savedPropertyIds changes
  useEffect(() => {
    const fetchSavedProperties = () => {
      // Filter properties to get only saved ones based on the IDs passed from App
      const savedProps = properties.filter(prop => savedPropertyIds.includes(prop.id));

      setSavedProperties(savedProps);
      setFilteredProperties(savedProps);
      setLoading(false);
    };

    fetchSavedProperties();
  }, [savedPropertyIds]);

  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      const updatedIds = event.detail.savedProperties;
      const updatedProps = properties.filter(prop => updatedIds.includes(prop.id));
      setSavedProperties(updatedProps);
      setFilteredProperties(updatedProps);
    };

    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);

    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);

  // Handle removing a property from saved list
  const handleRemoveSaved = (propertyId) => {
    // Use the function passed from App.jsx
    onSaveToggle(propertyId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterProperties(e.target.value, filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    filterProperties(searchTerm, updatedFilters);
  };

  // Apply filters to properties
  const filterProperties = (search, filterOptions) => {
    let results = [...savedProperties];

    // Apply search term
    if (search) {
      results = results.filter(
        property =>
          property.title.toLowerCase().includes(search.toLowerCase()) ||
          property.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price filters
    if (filterOptions.minPrice) {
      results = results.filter(property => property.price >= parseInt(filterOptions.minPrice));
    }
    if (filterOptions.maxPrice) {
      results = results.filter(property => property.price <= parseInt(filterOptions.maxPrice));
    }

    // Apply bedroom filter
    if (filterOptions.bedrooms) {
      results = results.filter(property => property.bedrooms >= parseInt(filterOptions.bedrooms));
    }

    // Apply bathroom filter
    if (filterOptions.bathrooms) {
      results = results.filter(property => property.bathrooms >= parseInt(filterOptions.bathrooms));
    }

    // Apply sorting
    if (filterOptions.sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (filterOptions.sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (filterOptions.sortBy === "newest") {
      results.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
    }

    setFilteredProperties(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">Saved Properties</h1>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search saved properties..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <button
            className="ml-4 p-3 bg-gray-100 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-600" />
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Min Bedrooms"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Min Bathrooms"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sortBy"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No saved properties found</h2>
          <p className="text-gray-600 mb-6">You haven't saved any properties yet or none match your filters.</p>
          <Link to="/properties" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/properties/${property.id}`}>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <Link to={`/properties/${property.id}`}>
                    <h2 className="text-xl font-semibold mb-1 hover:text-blue-500">{property.title}</h2>
                  </Link>
                  <button
                    onClick={() => handleRemoveSaved(property.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaBookmark size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-2">${property.price.toLocaleString()}{property.rentOrSale === 'rent' ? '/month' : ''}</p>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaBed className="mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="mr-1" />
                    <span>{property.squareFeet} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

# src\Pages\Signup\Signup.jsx

```jsx
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";

export default function Signup() {
  const [accountExistError, setAccountExistError] = useState(null);
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  const phoneRegex = /^(02)?01[0125][0-9]{8}$/;

  const validationSchema = object({
    name: string()
      .required("Name Is Required")
      .min(3, "Name Must be At Least 3 Characters")
      .max(25, "Name Can Not Be More Than 25 Characters"),
    email: string()
      .required("Email Is Required")
      .email("Please Enter A Valid Email"),
    password: string()
      .required("Password Is required")
      .matches(
        passwordRegex,
        "Minimum 8 characters, one uppercase, one lowercase, one number, one special character"
      ),
    rePassword: string()
      .required("Confirm Password Is Required")
      .oneOf([ref("password")], "Passwords Must Match"),
    phone: string()
      .required("Phone Is Required")
      .matches(phoneRegex, "Only Egyptian phone numbers are allowed"),
    role: string().required("Role is required"),
  });

  async function registerUser(values) {
    const loadingToastId = toast.loading("Creating account...");
    try {
      // Get existing users from localStorage or initialize empty object
      const existingUsers = JSON.parse(localStorage.getItem("rentmateUsers")) || {
        tenants: [],
        landlords: [],
        admins: []
      };
      
      // Check if email already exists
      const allUsers = [
        ...existingUsers.tenants, 
        ...existingUsers.landlords, 
        ...existingUsers.admins
      ];
      
      const emailExists = allUsers.some(user => user.email === values.email);
      
      if (emailExists) {
        setAccountExistError("Email already in use");
        toast.error("Email already in use");
        return;
      }
      
      // Create new user object
      const newUser = {
        id: Date.now(), // Generate unique ID
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password, // Note: In a real app, never store plain passwords
      };
      
      // Add role-specific properties
      if (values.role === "tenant") {
        newUser.savedProperties = [];
        newUser.applications = [];
        existingUsers.tenants.push(newUser);
      } else if (values.role === "landlord") {
        newUser.properties = [];
        newUser.status = "pending"; // New landlords need admin approval
        existingUsers.landlords.push(newUser);
      } else if (values.role === "admin") {
        existingUsers.admins.push(newUser);
      }
      
      // Save updated users to localStorage
      localStorage.setItem("rentmateUsers", JSON.stringify(existingUsers));
      
      toast.success("Account created successfully");
      
      // For landlords, show a special message
      if (values.role === "landlord") {
        toast.success("Your account is pending admin approval", { duration: 5000 });
      }
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      toast.error("Error creating account");
      console.error(error);
    } finally {
      toast.dismiss(loadingToastId);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      role: "",
    },
    validationSchema,
    onSubmit: registerUser,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl text-gray-800 font-semibold mb-6">
        <i className="fa-solid fa-user-plus mr-2"></i> Create Your RentMate Account
      </h1>
      
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="name"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="text"
            placeholder="Enter your full name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="email"
            placeholder="Enter your email address"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
          )}
          {accountExistError && (
            <p className="text-red-600 text-sm mt-1">*{accountExistError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="password"
            placeholder="Create a secure password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm mt-1">
              *{formik.errors.password}
            </p>
          )}
        </div>

        {/* Re-Password */}
        <div>
          <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            id="rePassword"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="password"
            placeholder="Confirm your password"
            {...formik.getFieldProps("rePassword")}
          />
          {formik.touched.rePassword && formik.errors.rePassword && (
            <p className="text-red-600 text-sm mt-1">
              *{formik.errors.rePassword}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            id="phone"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="tel"
            placeholder="Enter your phone number"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.phone}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
          <select
            id="role"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            {...formik.getFieldProps("role")}
          >
            <option value="">Select your role</option>
            <option value="tenant">Tenant - Looking for properties</option>
            <option value="landlord">Landlord - Listing properties</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.role}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}


```

# src\Pages\TenantApplications\TenantApplications.jsx

```jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileAlt, FaCheck, FaTimes, FaClock, FaFilter, FaSort } from "react-icons/fa";

// Import dummy data
import { properties, users } from "../../data/dummyData";

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
      // In a real app, this would be an API call
      // For now, we'll get tenant data from localStorage or dummy data
      const userId = localStorage.getItem("userId");
      const tenant = users.tenants.find(t => t.id === Number(userId)) || users.tenants[0];

      // Prepare application data with property details
      const applicationsData = tenant.applications || [];
      const applicationsWithDetails = applicationsData.map(app => {
        const property = properties.find(p => p.id === app.propertyId);
        // Generate a random application date within the last 30 days
        const randomDays = Math.floor(Math.random() * 30);
        const applicationDate = new Date();
        applicationDate.setDate(applicationDate.getDate() - randomDays);

        return {
          ...app,
          property,
          applicationDate: applicationDate.toISOString(),
          id: `${app.propertyId}-${tenant.id}` // Create unique id for each application
        };
      });

      // Add some more dummy applications with different statuses for demonstration
      if (applicationsWithDetails.length < 3) {
        // Find properties not already applied to
        const appliedPropertyIds = applicationsWithDetails.map(app => app.propertyId);
        const unappliedProperties = properties.filter(p => !appliedPropertyIds.includes(p.id));

        // Add approved application
        if (unappliedProperties.length > 0) {
          const approvedDate = new Date();
          approvedDate.setDate(approvedDate.getDate() - 25);

          applicationsWithDetails.push({
            propertyId: unappliedProperties[0].id,
            status: "approved",
            documents: ["id.pdf", "employment.pdf", "credit-report.pdf"],
            property: unappliedProperties[0],
            applicationDate: approvedDate.toISOString(),
            id: `${unappliedProperties[0].id}-${tenant.id}-approved`
          });
        }

        // Add rejected application
        if (unappliedProperties.length > 1) {
          const rejectedDate = new Date();
          rejectedDate.setDate(rejectedDate.getDate() - 15);

          applicationsWithDetails.push({
            propertyId: unappliedProperties[1].id,
            status: "rejected",
            documents: ["id.pdf", "employment.pdf"],
            property: unappliedProperties[1],
            applicationDate: rejectedDate.toISOString(),
            id: `${unappliedProperties[1].id}-${tenant.id}-rejected`,
            rejectionReason: "Another applicant was selected."
          });
        }
      }

      setApplications(applicationsWithDetails);
      setFilteredApplications(applicationsWithDetails);
      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(() => {
      fetchApplications();
    }, 500);
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
      results.sort((a, b) => a.property.title.localeCompare(b.property.title));
    } else if (filters.sortBy === "property-za") {
      results.sort((a, b) => b.property.title.localeCompare(a.property.title));
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
                        src={`https://source.unsplash.com/random/300x200/?apartment&${application.propertyId}`}
                        alt={application.property.title}
                        className="w-full h-36 object-cover rounded-md"
                      />
                    </div>

                    {/* Application details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 mb-1">
                            {application.property.title}
                          </h2>
                          <p className="text-gray-600 text-sm mb-2">
                            {application.property.location}
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
                          <p className="font-medium">${application.property.price}/month</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Documents Submitted</p>
                          <p className="font-medium">{application.documents?.length || 0} file(s)</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Property Size</p>
                          <p className="font-medium">{application.property.bedrooms} bed, {application.property.bathrooms} bath</p>
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
```

# src\Pages\TenantDashboard\TenantDashboard.jsx

```jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaRegBookmark, FaRegFileAlt, FaCalendarAlt, FaRegBell, FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

// Importing dummy data
import { properties, users, messages } from "../../data/dummyData";

export default function TenantDashboard({ savedPropertyIds = [] }) {
  const [tenant, setTenant] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Simulate fetching tenant data
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, use localStorage and dummy data
    const userId = localStorage.getItem("userId");
    const tenantData = users.tenants.find(t => t.id === Number(userId)) || users.tenants[0];
    
    setTenant(tenantData);
    
    // Get saved properties from props instead of localStorage
    const savedPropsData = properties.filter(p => savedPropertyIds.includes(p.id));
    setSavedProperties(savedPropsData);
    
    // Get applications
    const applicationsData = tenantData.applications || [];
    // Map application data to include property details
    const applicationsWithDetails = applicationsData.map(app => {
      const property = properties.find(p => p.id === app.propertyId);
      return {
        ...app,
        property
      };
    });
    setApplications(applicationsWithDetails);
    
    // Unread messages (simulated)
    const userMessages = messages.filter(m => m.receiverId === tenantData.id && !m.read);
    setUnreadMessages(userMessages);
    
    // Recently viewed properties (simulated)
    // In a real app, this would be tracked in localStorage or database
    const recentlyViewedData = properties.slice(0, 3); // Just take first 3 for demo
    setRecentlyViewed(recentlyViewedData);
  }, [savedPropertyIds]);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Generate a random future date for viewing appointment
  const getRandomFutureDate = () => {
    const now = new Date();
    const futureDate = new Date(now.setDate(now.getDate() + Math.floor(Math.random() * 14) + 1));
    return futureDate;
  };
  
  // Listen for saved properties updates from other components
  useEffect(() => {
    const handleSavedPropertiesUpdate = (event) => {
      const updatedIds = event.detail.savedProperties;
      const updatedProps = properties.filter(prop => updatedIds.includes(prop.id));
      setSavedProperties(updatedProps);
    };
    
    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    
    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, []);
  
  if (!tenant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {tenant.name}!</h1>
          <p className="opacity-90">Here's an overview of your rental activities and saved properties.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaRegBookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saved Properties</p>
              <p className="text-xl font-semibold">{savedProperties.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaRegFileAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Applications</p>
              <p className="text-xl font-semibold">{applications.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Viewings</p>
              <p className="text-xl font-semibold">2</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaRegBell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Messages</p>
              <p className="text-xl font-semibold">{unreadMessages.length}</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Properties Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Saved Properties</h2>
                <Link to="/saved-properties" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="divide-y">
                {savedProperties.length > 0 ? (
                  savedProperties.slice(0, 3).map(property => (
                    <div key={property.id} className="p-4 flex">
                      <img 
                        src={`https://source.unsplash.com/random/150x100/?apartment&${property.id}`} 
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-800">{property.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mt-2 space-x-4">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <FaRulerCombined className="mr-1" /> {property.area} sqft
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-semibold text-green-600">${property.price}/month</span>
                          <Link to={`/properties/${property.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>You haven't saved any properties yet.</p>
                    <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Applications Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Applications</h2>
                <Link to="/applications" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="divide-y">
                {applications.length > 0 ? (
                  applications.map(application => (
                    <div key={application.propertyId} className="p-4">
                      <div className="flex items-start">
                        <img 
                          src={`https://source.unsplash.com/random/150x100/?apartment&${application.propertyId}`} 
                          alt={application.property?.title || "Property"}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{application.property?.title || "Property"}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-gray-600 text-sm mt-1">
                            Applied on: {formatDate(new Date().toISOString())}
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-600">
                            {application.documents?.length > 0 && (
                              <div>Documents submitted: {application.documents.join(", ")}</div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <Link 
                              to={`/applications/${application.propertyId}`} 
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Application
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>You haven't submitted any applications yet.</p>
                    <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="p-4 space-y-3">
                <Link 
                  to="/properties" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaSearch className="h-4 w-4" />
                  </div>
                  <span>Search for Properties</span>
                </Link>
                
                <Link 
                  to="/saved-properties" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegBookmark className="h-4 w-4" />
                  </div>
                  <span>View Saved Properties</span>
                </Link>
                
                <Link 
                  to="/applications" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegFileAlt className="h-4 w-4" />
                  </div>
                  <span>Check Application Status</span>
                </Link>
                
                <Link 
                  to="/messages" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaRegBell className="h-4 w-4" />
                  </div>
                  <span>Messages</span>
                  {unreadMessages.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadMessages.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {/* Upcoming Viewings */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Viewings</h2>
              </div>
              
              <div className="divide-y">
                {/* Hard-coded viewing appointments for demo */}
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaCalendarAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Modern Downtown Apartment</h3>
                      <p className="text-sm text-gray-600">{formatDate(getRandomFutureDate())} at 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaCalendarAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Luxury Beach House</h3>
                      <p className="text-sm text-gray-600">{formatDate(getRandomFutureDate())} at 11:30 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recently Viewed */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Recently Viewed</h2>
              </div>
              
              <div className="divide-y">
                {recentlyViewed.map(property => (
                  <div key={property.id} className="p-4">
                    <Link to={`/properties/${property.id}`} className="flex items-center">
                      <img 
                        src={`https://source.unsplash.com/random/150x100/?apartment&${property.id}`} 
                        alt={property.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800 text-sm">{property.title}</h3>
                        <p className="text-sm text-gray-600">${property.price}/month</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

# src\services\dataService.js

```js
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
```

# src\services\emailService.js

```js
// Email service for sending notifications
// This is a mock service that simulates sending emails

// Email templates
const EMAIL_TEMPLATES = {
    // Landlord account status templates
    LANDLORD_APPROVED: {
      subject: 'Your RentMate Landlord Account Has Been Approved',
      body: (name) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Account Approved!</h2>
          <p>Dear ${name},</p>
          <p>We're pleased to inform you that your landlord account on RentMate has been <strong>approved</strong>!</p>
          <p>You can now:</p>
          <ul>
            <li>List your properties</li>
            <li>Manage your existing listings</li>
            <li>Communicate with potential tenants</li>
            <li>Review rental applications</li>
          </ul>
          <p>Log in to your account to get started.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Go to My Dashboard</a>
          </div>
          <p>Thank you for choosing RentMate for your property management needs.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    LANDLORD_REJECTED: {
      subject: 'RentMate Account Application Status',
      body: (name, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Account Review Update</h2>
          <p>Dear ${name},</p>
          <p>We've reviewed your application to join RentMate as a landlord. Unfortunately, we are unable to approve your account at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>If you believe this is an error or would like to provide additional information, please contact our support team for assistance.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #6b7280; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Contact Support</a>
          </div>
          <p>Thank you for your interest in RentMate.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    
    // Property listing status templates
    PROPERTY_APPROVED: {
      subject: 'Your Property Listing Has Been Approved',
      body: (name, propertyTitle) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Property Listing Approved!</h2>
          <p>Dear ${name},</p>
          <p>Great news! Your property listing <strong>"${propertyTitle}"</strong> has been reviewed and approved.</p>
          <p>Your property is now visible to potential tenants and they can:</p>
          <ul>
            <li>View your property details</li>
            <li>Contact you for more information</li>
            <li>Submit rental applications</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View My Listing</a>
          </div>
          <p>Thank you for listing your property on RentMate.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    PROPERTY_REJECTED: {
      subject: 'Your Property Listing Requires Attention',
      body: (name, propertyTitle, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Property Listing Update</h2>
          <p>Dear ${name},</p>
          <p>We've reviewed your property listing <strong>"${propertyTitle}"</strong> and found that it doesn't meet our current guidelines.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>You can make the necessary changes and resubmit your listing for review.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Edit My Listing</a>
          </div>
          <p>If you have any questions or need assistance, please contact our support team.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    }
  };
  
  // Mock function to simulate sending an email
  const sendEmail = (to, subject, body) => {
    return new Promise((resolve) => {
      // Log the email for demonstration
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body.substring(0, 100)}...`);
      
      // In a real application, this would use an email service like SendGrid, Mailgun, etc.
      // For this demo, we'll just simulate a successful send after a delay
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `mock-${Date.now()}`,
          to,
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  };
  
  // Send landlord approval email
  const sendLandlordApprovalEmail = async (landlord) => {
    if (!landlord || !landlord.email) {
      throw new Error('Landlord information is required');
    }
    
    const template = EMAIL_TEMPLATES.LANDLORD_APPROVED;
    const body = template.body(landlord.name);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send landlord rejection email
  const sendLandlordRejectionEmail = async (landlord, reason = '') => {
    if (!landlord || !landlord.email) {
      throw new Error('Landlord information is required');
    }
    
    const template = EMAIL_TEMPLATES.LANDLORD_REJECTED;
    const body = template.body(landlord.name, reason);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send property approval email
  const sendPropertyApprovalEmail = async (landlord, property) => {
    if (!landlord || !landlord.email || !property) {
      throw new Error('Landlord and property information are required');
    }
    
    const template = EMAIL_TEMPLATES.PROPERTY_APPROVED;
    const body = template.body(landlord.name, property.title);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send property rejection email
  const sendPropertyRejectionEmail = async (landlord, property, reason = '') => {
    if (!landlord || !landlord.email || !property) {
      throw new Error('Landlord and property information are required');
    }
    
    const template = EMAIL_TEMPLATES.PROPERTY_REJECTED;
    const body = template.body(landlord.name, property.title, reason);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Export functions
  export default {
    sendLandlordApprovalEmail,
    sendLandlordRejectionEmail,
    sendPropertyApprovalEmail,
    sendPropertyRejectionEmail
  };
```

# vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
})

```

