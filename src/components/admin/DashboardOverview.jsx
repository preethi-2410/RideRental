import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCar, FaUsers, FaMoneyBillWave, FaCalendarCheck, FaCreditCard, FaChartLine } from 'react-icons/fa';
import { FaMotorcycle } from 'react-icons/fa6';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalCars: 0,
    totalBikes: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    paidBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get vehicles stats
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        const vehicles = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const totalVehicles = vehicles.length;
        const totalCars = vehicles.filter(v => v.type === 'car').length;
        const totalBikes = vehicles.filter(v => v.type === 'bike').length;
        
        // Get users stats
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;
        
        // Get bookings stats
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const bookings = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;
        
        // Calculate total revenue from paid bookings
        const totalRevenue = bookings
          .filter(booking => booking.paymentStatus === 'paid')
          .reduce((total, booking) => total + (booking.totalPrice || 0), 0);
        
        // Get recent bookings
        const recentBookingsQuery = query(
          collection(db, 'bookings'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const recentBookingsSnapshot = await getDocs(recentBookingsQuery);
        const recentBookingsData = recentBookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch vehicle info for each booking
        const recentBookingsWithVehicle = await Promise.all(
          recentBookingsData.map(async (booking) => {
            try {
              const vehicleDoc = await getDocs(
                query(collection(db, 'vehicles'), where('id', '==', booking.vehicleId))
              );
              
              let vehicleName = 'Unknown Vehicle';
              if (!vehicleDoc.empty) {
                vehicleName = vehicleDoc.docs[0].data().name;
              }
              
              return {
                ...booking,
                vehicleName
              };
            } catch (err) {
              console.error('Error fetching vehicle for booking:', err);
              return {
                ...booking,
                vehicleName: 'Unknown Vehicle'
              };
            }
          })
        );
        
        setRecentBookings(recentBookingsWithVehicle);
        
        setStats({
          totalVehicles,
          totalCars,
          totalBikes,
          totalUsers,
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue,
          paidBookings
        });
      } catch (err) {
        setError('Failed to load dashboard data: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-8">
        Dashboard Overview
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-pink-500/10 rounded-full p-3">
              <FaCar className="text-2xl text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Cars</p>
              <p className="text-2xl font-bold text-white">{stats.totalCars}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 rounded-full p-3">
              <FaMotorcycle className="text-2xl text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bikes</p>
              <p className="text-2xl font-bold text-white">{stats.totalBikes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 rounded-full p-3">
              <FaUsers className="text-2xl text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/10 rounded-full p-3">
              <FaCalendarCheck className="text-2xl text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/10 rounded-full p-3">
              <FaCalendarCheck className="text-2xl text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/10 rounded-full p-3">
              <FaCalendarCheck className="text-2xl text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 rounded-full p-3">
              <FaCreditCard className="text-2xl text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Paid Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.paidBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-red-500/10 rounded-full p-3">
              <FaMoneyBillWave className="text-2xl text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Info Card */}
      <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl border border-pink-500/20 p-6 mb-8 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full">
            <FaChartLine className="text-2xl text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics Dashboard Available</h3>
            <p className="text-gray-300 mb-4">View detailed analytics about your vehicle rentals, bookings, and revenue.</p>
            <div className="flex flex-col space-y-2 text-sm">
              <p className="text-gray-300">To get started with analytics:</p>
              <ol className="list-decimal list-inside pl-2 space-y-1 text-gray-400">
                <li>Click on the 'Analytics' tab above</li>
                <li>Add vehicles and make bookings to see stats</li>
                <li>Use the time filters to analyze different periods</li>
                <li>Export your reports as CSV or print them</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Bookings</h3>
        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-4 transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">
                      {booking.vehicleName || 'Unknown Vehicle'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <span className="text-white font-medium">
                      ₹{booking.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recent bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview; 