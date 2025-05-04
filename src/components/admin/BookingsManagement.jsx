import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCalendarAlt, FaCar, FaUser, FaMoneyBillWave, FaCheck, FaTimes, FaClock, FaSearch } from 'react-icons/fa';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = await Promise.all(
        bookingsSnapshot.docs.map(async (doc) => {
          const booking = { id: doc.id, ...doc.data() };
          
          // Fetch vehicle details
          if (booking.vehicleId) {
            const vehicleDoc = await getDocs(
              query(collection(db, 'vehicles'), where('id', '==', booking.vehicleId))
            );
            if (!vehicleDoc.empty) {
              booking.vehicle = vehicleDoc.docs[0].data();
            }
          }
          
          return booking;
        })
      );
      
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      setMessage('Booking status updated successfully!');
    } catch (err) {
      setError('Failed to update booking status: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerDetails?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerDetails?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/10 text-yellow-400', icon: <FaClock className="mr-1" /> },
      confirmed: { color: 'bg-green-500/10 text-green-400', icon: <FaCheck className="mr-1" /> },
      cancelled: { color: 'bg-red-500/10 text-red-400', icon: <FaTimes className="mr-1" /> },
      completed: { color: 'bg-blue-500/10 text-blue-400', icon: <FaCheck className="mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
          Bookings Management
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {booking.vehicle?.name || 'Unknown Vehicle'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Booking ID: {booking.id.slice(0, 8)}...
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaUser className="mr-2 text-pink-400" />
                <span>
                  {booking.customerDetails?.firstName} {booking.customerDetails?.lastName}
                </span>
              </div>

              <div className="flex items-center text-gray-300">
                <FaCalendarAlt className="mr-2 text-blue-400" />
                <span>
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-gray-300">
                <FaMoneyBillWave className="mr-2 text-green-400" />
                <span>₹{booking.totalPrice}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowDetailsModal(true);
                }}
                className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600/70 transition-colors duration-300"
              >
                View Details
              </button>
              
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors duration-300"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'completed')}
                  className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors duration-300"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-white">Booking Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Vehicle</h4>
                  <p className="text-white">{selectedBooking.vehicle?.name || 'Unknown Vehicle'}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Customer</h4>
                  <p className="text-white">
                    {selectedBooking.customerDetails?.firstName} {selectedBooking.customerDetails?.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Contact</h4>
                  <p className="text-white">{selectedBooking.customerDetails?.email}</p>
                  <p className="text-white">{selectedBooking.customerDetails?.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Booking Period</h4>
                  <p className="text-white">
                    {new Date(selectedBooking.startDate).toLocaleDateString()} - {new Date(selectedBooking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Total Price</h4>
                  <p className="text-white">₹{selectedBooking.totalPrice}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Status</h4>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement; 