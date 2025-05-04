import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FaCheck, FaArrowLeft, FaCreditCard, FaLock, FaRupeeSign, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getVehicleById } from '../firebase/vehicles';
import { createBooking, checkVehicleAvailability } from '../firebase/bookings';
import LocationValidator from '../components/LocationValidator';
import LoginModal from '../components/LoginModal';
import BackgroundGraphics from '../components/BackgroundGraphics';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Helper functions defined before state initialization
  const calculateTotalHours = (start, end) => {
    if (!start || !end) return 0;
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    return Math.max(1, Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60)));
  };

  const calculateTotalPrice = (start, end, rate) => {
    if (!start || !end || !rate) return 0;
    const hours = calculateTotalHours(start, end);
    return hours * rate;
  };

  // Format datetime for input fields
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    // Check if it's already in the correct format
    if (dateTimeString.includes('T')) {
      return dateTimeString;
    }
    
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DDTHH:MM
      return date.toISOString().substring(0, 16);
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  };

  const generatePickupLocation = (city) => {
    const locations = [
      `${city} Central Mall`,
      `${city} Railway Station`,
      `${city} Bus Terminal`,
      `${city} Airport`,
      `${city} City Center`
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  // Get current date time with seconds set to zero to avoid validation issues
  const getCurrentDateTimeString = () => {
    const now = new Date();
    now.setSeconds(0);
    return now.toISOString().substring(0, 16); // YYYY-MM-DDTHH:MM
  };

  // State initialization
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    startDate: formatDateTimeForInput(queryParams.get('start') || ''),
    endDate: formatDateTimeForInput(queryParams.get('end') || ''),
    selectedCity: queryParams.get('location') || '',
    pickupLocation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    totalPrice: 0
  });
  
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log('Fetching vehicle with ID:', id);
        const vehicleData = await getVehicleById(id);
        console.log('Fetched vehicle data:', vehicleData);
        
        if (!vehicleData) {
          console.error('Vehicle not found in database');
          setError('Vehicle not found');
          return;
        }
        
        setVehicle(vehicleData);
        
        // Calculate initial price if dates are provided
        if (bookingData.startDate && bookingData.endDate) {
          const price = calculateTotalPrice(
            bookingData.startDate,
            bookingData.endDate,
            vehicleData.hourlyRate
          );
          console.log('Calculated initial price:', price);
          setBookingData(prev => ({ ...prev, totalPrice: price }));
        }
      } catch (err) {
        console.error('Error in fetchVehicle:', err);
        setError('Error loading vehicle details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Starting vehicle fetch for ID:', id);
      fetchVehicle();
    } else {
      console.error('No vehicle ID provided');
      setError('No vehicle ID provided');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (bookingData.selectedCity) {
      setBookingData(prev => ({
        ...prev,
        pickupLocation: generatePickupLocation(bookingData.selectedCity)
      }));
    }
  }, [bookingData.selectedCity]);
  
  useEffect(() => {
    // Update total amount whenever dates/times change
    if (vehicle) {
      setBookingData(prev => ({
        ...prev,
        totalPrice: calculateTotalPrice(
          prev.startDate,
          prev.endDate,
          vehicle.hourlyRate
        )
      }));
    }
  }, [bookingData.startDate, bookingData.endDate, vehicle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <BackgroundGraphics variant="default" />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <BackgroundGraphics variant="default" />
        <div className="bg-red-500/10 backdrop-blur-lg p-6 rounded-xl border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <BackgroundGraphics variant="default" />
        <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Vehicle Not Found</h2>
          <p className="text-gray-400 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const { name, type, image, price, hourlyRate } = vehicle;
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    // For datetime fields, ensure proper formatting
    if (name === 'startDate' || name === 'endDate') {
      // Validate the date format
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setBookingData(prev => ({
            ...prev,
            [name]: value
          }));
        } else {
          console.error('Invalid date format:', value);
        }
      } catch (err) {
        console.error('Error parsing date:', err);
      }
    } else {
      // For other fields, update normally
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationValidation = (isValid) => {
    if (!isValid) {
      navigate('/location-not-served');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // If user is not logged in, show login modal
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);

    try {
      console.log('Starting booking process...');
      console.log('Checking availability for vehicle:', id);
      console.log('Start date:', bookingData.startDate);
      console.log('End date:', bookingData.endDate);

      const isAvailable = await checkVehicleAvailability(
        id,
        bookingData.startDate,
        bookingData.endDate
      );

      console.log('Vehicle availability:', isAvailable);

      if (!isAvailable) {
        setError('Vehicle is not available for selected dates');
        setLoading(false);
        return;
      }

      console.log('Creating booking with user ID:', user.uid);
      const bookingDetails = {
        userId: user.uid,
        vehicleId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: bookingData.totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
        customerDetails: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone
        },
        createdAt: new Date().toISOString()
      };
      console.log('Full booking details:', bookingDetails);

      const bookingId = await createBooking(bookingDetails);
      console.log('Booking created successfully with ID:', bookingId);
      
      navigate('/booking-success', { 
        state: { 
          bookingId,
          vehicleName: vehicle.name,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          totalPrice: bookingData.totalPrice,
          customerName: `${bookingData.firstName} ${bookingData.lastName}`
        }
      });
    } catch (err) {
      console.error('Detailed booking error:', err);
      setError('Failed to create booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <BackgroundGraphics variant="default" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-pink-400 hover:text-pink-300 mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Vehicle Details
        </button>

        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg p-6 rounded-xl border border-red-500/20 mb-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          {/* Vehicle Info */}
          <div className="p-8 border-b border-gray-700/30">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
              Book {vehicle.name}
            </h1>
            <p className="text-gray-400 mt-2 flex items-center">
              <FaRupeeSign className="mr-1" />
              {vehicle.hourlyRate}/hour
            </p>
            {!user && (
              <p className="text-sm text-gray-400 mt-4">
                You can fill in the details now and login at the final step.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date and Time
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formatDateTimeForInput(bookingData.startDate)}
                    onChange={handleDateChange}
                    min={getCurrentDateTimeString()}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date and Time
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formatDateTimeForInput(bookingData.endDate)}
                    onChange={handleDateChange}
                    min={formatDateTimeForInput(bookingData.startDate) || getCurrentDateTimeString()}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Price Calculation */}
            {bookingData.startDate && bookingData.endDate && (
              <div className="bg-pink-500/10 backdrop-blur-lg p-6 rounded-xl border border-pink-500/20 transform hover:scale-[1.02] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-lg font-medium text-white flex items-center">
                      <FaClock className="mr-2 text-pink-400" />
                      {calculateTotalHours(bookingData.startDate, bookingData.endDate)} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Rate</p>
                    <p className="text-lg font-medium text-white flex items-center">
                      <FaRupeeSign className="mr-1 text-pink-400" />
                      {vehicle.hourlyRate}/hour
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {bookingData.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={bookingData.firstName}
                    onChange={handleDateChange}
                    className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={bookingData.lastName}
                    onChange={handleDateChange}
                    className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleDateChange}
                    className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleDateChange}
                    className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading || !bookingData.startDate || !bookingData.endDate}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : user ? (
                  <>
                    <FaCheck className="text-lg" />
                    <span>Confirm Booking</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="text-lg" />
                    <span>Continue to Login</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        <LocationValidator
          city={bookingData.selectedCity}
          onValidLocation={() => {}}
          onInvalidLocation={handleLocationValidation}
        />
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default Booking; 