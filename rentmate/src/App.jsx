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
import ManagePropertiesPage from './pages/Landord/ManagePropertiesPage/ManagePropertiesPage';
import PropertyFormPage from './pages/Landord/PropertyFormPage/PropertyFormPage';
import LandlordApplicationsPage from './pages/Landord/LandlordApplications/LandlordApplicationsPage';
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