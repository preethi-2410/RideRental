import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, query, getDocs, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FaCalendarAlt, FaChartLine, FaCarAlt, FaMotorcycle, FaMoneyBillWave, FaPrint, FaFileExcel, FaFileExport, FaCar, FaUsers, FaClock, FaBan, FaRoute } from 'react-icons/fa';
import { format } from 'date-fns';

// Helper function to safely convert Firestore Timestamps or other date formats to JS Date
const safeConvertToDate = (timestamp) => {
  if (!timestamp) {
    return null;
  }
  // Check if it's a Firestore Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    try {
      return timestamp.toDate();
    } catch (e) {
      console.error("Error converting Firestore Timestamp to Date:", e);
      return null;
    }
  }
  // Check if it's already a JS Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  // Try converting from string or number
  try {
    const date = new Date(timestamp);
    // Check if the conversion was valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.error("Error converting timestamp string/number to Date:", e);
  }
  
  console.warn("Could not convert timestamp:", timestamp);
  return null; // Return null if conversion failed
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    totalVehicles: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    bookingTrends: [],
    vehicleUtilization: [],
    userGrowth: [],
    // New analytics states
    revenuePerVehicle: [],
    averageBookingDuration: 0,
    vehicleTypePerformance: [],
    averageLeadTime: 0,
    cancellationRate: 0,
    bookingDurationTrends: [],
    leadTimeTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [exportMessage, setExportMessage] = useState('');
  const printRef = useRef();

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to export data to CSV
  const handleCsvExport = () => {
    try {
      setExportMessage('Preparing CSV export...');
      
      if (analytics.bookingTrends.length === 0) {
        setExportMessage('No booking data available to export');
        setTimeout(() => setExportMessage(''), 3000);
        return;
      }
      
      // Create a more comprehensive data set for the export
      // First, prepare time period for the filename
      const period = timeRange === 'week' ? 'weekly' : timeRange === 'month' ? 'monthly' : 'yearly';
      
      // Create proper headers for CSV
      const csvData = [
        // Headers
        ['Date', 'Bookings'],
      ];
      
      // Add each booking as a row with complete information
      analytics.bookingTrends.forEach(trend => {
        // Add row to CSV data
        csvData.push([
          trend.date,
          trend.count.toString()
        ]);
      });
      
      // Convert to CSV string - handle commas in text fields by quoting values
      const csvContent = csvData.map(row => 
        row.map(cell => {
          // If cell contains commas, quotes or newlines, wrap in quotes and escape any quotes
          if (cell && (String(cell).includes(',') || String(cell).includes('"') || String(cell).includes('\n'))) {
            return `"${String(cell).replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      ).join('\n');
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // Use simple Date constructor for filename
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      link.setAttribute('download', `vehicle_rental_${period}_report_${dateStr}.csv`);
      
      document.body.appendChild(link);
      
      // Trigger download and cleanup
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
      
      setExportMessage('CSV exported successfully!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setExportMessage('Error exporting CSV: ' + err.message);
      setTimeout(() => setExportMessage(''), 5000);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const now = new Date();
      const analyticsEndDate = new Date(now);
      const analyticsStartDate = new Date(now);
        
        if (timeRange === 'week') {
        analyticsStartDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'month') {
        analyticsStartDate.setMonth(now.getMonth() - 1);
      } else { // quarter
        analyticsStartDate.setMonth(now.getMonth() - 3);
      }
      // Ensure start date is not in the future (edge case)
      if (analyticsStartDate > analyticsEndDate) {
          analyticsStartDate.setTime(analyticsEndDate.getTime());
      }

      const [bookingsSnapshot, vehiclesSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'vehicles')),
        getDocs(collection(db, 'users'))
      ]);

      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const vehicles = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter recent bookings
      const recentBookings = bookings.filter(booking => {
        const bookingDate = safeConvertToDate(booking.createdAt);
        return bookingDate && bookingDate >= analyticsStartDate;
      });

      // Calculate existing analytics
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
      const activeBookings = bookings.filter(booking => 
        ['pending', 'confirmed'].includes(booking.status)
      ).length;
      const monthlyRevenue = recentBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

      // Calculate new analytics
      const revenuePerVehicle = calculateRevenuePerVehicle(recentBookings, vehicles);
      const averageBookingDuration = calculateAverageBookingDuration(recentBookings);
      const vehicleTypePerformance = calculateVehicleTypePerformance(recentBookings, vehicles);
      const { averageLeadTime, leadTimeTrends } = calculateBookingLeadTime(recentBookings);
      const cancellationRate = calculateCancellationRate(recentBookings);
      const bookingDurationTrends = calculateBookingDurationTrends(recentBookings, timeRange);

      // Calculate existing trends
      const bookingTrends = calculateTrends(bookings, timeRange);
      const vehicleUtilization = calculateVehicleUtilization(bookings, vehiclesSnapshot.docs, analyticsStartDate, analyticsEndDate);
      const userGrowth = calculateUserGrowth(usersSnapshot.docs, timeRange);

      setAnalytics({
        totalBookings,
        totalRevenue,
        activeBookings,
        totalVehicles: vehiclesSnapshot.size,
        totalUsers: usersSnapshot.size,
        monthlyRevenue,
        bookingTrends,
        vehicleUtilization,
        userGrowth,
        // New analytics
        revenuePerVehicle,
        averageBookingDuration,
        vehicleTypePerformance,
        averageLeadTime,
        cancellationRate,
        bookingDurationTrends,
        leadTimeTrends
      });
      } catch (err) {
      setError('Failed to load analytics: ' + err.message);
      console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
  const calculateTrends = (bookings, range) => {
    const now = new Date();
    const data = [];
    
    if (range === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayBookings = bookings.filter(booking => {
          // Use safe date conversion
          const bookingDate = safeConvertToDate(booking.createdAt);
          return bookingDate && bookingDate.toDateString() === date.toDateString();
        });
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: dayBookings.length
        });
      }
            } else {
      const months = range === 'month' ? 1 : 3;
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthBookings = bookings.filter(booking => {
          // Use safe date conversion
          const bookingDate = safeConvertToDate(booking.createdAt);
          return bookingDate && bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        });
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          count: monthBookings.length
        });
      }
    }
    
    return data;
  };

  // Updated function to correctly calculate utilization within the given date range
  const calculateVehicleUtilization = (bookings, vehicles, analyticsStart, analyticsEnd) => {
    const utilization = {};
    // Calculate the actual number of days in the analytics period
    const totalDaysInMillis = analyticsEnd.getTime() - analyticsStart.getTime();
    const totalDaysInPeriod = Math.max(1, Math.ceil(totalDaysInMillis / (1000 * 60 * 60 * 24))); // Ensure at least 1 day

    vehicles.forEach(vehicle => {
      const vehicleId = vehicle.id;
      const vehicleName = vehicle.data()?.name || `Vehicle ${vehicleId}`; // Fallback name
      
      // Filter bookings for the current vehicle
      const vehicleBookings = bookings.filter(booking => booking.vehicleId === vehicleId);
      
      // Calculate booked days within the analytics period
      const bookedDays = vehicleBookings.reduce((totalBookedDuration, booking) => {
        const bookingStart = safeConvertToDate(booking.startDate);
        const bookingEnd = safeConvertToDate(booking.endDate);

        // Skip if dates are invalid or booking is outside the period entirely
        if (!bookingStart || !bookingEnd || bookingEnd <= analyticsStart || bookingStart >= analyticsEnd) {
          return totalBookedDuration;
        }

        // Calculate the intersection of the booking period and the analytics period
        const effectiveStart = new Date(Math.max(bookingStart.getTime(), analyticsStart.getTime()));
        const effectiveEnd = new Date(Math.min(bookingEnd.getTime(), analyticsEnd.getTime()));

        // Calculate duration of the intersection in days
        const durationInMillis = effectiveEnd.getTime() - effectiveStart.getTime();
        const durationInDays = Math.ceil(durationInMillis / (1000 * 60 * 60 * 24)); 
        
        return totalBookedDuration + Math.max(0, durationInDays); // Ensure duration is not negative

      }, 0);
      
      // Calculate utilization percentage
      const percentage = totalDaysInPeriod > 0 ? (bookedDays / totalDaysInPeriod) * 100 : 0;
      utilization[vehicleName] = Math.min(100, Math.max(0, percentage)); // Clamp between 0 and 100
    });
    
    // Sort by utilization percentage (descending) and return top 5
    return Object.entries(utilization)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const calculateUserGrowth = (users, range) => {
    const now = new Date();
    const data = [];
    const startDate = new Date();
    // Determine the correct start date calculation based on range
    if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
            } else {
      startDate.setMonth(now.getMonth() - (range === 'month' ? 1 : 3));
    }
    
    if (range === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayUsers = users.filter(user => {
          // Use safe date conversion for user createdAt
          const userDate = safeConvertToDate(user.data()?.createdAt);
          return userDate && userDate.toDateString() === date.toDateString();
        });
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: dayUsers.length
        });
      }
    } else {
      const months = range === 'month' ? 1 : 3;
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthUsers = users.filter(user => {
          // Use safe date conversion for user createdAt
          const userDate = safeConvertToDate(user.data()?.createdAt);
          return userDate && userDate.getMonth() === date.getMonth() && 
                 userDate.getFullYear() === date.getFullYear();
        });
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          count: monthUsers.length
        });
      }
    }
    
    return data;
  };

  // New calculation functions
  const calculateRevenuePerVehicle = (bookings, vehicles) => {
    const revenue = {};
    vehicles.forEach(vehicle => {
      const vehicleBookings = bookings.filter(b => b.vehicleId === vehicle.id);
      revenue[vehicle.name] = vehicleBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    });
    return Object.entries(revenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const calculateAverageBookingDuration = (bookings) => {
    if (bookings.length === 0) return 0;
    const totalDuration = bookings.reduce((sum, booking) => {
      const start = safeConvertToDate(booking.startDate);
      const end = safeConvertToDate(booking.endDate);
      if (!start || !end) return sum;
      return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, 0);
    return totalDuration / bookings.length;
  };

  const calculateVehicleTypePerformance = (bookings, vehicles) => {
    const typeStats = {};
    bookings.forEach(booking => {
      const vehicle = vehicles.find(v => v.id === booking.vehicleId);
      if (vehicle && vehicle.type) {
        if (!typeStats[vehicle.type]) {
          typeStats[vehicle.type] = { bookings: 0, revenue: 0 };
        }
        typeStats[vehicle.type].bookings++;
        typeStats[vehicle.type].revenue += booking.totalPrice || 0;
      }
    });
    return Object.entries(typeStats);
  };

  const calculateBookingLeadTime = (bookings) => {
    const leadTimes = [];
    let totalLeadTime = 0;
    const trends = [];
    
    bookings.forEach(booking => {
      const createdAt = safeConvertToDate(booking.createdAt);
      const startDate = safeConvertToDate(booking.startDate);
      if (createdAt && startDate) {
        const leadTime = Math.ceil((startDate - createdAt) / (1000 * 60 * 60 * 24));
        leadTimes.push(leadTime);
        totalLeadTime += leadTime;
      }
    });

    // Calculate trends by week
    const weeklyLeadTimes = {};
    bookings.forEach(booking => {
      const createdAt = safeConvertToDate(booking.createdAt);
      if (createdAt) {
        const weekKey = format(createdAt, 'yyyy-MM-dd');
        if (!weeklyLeadTimes[weekKey]) weeklyLeadTimes[weekKey] = [];
        const startDate = safeConvertToDate(booking.startDate);
        if (startDate) {
          const leadTime = Math.ceil((startDate - createdAt) / (1000 * 60 * 60 * 24));
          weeklyLeadTimes[weekKey].push(leadTime);
        }
      }
    });

    Object.entries(weeklyLeadTimes).forEach(([date, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      trends.push({ date, avgLeadTime: avg });
    });
    
    return {
      averageLeadTime: leadTimes.length ? totalLeadTime / leadTimes.length : 0,
      leadTimeTrends: trends.sort((a, b) => new Date(a.date) - new Date(b.date))
    };
  };

  const calculateCancellationRate = (bookings) => {
    if (bookings.length === 0) return 0;
    const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
    return (cancelledBookings / bookings.length) * 100;
  };

  const calculateBookingDurationTrends = (bookings, range) => {
    const trends = [];
    const now = new Date();
    
    if (range === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayBookings = bookings.filter(booking => {
          const bookingDate = safeConvertToDate(booking.createdAt);
          return bookingDate && bookingDate.toDateString() === date.toDateString();
        });
        
        const avgDuration = dayBookings.length ? calculateAverageBookingDuration(dayBookings) : 0;
        
        trends.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          avgDuration
        });
      }
    } else {
      const months = range === 'month' ? 1 : 3;
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthBookings = bookings.filter(booking => {
          const bookingDate = safeConvertToDate(booking.createdAt);
          return bookingDate && 
                 bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        });
        
        const avgDuration = monthBookings.length ? calculateAverageBookingDuration(monthBookings) : 0;
        
        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          avgDuration
        });
      }
    }
    
    return trends;
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
    <div className="container mx-auto p-4 no-print">
      {exportMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 no-print">{exportMessage}</div>}
      
      <div className="analytics-content">
        {/* Print Header - only visible when printing */}
        <div className="print-header hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-center">Vehicle Rental Analytics Report</h1>
          <p className="text-center text-gray-600">
            {timeRange === 'week' 
              ? 'Weekly Report - Last 7 days' 
              : timeRange === 'month' 
              ? 'Monthly Report - Last 4 weeks' 
              : 'Yearly Report - Last 6 months'}
          </p>
          <p className="text-center text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="space-x-2">
            <div className="inline-flex space-x-2 mr-4">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'quarter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Quarter
              </button>
            </div>
            {/* Add refresh button */}
            <button
              onClick={() => {
                setLoading(true);
                setError('');
                setTimeout(() => {
                  const fetchData = async () => {
                    try {
                      // Get date range based on selected time range
                      const now = new Date();
                      let startDate;
                      
                      if (timeRange === 'week') {
                        startDate = new Date(now);
                        startDate.setDate(now.getDate() - 7);
                      } else if (timeRange === 'month') {
                        startDate = new Date(now);
                        startDate.setMonth(now.getMonth() - 1);
                      } else if (timeRange === 'quarter') {
                        startDate = new Date(now);
                        startDate.setMonth(now.getMonth() - 3);
                      }

                      // Fetch all bookings
                      const allBookingsSnapshot = await getDocs(collection(db, 'bookings'));
                      const allBookingsData = allBookingsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                      }));
                      
                      console.log(`Refreshed: Fetched ${allBookingsData.length} total bookings`);
                      
                      // Filter bookings by date range client-side
                      const filteredBookings = allBookingsData.filter(booking => {
                        try {
                          let bookingDate;
                          
                          if (booking.createdAt instanceof Timestamp) {
                            bookingDate = booking.createdAt.toDate();
                          } else if (booking.createdAt instanceof Date) {
                            bookingDate = booking.createdAt;
                          } else if (typeof booking.createdAt === 'string') {
                            bookingDate = new Date(booking.createdAt);
                          } else {
                            return false;
                          }
                          
                          return bookingDate >= startDate;
                        } catch (e) {
                          console.error('Error filtering booking by date:', e);
                          return false;
                        }
                      });
                      
                      console.log(`Refreshed: Filtered to ${filteredBookings.length} bookings for the ${timeRange} period`);
                      
                      if (filteredBookings.length === 0) {
                        setError("No booking data found for the selected time period. You may need to adjust the time range or add more bookings.");
                      } else {
                        setError('');
                      }
                      
                      fetchAnalytics();
                      
                    } catch (err) {
                      console.error('Error refreshing data:', err);
                      setError('Failed to refresh analytics data: ' + err.message);
                    } finally {
                      setLoading(false);
                    }
                  };
                  
                  fetchData();
                }, 500);
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              <FaPrint className="inline mr-2" /> Print Report
            </button>
            <button
              onClick={handleCsvExport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              <FaFileExport className="inline mr-2" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Summary Cards - Now with 8 cards in 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print-cols">
          {/* Total Revenue Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  ₹{analytics.totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <FaMoneyBillWave className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-800">{analytics.totalBookings}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <FaCalendarAlt className="text-green-500 text-xl" />
              </div>
            </div>
          </div>

          {/* Vehicles Count Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Vehicles</p>
                <h3 className="text-2xl font-bold text-gray-800">{analytics.totalVehicles}</h3>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <FaCar className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>

          {/* Utilization Rate Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Top Vehicle</p>
                <h3 className="text-2xl font-bold text-gray-800 truncate" style={{maxWidth: '180px'}}>
                  {analytics.vehicleUtilization.length > 0 ? analytics.vehicleUtilization[0][0] : 'N/A'}
                </h3>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <FaChartLine className="text-yellow-500 text-xl" />
              </div>
            </div>
          </div>

          {/* New stat cards */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Booking Duration</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analytics.averageBookingDuration.toFixed(1)} days
                </h3>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <FaRoute className="text-indigo-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-pink-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Lead Time</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analytics.averageLeadTime.toFixed(1)} days
                </h3>
              </div>
              <div className="rounded-full bg-pink-100 p-3">
                <FaClock className="text-pink-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cancellation Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analytics.cancellationRate.toFixed(1)}%
                </h3>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <FaBan className="text-red-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Top Vehicle Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  ₹{analytics.revenuePerVehicle.length > 0 ? 
                     analytics.revenuePerVehicle[0][1].toLocaleString() : '0'}
                </h3>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <FaMoneyBillWave className="text-orange-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* First Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Overview - existing */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
              <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
              <div className="h-80">
                  {analytics.bookingTrends.length > 0 ? (
                    <Bar
                      data={{
                        labels: analytics.bookingTrends.map(trend => trend.date),
                        datasets: [
                          {
                            label: 'Bookings',
                            data: analytics.bookingTrends.map(trend => trend.count),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            borderColor: 'rgba(53, 162, 235, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                            text: `Bookings ${
                            timeRange === 'week'
                              ? 'This Week'
                              : timeRange === 'month'
                                ? 'This Month'
                                : 'This Quarter'
                          }`,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                              text: 'Number of Bookings',
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No booking data available</p>
                        <p className="text-sm text-gray-400">Try adjusting the time period or adding more bookings</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

              {/* Vehicle Type Performance */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
                <h3 className="text-lg font-semibold mb-4">Vehicle Type Performance</h3>
                <div className="h-80">
                  {analytics.vehicleTypePerformance.length > 0 ? (
                    <Bar
                      data={{
                        labels: analytics.vehicleTypePerformance.map(([type]) => type),
                        datasets: [
                          {
                            label: 'Bookings',
                            data: analytics.vehicleTypePerformance.map(([, data]) => data.bookings),
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            yAxisID: 'y',
                          },
                          {
                            label: 'Revenue (₹)',
                            data: analytics.vehicleTypePerformance.map(([, data]) => data.revenue),
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'y1',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Bookings and Revenue by Vehicle Type',
                          },
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                              display: true,
                              text: 'Number of Bookings',
                            },
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                              display: true,
                              text: 'Revenue (₹)',
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No vehicle type data available</p>
                        <p className="text-sm text-gray-400">Add vehicle types to see performance</p>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>

            {/* Second Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Vehicle Utilization - existing */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
                <h3 className="text-lg font-semibold mb-4">Vehicle Utilization</h3>
                <div className="h-64">
                  {analytics.vehicleUtilization.length > 0 ? (
                    // Use Bar chart component
                    <Bar
                      data={{
                        labels: analytics.vehicleUtilization.map(item => item[0]), // Vehicle Names
                        datasets: [
                          {
                            label: 'Utilization %',
                            data: analytics.vehicleUtilization.map(item => item[1]), // Percentages
                            backgroundColor: [
                              'rgba(75, 192, 192, 0.5)', // Keep colors or simplify
                              'rgba(54, 162, 235, 0.5)',
                              'rgba(255, 206, 86, 0.5)',
                              'rgba(153, 102, 255, 0.5)',
                              'rgba(255, 159, 64, 0.5)'
                            ],
                            borderColor: [
                              'rgba(75, 192, 192, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        indexAxis: 'y', // Optional: Makes it a horizontal bar chart for better readability
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false, // Legend not needed for single dataset bar chart
                          },
                          title: {
                            display: true,
                            text: 'Top 5 Vehicle Utilization',
                          },
                          tooltip: {
                             callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.x !== null) {
                                        label += context.parsed.x.toFixed(2) + '%';
                                    }
                                    return label;
                                }
                              }
                          }
                        },
                        scales: {
                          x: { // Now represents the percentage axis
                            beginAtZero: true,
                            max: 100, // Ensure scale goes up to 100%
                            title: {
                              display: true,
                              text: 'Utilization Percentage',
                            },
                          },
                          y: { // Now represents the vehicle axis
                             title: {
                              display: false, // Labels are self-explanatory
                            },
                          }
                        },
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No utilization data available</p>
                        <p className="text-sm text-gray-400">Add more bookings to see which vehicles are most popular</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

              {/* Revenue per Vehicle */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
                <h3 className="text-lg font-semibold mb-4">Top 5 Revenue Generating Vehicles</h3>
                <div className="h-64">
                  {analytics.revenuePerVehicle.length > 0 ? (
                    <Bar
                      data={{
                        labels: analytics.revenuePerVehicle.map(item => item[0]),
                        datasets: [
                          {
                            label: 'Revenue (₹)',
                            data: analytics.revenuePerVehicle.map(item => item[1]),
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                          title: {
                            display: true,
                              text: 'Revenue (₹)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No revenue data available</p>
                        <p className="text-sm text-gray-400">Add bookings to see revenue per vehicle</p>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>

            {/* Third Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Booking Duration Trends */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
                <h3 className="text-lg font-semibold mb-4">Average Booking Duration Trends</h3>
                <div className="h-64">
                  {analytics.bookingDurationTrends.length > 0 ? (
                    <Bar
                      data={{
                        labels: analytics.bookingDurationTrends.map(trend => trend.date),
                        datasets: [
                          {
                            label: 'Average Duration (days)',
                            data: analytics.bookingDurationTrends.map(trend => trend.avgDuration),
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          title: {
                            display: true,
                              text: 'Average Duration (days)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No booking duration data available</p>
                        <p className="text-sm text-gray-400">Add bookings to see duration trends</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lead Time Trends */}
              <div className="bg-white p-6 rounded-lg shadow-md charts-container">
                <h3 className="text-lg font-semibold mb-4">Booking Lead Time Trends</h3>
                <div className="h-64">
                  {analytics.leadTimeTrends.length > 0 ? (
                    <Bar
                      data={{
                        labels: analytics.leadTimeTrends.map(trend => trend.date),
                        datasets: [
                          {
                            label: 'Average Lead Time (days)',
                            data: analytics.leadTimeTrends.map(trend => trend.avgLeadTime),
                            backgroundColor: 'rgba(255, 159, 64, 0.5)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Average Lead Time (days)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center p-6">
                        <p className="text-gray-500 mb-3">No lead time data available</p>
                        <p className="text-sm text-gray-400">Add bookings to see lead time trends</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Growth - existing */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 charts-container">
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <div className="h-64">
                {analytics.userGrowth.length > 0 ? (
                  <Bar
                    data={{
                      labels: analytics.userGrowth.map(item => item.date),
                      datasets: [
                        {
                          label: 'New Users',
                          data: analytics.userGrowth.map(item => item.count),
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'New Users',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Users',
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center p-6">
                      <p className="text-gray-500 mb-3">No user growth data available</p>
                      <p className="text-sm text-gray-400">Add more users to see the growth</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Summary - existing */}
            <div className="analytics-summary bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Analytics Summary</h3>
              <p><strong>Total Vehicles:</strong> {analytics.totalVehicles}</p>
              <p><strong>Total Bookings:</strong> {analytics.totalBookings}</p>
              <p><strong>Time Period:</strong> {
                timeRange === 'week' 
                  ? 'Last 7 days' 
                  : timeRange === 'month' 
                  ? 'Last 4 weeks' 
                  : 'Last 3 months'
              }</p>
              <p><strong>Total Revenue:</strong> ₹{analytics.totalRevenue.toLocaleString()}</p>
              <p><strong>Most Popular Vehicle:</strong> {analytics.vehicleUtilization.length > 0 ? analytics.vehicleUtilization[0][0] : 'N/A'}</p>
              <p><strong>Report Generated:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Average Booking Duration:</strong> {analytics.averageBookingDuration.toFixed(1)} days</p>
              <p><strong>Average Lead Time:</strong> {analytics.averageLeadTime.toFixed(1)} days</p>
              <p><strong>Cancellation Rate:</strong> {analytics.cancellationRate.toFixed(1)}%</p>
              <p><strong>Top Revenue Vehicle:</strong> {analytics.revenuePerVehicle.length > 0 ? 
                `${analytics.revenuePerVehicle[0][0]} (₹${analytics.revenuePerVehicle[0][1].toLocaleString()})` : 'N/A'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 