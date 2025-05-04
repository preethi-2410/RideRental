import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaEdit, FaTrash, FaCar, FaMotorcycle, FaSearch, FaFilter } from 'react-icons/fa';


const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '',
    type: 'car',
    availability: true,
    imageUrl: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    availability: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filters]);

  const filterVehicles = () => {
    let filtered = [...vehicles];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(vehicle => {
        const price = Number(vehicle.price);
        return price >= min && price <= max;
      });
    }

    // Apply availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.availability === (filters.availability === 'available')
      );
    }

    setFilteredVehicles(filtered);
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesRef = collection(db, 'vehicles');
      const querySnapshot = await getDocs(vehiclesRef);
      const vehiclesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehiclesData);
      setFilteredVehicles(vehiclesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteDoc(doc(db, 'vehicles', vehicleId));
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        setError('Failed to delete vehicle. Please try again.');
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      price: vehicle.price,
      rating: vehicle.rating,
      type: vehicle.type,
      availability: vehicle.availability
    });
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        imageUrl: formData.imageUrl || null,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'vehicles', editingVehicle.id), updatedData);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError('Failed to update vehicle. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white hover:bg-gray-700/70 transition-colors"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-gray-300 mb-2">Vehicle Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-gray-300 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="0-100">Under ₹100</option>
                <option value="100-200">₹100 - ₹200</option>
                <option value="200-300">₹200 - ₹300</option>
                <option value="300-500">₹300 - ₹500</option>
                <option value="500-1000">Above ₹500</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-gray-300 mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-gray-300">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
            {/* Vehicle Image */}
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden group">
              <img
                src={vehicle.imageUrl || (vehicle.type === 'car' ? '/car-placeholder.jpg' : '/bike-placeholder.jpg')}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = vehicle.type === 'car' ? '/car-placeholder.jpg' : '/bike-placeholder.jpg';
                }}
              />
              {!vehicle.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
                  No image uploaded
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {vehicle.type === 'car' ? (
                  <FaCar className="text-blue-400 text-2xl" />
                ) : (
                  <FaMotorcycle className="text-green-400 text-2xl" />
                )}
                <h3 className="text-xl font-semibold text-white">{vehicle.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium text-white">Price:</span> ₹{vehicle.price}/hour
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Rating:</span> {vehicle.rating}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Type:</span> {vehicle.type}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Availability:</span>{' '}
                <span className={vehicle.availability ? 'text-green-400' : 'text-red-400'}>
                  {vehicle.availability ? 'Available' : 'Not Available'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-4 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Edit Vehicle</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Vehicle Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Price (₹/hour)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-gray-300">Available for Rent</label>
                </div>

                {/* Image URL Input Section */}
                <div className="space-y-1">
                  <label className="block text-gray-300 mb-1 text-sm">Vehicle Image URL</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:border-blue-500/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(formData.imageUrl || editingVehicle?.imageUrl) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                      <img
                        src={formData.imageUrl || editingVehicle.imageUrl}
                        alt="Vehicle"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = formData.type === 'car' ? '/car-placeholder.jpg' : '/bike-placeholder.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement; 