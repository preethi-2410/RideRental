import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaMotorcycle, 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaCalendarAlt,
  FaHome,
  FaCarSide,
  FaBiking,
  FaInfoCircle,
  FaEnvelope,
  FaCog,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase/auth';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOutUser();
      setShowLogoutConfirm(false);
      setShowLoginModal(true);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/cars', label: 'Cars', icon: <FaCarSide /> },
    { path: '/bikes', label: 'Bikes', icon: <FaBiking /> },
    { path: '/about', label: 'About', icon: <FaInfoCircle /> },
    { path: '/contact', label: 'Contact', icon: <FaEnvelope /> }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group" 
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <FaCar className="text-primary text-2xl" />
              <FaMotorcycle className="text-accent text-2xl ml-1" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              RideRental
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 relative group flex items-center space-x-2 ${
                  isActive(item.path) ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'
                }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
                  isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}

            {user ? (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                    isActive('/my-bookings') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  <FaCalendarAlt className="text-lg" />
                  <span>My Bookings</span>
                </Link>
                
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:text-primary flex items-center space-x-2"
                  >
                    <FaCog className="text-lg" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogoutClick}
                  className="px-4 py-2 rounded-lg bg-primary text-white transition-colors duration-300 hover:bg-primary-dark flex items-center space-x-2"
                >
                  <FaUser className="text-lg" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:text-primary flex items-center space-x-2"
                >
                  <FaSignInAlt className="text-lg" />
                  <span>Login</span>
                </button>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-primary text-white transition-colors duration-300 hover:bg-primary-dark flex items-center space-x-2"
                >
                  <FaUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100 mt-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100/50'
                }`}
                onClick={closeMenu}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                    isActive('/my-bookings')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100/50'
                  }`}
                  onClick={closeMenu}
                >
                  <FaCalendarAlt className="text-lg" />
                  <span>My Bookings</span>
                </Link>
                
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-100/50 flex items-center space-x-2"
                    onClick={closeMenu}
                  >
                    <FaCog className="text-lg" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogoutClick();
                    closeMenu();
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-white transition-colors duration-300 hover:bg-primary-dark flex items-center space-x-2"
                >
                  <FaUser className="text-lg" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-100/50 flex items-center space-x-2"
                >
                  <FaSignInAlt className="text-lg" />
                  <span>Login</span>
                </button>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-primary text-white transition-colors duration-300 hover:bg-primary-dark flex items-center space-x-2"
                  onClick={closeMenu}
                >
                  <FaUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-[9998]" />
          <div className="fixed inset-0 flex items-start justify-center p-4 z-[9999]" style={{ paddingTop: '20vh' }}>
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleLogoutCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal}
      />
    </nav>
  );
};

export default Navbar; 