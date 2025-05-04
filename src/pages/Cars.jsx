import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCar, FaGasPump, FaCog, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaTachometerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import BackgroundGraphics from '../components/BackgroundGraphics';
import LoadingState from '../components/ui/LoadingState';
import { useToast } from '../context/ToastContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const Cars = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);
  const [pickupLocation, setPickupLocation] = useState(queryParams.get('location') || '');
  const [pickupDate, setPickupDate] = useState(queryParams.get('start') || '');
  const [returnDate, setReturnDate] = useState(queryParams.get('end') || '');
  const [showAll, setShowAll] = useState(queryParams.get('showAll') === 'true');

  // Load cars from Firebase
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const vehiclesRef = collection(db, 'vehicles');
        const q = query(vehiclesRef, where('type', '==', 'car'));
        const querySnapshot = await getDocs(q);
        
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort vehicles by name
        const sortedVehicles = carsData.sort((a, b) => a.name.localeCompare(b.name));
        
        setVehicles(sortedVehicles);
        console.log('Loaded cars:', sortedVehicles);
      } catch (err) {
        console.error('Error loading cars:', err);
        setError('Failed to load cars. Please try again later.');
        showToast('Failed to load cars. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Get unique transmission types
  const transmissionTypes = Array.from(new Set(vehicles.map(vehicle => vehicle.transmission)));
  
  // Get unique fuel types
  const fuelTypes = Array.from(new Set(vehicles.map(vehicle => vehicle.fuel)));

  // Effect to handle URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPickupLocation(params.get('location') || '');
    setPickupDate(params.get('start') || '');
    setReturnDate(params.get('end') || '');
    setShowAll(params.get('showAll') === 'true');
    
    // If location is provided in the URL, use it as the search term
    if (params.get('location')) {
      setSearchTerm(params.get('location') || '');
    }
  }, [location.search]);

  const toggleTransmission = (transmission) => {
    if (selectedTransmission.includes(transmission)) {
      setSelectedTransmission(selectedTransmission.filter(t => t !== transmission));
    } else {
      setSelectedTransmission([...selectedTransmission, transmission]);
    }
  };

  const toggleFuel = (fuel) => {
    if (selectedFuel.includes(fuel)) {
      setSelectedFuel(selectedFuel.filter(f => f !== fuel));
    } else {
      setSelectedFuel([...selectedFuel, fuel]);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedTransmission([]);
    setSelectedFuel([]);
    setSearchTerm('');
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (pickupLocation && pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    
    const matchesTransmission = selectedTransmission.length === 0 || 
                               (vehicle.transmission && selectedTransmission.includes(vehicle.transmission));
    
    const matchesFuel = selectedFuel.length === 0 || 
                        (vehicle.fuel && selectedFuel.includes(vehicle.fuel));
    
    return matchesSearch && matchesPrice && matchesTransmission && matchesFuel;
  });

  // Format price to Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
        <BackgroundGraphics variant="cars" />
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Loading Cars
            </h1>
          </div>
          <LoadingState type="card" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <BackgroundGraphics variant="cars" />
        <div className="bg-red-500/10 backdrop-blur-lg p-6 rounded-xl border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <BackgroundGraphics variant="cars" />
      
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading cars...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-red-500/10 p-6 rounded-lg backdrop-blur-sm border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Rent a Car in Andhra & Telangana
          </h1>
          <p className="text-gray-400 text-lg">
            Choose from our wide selection of cars for your journey
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by car name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
            >
              <FaFilter />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 mb-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Price Range (₹)</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Transmission</h3>
                <div className="flex flex-wrap gap-2">
                  {transmissionTypes.map((transmission) => (
                    <button
                      key={transmission}
                      onClick={() => toggleTransmission(transmission)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTransmission.includes(transmission)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {transmission}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Fuel Type</h3>
                <div className="flex flex-wrap gap-2">
                  {fuelTypes.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => toggleFuel(fuel)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFuel.includes(fuel)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Search Parameters Summary */}
        {(searchTerm || priceRange[1] < 10000 || selectedTransmission.length > 0 || selectedFuel.length > 0) && (
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 mb-8 border border-white/10">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-gray-400">Showing results for:</span>
              {searchTerm && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaSearch className="text-blue-400" />
                  {searchTerm}
                </span>
              )}
              {priceRange[1] < 10000 && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaRupeeSign className="text-blue-400" />
                  Up to ₹{priceRange[1]}
                </span>
              )}
              {selectedTransmission.length > 0 && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaCog className="text-blue-400" />
                  {selectedTransmission.join(', ')}
                </span>
              )}
              {selectedFuel.length > 0 && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaGasPump className="text-blue-400" />
                  {selectedFuel.join(', ')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* No Results */}
        {filteredVehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars; 