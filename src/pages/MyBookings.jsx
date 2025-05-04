import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, checkBookingsCollection, cancelBooking, rescheduleBooking } from '../firebase/bookings';
import { getVehicleById } from '../firebase/vehicles';
import { FaCalendarAlt, FaCarSide, FaClock, FaMoneyBillWave, FaTimes, FaExclamationTriangle, FaCalendarCheck, FaEdit, FaDownload, FaEye } from 'react-icons/fa';
import PaymentButton from '../components/PaymentButton';
import BookingDetailsModal from '../components/BookingDetailsModal';
import BackgroundGraphics from '../components/BackgroundGraphics';
import jsPDF from 'jspdf';

// Format datetime for input fields
const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  
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

// Get current date time with seconds set to zero to avoid validation issues
const getCurrentDateTimeString = () => {
  const now = new Date();
  now.setSeconds(0);
  return now.toISOString().substring(0, 16); // YYYY-MM-DDTHH:MM
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingId, vehicle }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl max-w-md w-full p-8 border border-gray-700/30 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-4">Confirm Cancellation</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to cancel your booking for 
          <span className="font-semibold text-white">{vehicle ? ` ${vehicle.name}` : ''}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
          >
            No, Keep Booking
          </button>
          <button
            onClick={() => onConfirm(bookingId)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

// Reschedule Modal Component
const RescheduleModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking && isOpen) {
      setStartDate(formatDateTimeForInput(booking.startDate));
      setEndDate(formatDateTimeForInput(booking.endDate));
      setError('');
    }
  }, [booking, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate dates
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const now = new Date();
    
    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
      setError('Please enter valid dates');
      return;
    }
    
    if (newStartDate >= newEndDate) {
      setError('End date must be after start date');
      return;
    }
    
    if (newStartDate < now) {
      setError('Start date cannot be in the past');
      return;
    }
    
    setLoading(true);
    onConfirm(booking.id, startDate, endDate);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl max-w-md w-full p-8 border border-gray-700/30 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Reschedule Booking</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg p-4 rounded-xl border border-red-500/20 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <p className="text-gray-300 mb-4">
            Reschedule your booking for 
            <span className="font-semibold text-white">{booking?.vehicle?.name || ''}</span>
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date and Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={getCurrentDateTimeString()}
                className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date and Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || getCurrentDateTimeString()}
                className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Determine booking status display color
const getBookingStatusColor = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  
  if (booking.status === 'cancelled') {
    return 'bg-red-100 text-red-800';
  }
  
  if (now < startDate) {
    return 'bg-blue-100 text-blue-800'; // Upcoming
  } else if (now >= startDate && now <= endDate) {
    return 'bg-green-100 text-green-800'; // Ongoing
  } else {
    return 'bg-purple-100 text-purple-800'; // Completed
  }
};

// Get user-friendly booking status label
const getBookingStatusLabel = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  
  if (booking.status === 'cancelled') {
    return 'Cancelled';
  }
  
  if (now < startDate) {
    return 'Upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'Ongoing';
  } else {
    return 'Completed';
  }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [collectionExists, setCollectionExists] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const { user } = useAuth();

  // Open confirmation modal
  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeCancelModal = () => {
    setShowConfirmModal(false);
    setSelectedBooking(null);
  };

  // Open reschedule modal
  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setShowRescheduleModal(true);
  };

  // Close reschedule modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedBooking(null);
  };

  // Function to cancel a booking
  const handleCancelBooking = async (bookingId) => {
    // Close the modal
    setShowConfirmModal(false);
    
    try {
      setCancelError('');
      setCancelSuccess('');
      setCancellingId(bookingId);
      
      await cancelBooking(bookingId);
      
      // Update the booking in the state
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      setCancelSuccess(`Booking ${bookingId} has been cancelled successfully.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setCancelSuccess('');
      }, 5000);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setCancelError(error.message || 'Failed to cancel booking');
      
      // Clear error message after it's shown for 5 seconds
      setTimeout(() => {
        setCancelError('');
      }, 5000);
    } finally {
      setCancellingId(null);
      setSelectedBooking(null);
    }
  };

  // Function to reschedule a booking
  const handleRescheduleBooking = async (bookingId, newStartDate, newEndDate) => {
    // Close the modal
    setShowRescheduleModal(false);
    
    try {
      setRescheduleError('');
      setRescheduleSuccess('');
      setReschedulingId(bookingId);
      
      const result = await rescheduleBooking(bookingId, newStartDate, newEndDate);
      
      // Update the booking in the state
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              startDate: newStartDate,
              endDate: newEndDate,
              totalPrice: result.newTotalPrice,
              status: 'pending' // Reset to pending after reschedule
            } 
          : booking
      ));
      
      setRescheduleSuccess(`Booking has been rescheduled successfully.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setRescheduleSuccess('');
      }, 5000);
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setRescheduleError(error.message || 'Failed to reschedule booking');
      
      // Clear error message after it's shown for 5 seconds
      setTimeout(() => {
        setRescheduleError('');
      }, 5000);
    } finally {
      setReschedulingId(null);
      setSelectedBooking(null);
    }
  };

  // Can this booking be modified?
  const canModifyBooking = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    
    // Check if the booking start date is in the future
    const startDate = new Date(booking.startDate);
    const now = new Date();
    return startDate > now;
  };

  useEffect(() => {
    const checkCollection = async () => {
      const exists = await checkBookingsCollection();
      setCollectionExists(exists);
    };
    checkCollection();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        console.log('Current user ID:', user.uid);
        
        const userBookings = await getUserBookings(user.uid);
        console.log('Fetched bookings:', userBookings);
        
        // Fetch vehicle details and add user information for each booking
        const bookingsWithVehicles = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const vehicle = await getVehicleById(booking.vehicleId);
              return {
                ...booking,
                vehicle,
                // Ensure customer information is included
                customerName: user.displayName,
                customerEmail: user.email,
                customerPhone: user.phoneNumber || booking.phone,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email
              };
            } catch (err) {
              console.error('Error fetching vehicle for booking:', booking.id, err);
              return {
                ...booking,
                vehicle: null,
                // Still include customer information even if vehicle fetch fails
                customerName: user.displayName,
                customerEmail: user.email,
                customerPhone: user.phoneNumber || booking.phone,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email
              };
            }
          })
        );

        console.log('Final bookings with vehicles and customer info:', bookingsWithVehicles);
        setBookings(bookingsWithVehicles);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Generate and download PDF receipt
  const downloadReceipt = (booking) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60));

      // Set initial font size and style for header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('VEHICLE RENTAL RECEIPT', 105, 20, { align: 'center' });
      
      // Add company name
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Your Vehicle Rental Service', 105, 30, { align: 'center' });
      
      // Add a line
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Booking details
      doc.setFontSize(11);
      let y = 45; // Starting y position for content

      // Helper function to add a section title
      const addSectionTitle = (title) => {
        y += 5; // Add space before section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title, 20, y);
        doc.line(20, y + 1, 190, y + 1); // Underline the section title
        y += 8;
        doc.setFontSize(11);
      };

      // Helper function to add a row with label and value
      const addRow = (label, value) => {
        const displayValue = value || 'N/A';
        doc.setFont('helvetica', 'bold');
        doc.text(label, 25, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(displayValue), 80, y);
        y += 7;
      };

      // Format currency
      const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return `₹${Number(amount).toFixed(2)}`;
      };

      // Format date
      const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      // Add booking information
      addSectionTitle('Booking Information');
      addRow('Booking ID:', booking.id);
      addRow('Status:', booking.status.toUpperCase());
      addRow('Payment Status:', booking.paymentStatus.toUpperCase());
      
      // Add customer details
      addSectionTitle('Customer Details');
      const customerName = booking.customerName || `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || user?.displayName;
      const customerEmail = booking.customerEmail || booking.email || user?.email;
      const customerPhone = booking.customerPhone || booking.phone;

      addRow('Name:', customerName || 'N/A');
      addRow('Email:', customerEmail || 'N/A');
      addRow('Phone:', customerPhone || 'N/A');
      
      // Add vehicle details
      addSectionTitle('Vehicle Details');
      if (booking.vehicle) {
        addRow('Vehicle:', booking.vehicle.name);
        addRow('Vehicle Type:', booking.vehicle.type?.charAt(0).toUpperCase() + booking.vehicle.type?.slice(1));
        addRow('Transmission:', booking.vehicle.transmission);
        addRow('Fuel Type:', booking.vehicle.fuel);
        addRow('Vehicle ID:', booking.vehicleId);
      } else {
        addRow('Vehicle:', 'Vehicle unavailable');
        addRow('Vehicle ID:', booking.vehicleId);
      }
      
      // Add booking period details
      addSectionTitle('Booking Period');
      addRow('From:', formatDateTime(startDate));
      addRow('To:', formatDateTime(endDate));
      addRow('Duration:', `${duration} hour${duration > 1 ? 's' : ''}`);
      
      if (booking.pickupLocation) {
        addRow('Pickup Location:', booking.pickupLocation);
      }
      
      // Add payment details
      addSectionTitle('Payment Details');
      addRow('Total Amount:', formatCurrency(booking.totalPrice));
      if (booking.vehicle && booking.vehicle.hourlyRate) {
        addRow('Hourly Rate:', formatCurrency(booking.vehicle.hourlyRate) + '/hour');
      }
      addRow('Payment ID:', booking.paymentId);
      
      // Add cancellation details if cancelled
      if (booking.status === 'cancelled' && booking.cancellationReason) {
        addSectionTitle('Cancellation Details');
        addRow('Reason:', booking.cancellationReason);
        if (booking.cancellationDate) {
          addRow('Cancelled On:', formatDateTime(booking.cancellationDate));
        }
      }

      // Add footer
      y += 15;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color
      doc.text('Thank you for choosing our service!', 105, y, { align: 'center' });
      
      // Add terms and conditions
      y += 8;
      doc.setFontSize(8);
      doc.text('This is an electronically generated receipt.', 105, y, { align: 'center' });
      
      // Add timestamp
      y += 5;
      doc.text(`Generated on: ${formatDateTime(new Date())}`, 105, y, { align: 'center' });

      // Save the PDF
      doc.save(`booking-receipt-${booking.id}.pdf`);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setError('Failed to generate receipt. Please try again.');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <BackgroundGraphics variant="default" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-8">
          My Bookings
        </h1>
      
        {bookings.length === 0 ? (
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-8 text-center">
            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Bookings Found</h2>
            <p className="text-gray-400">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {booking.vehicle?.name || 'Unknown Vehicle'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-400'
                        : booking.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400'
                        : booking.status === 'completed'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
                      ₹{booking.totalPrice}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <FaCalendarAlt className="mr-2 text-pink-400" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaClock className="mr-2 text-pink-400" />
                    <span>
                      {new Date(booking.startDate).toLocaleTimeString()} - {new Date(booking.endDate).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaCarSide className="mr-2 text-pink-400" />
                    <span>{booking.vehicle?.type || 'Unknown Type'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {canModifyBooking(booking) && (
                    <>
                      <button
                        onClick={() => openRescheduleModal(booking)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Reschedule
                      </button>
                      <button
                        onClick={() => openCancelModal(booking)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => downloadReceipt(booking)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Receipt
                  </button>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaEye /> Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      
      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelBooking}
        bookingId={selectedBooking?.id}
        vehicle={selectedBooking?.vehicle}
      />
      
      <RescheduleModal 
        isOpen={showRescheduleModal}
        onClose={closeRescheduleModal}
        onConfirm={handleRescheduleBooking}
        booking={selectedBooking}
      />
      
        <BookingDetailsModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      </div>
    </div>
  );
};

export default MyBookings;