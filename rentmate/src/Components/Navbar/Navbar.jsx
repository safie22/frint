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