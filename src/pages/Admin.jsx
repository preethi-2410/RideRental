import React, { useState, useEffect } from 'react';
import { seedVehicles } from '../firebase/seed';
import { removeDuplicateVehicles } from '../firebase/cleanup';
import { addNewVehicles } from '../firebase/addVehicles';
import { createBooking } from '../firebase/bookings';
import { getAvailableVehicles } from '../firebase/vehicles';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaCar, FaCalendarAlt, FaUsers, FaDatabase, FaChartLine, FaTrash, FaEdit, FaFilter } from 'react-icons/fa';
import { collection, addDoc, Timestamp, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import BackgroundGraphics from '../components/BackgroundGraphics';
import { checkAndMigrateData } from '../firebase/vehicleDataMigration';

// Import admin components
import DashboardOverview from '../components/admin/DashboardOverview';
import VehiclesManagement from '../components/admin/VehiclesManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import UsersManagement from '../components/admin/UsersManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

// Database Management Tab
const DatabaseManagementTab = ({ loading, setLoading, message, setMessage, vehicles }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState({
    name: '',
    type: 'car',
    pricePerDay: '',
    description: '',
    imageUrl: '',
    available: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddVehicles = async () => {
    try {
      setLoading(true);
      setMessage('Adding new vehicles...');
      await addNewVehicles();
      setMessage('Successfully added new vehicles!');
    } catch (error) {
      console.error('Error adding vehicles:', error);
      setMessage('Error adding vehicles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVehicles = async () => {
    try {
      setLoading(true);
      setMessage('Removing vehicles...');
      const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesToRemove = vehiclesSnapshot.docs.map(doc => doc.id);
      
      for (const vehicleId of vehiclesToRemove) {
        await deleteDoc(doc(db, 'vehicles', vehicleId));
      }
      
      setMessage('Successfully removed all vehicles!');
    } catch (error) {
      console.error('Error removing vehicles:', error);
      setMessage('Error removing vehicles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicleDetails = async () => {
    try {
      setLoading(true);
      setMessage('Updating vehicle details...');
      const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
      
      for (const doc of vehiclesSnapshot.docs) {
        const vehicleData = doc.data();
        await updateDoc(doc.ref, {
          ...vehicleData,
          updatedAt: Timestamp.now()
        });
      }
      
      setMessage('Successfully updated all vehicle details!');
    } catch (error) {
      console.error('Error updating vehicles:', error);
      setMessage('Error updating vehicles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    try {
      setLoading(true);
      setMessage('Removing duplicate vehicles...');
      await removeDuplicateVehicles();
      setMessage('Successfully removed duplicate vehicles!');
    } catch (error) {
      console.error('Error removing duplicates:', error);
      setMessage('Error removing duplicates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('Adding vehicle...');
      await addDoc(collection(db, 'vehicles'), vehicleDetails);
      setMessage('Successfully added vehicle!');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setMessage('Error adding vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleDetails(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMigrateData = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Starting data migration from Admin component...');
      const result = await checkAndMigrateData();
      if (result) {
        console.log('Migration completed successfully');
        setSuccess('Vehicle data migrated successfully!');
      } else {
        console.error('Migration failed');
        setError('Failed to migrate vehicle data. Please check the console for details.');
      }
    } catch (err) {
      console.error('Error in handleMigrateData:', err);
      setError('Error migrating vehicle data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 mb-8">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-6">
        Database Management
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Vehicles Card */}
        <div className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <FaCar className="text-2xl text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Add Vehicles</h3>
              <p className="text-gray-300 mb-4">Add a new vehicle to the database.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors duration-300"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Remove Vehicles Card */}
        <div className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <FaTrash className="text-2xl text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Remove Vehicles</h3>
              <p className="text-gray-300 mb-4">Remove all vehicles from the database. This action cannot be undone.</p>
              <button
                onClick={handleRemoveVehicles}
                disabled={loading}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove All Vehicles'}
              </button>
            </div>
          </div>
        </div>

        {/* Update Vehicle Details Card */}
        <div className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <FaEdit className="text-2xl text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Update Vehicle Details</h3>
              <p className="text-gray-300 mb-4">Update all vehicle details with the latest information.</p>
              <button
                onClick={handleUpdateVehicleDetails}
                disabled={loading}
                className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update All Vehicles'}
              </button>
            </div>
          </div>
        </div>

        {/* Remove Duplicates Card */}
        <div className="bg-gray-700/30 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <FaFilter className="text-2xl text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Remove Duplicates</h3>
              <p className="text-gray-300 mb-4">Remove duplicate vehicles from the database based on matching criteria.</p>
              <button
                onClick={handleRemoveDuplicates}
                disabled={loading}
                className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/20 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove Duplicates'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Vehicle Data Migration</h3>
            <FaDatabase className="text-blue-400 text-2xl" />
          </div>
          <p className="text-gray-300 mb-4">
            Migrate vehicle data from JSON files to Firebase database.
          </p>
          <button
            onClick={handleMigrateData}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Migrating...' : 'Migrate Data'}
          </button>
          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-green-400 text-sm">{success}</p>
          )}
        </div>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {message}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={vehicleDetails.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Vehicle Type</label>
                <select
                  name="type"
                  value={vehicleDetails.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Price Per Day (₹)</label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={vehicleDetails.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={vehicleDetails.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={vehicleDetails.imageUrl}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={vehicleDetails.available}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-300">Available for Rent</label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700/70 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Load a few vehicles for the test booking function
    const loadVehicles = async () => {
      try {
        const availableVehicles = await getAvailableVehicles();
        console.log('Available vehicles for test booking:', availableVehicles);
        setVehicles(availableVehicles.slice(0, 5)); // Just take the first 5
      } catch (error) {
        console.error('Error loading vehicles for test booking:', error);
      }
    };
    
    loadVehicles();
  }, []);
  
  // If user is not admin, display an error message
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <BackgroundGraphics variant="default" />
        <div className="bg-red-500/10 backdrop-blur-lg p-6 rounded-xl border border-red-500/20">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabContent = {
    dashboard: (
      <>
        <DashboardOverview />
        <DatabaseManagementTab 
          loading={loading} 
          setLoading={setLoading} 
          message={message} 
          setMessage={setMessage} 
          vehicles={vehicles} 
        />
      </>
    ),
    vehicles: <VehiclesManagement />,
    bookings: <BookingsManagement />,
    users: <UsersManagement />,
    analytics: <AnalyticsDashboard />
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <BackgroundGraphics variant="default" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-8">
          Admin Dashboard
        </h1>
      
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center py-2 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-gray-800/30 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <FaHome className="mr-2" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center py-2 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'vehicles'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-gray-800/30 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <FaCar className="mr-2" /> Vehicles
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center py-2 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-gray-800/30 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <FaCalendarAlt className="mr-2" /> Bookings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center py-2 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-gray-800/30 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <FaUsers className="mr-2" /> Users
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center py-2 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-gray-800/30 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <FaChartLine className="mr-2" /> Analytics
          </button>
        </div>
        
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default Admin; 