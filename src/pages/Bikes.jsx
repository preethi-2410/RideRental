import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaMotorcycle, FaGasPump, FaCog, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import BackgroundGraphics from '../components/BackgroundGraphics';
import LoadingState from '../components/ui/LoadingState';
import { useToast } from '../context/ToastContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const Bikes = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);
  const [pickupLocation, setPickupLocation] = useState(queryParams.get('location') || '');
  const [pickupDate, setPickupDate] = useState(queryParams.get('start') || '');
  const [returnDate, setReturnDate] = useState(queryParams.get('end') || '');
  const [showAll, setShowAll] = useState(queryParams.get('showAll') === 'true');

  // Load bikes from Firebase
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const vehiclesRef = collection(db, 'vehicles');
        const q = query(vehiclesRef, where('type', '==', 'bike'));
        const querySnapshot = await getDocs(q);
        
        const bikesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort vehicles by name
        const sortedVehicles = bikesData.sort((a, b) => a.name.localeCompare(b.name));
        
        setVehicles(sortedVehicles);
        console.log('Loaded bikes:', sortedVehicles);
      } catch (err) {
        console.error('Error loading bikes:', err);
        setError('Failed to load bikes. Please try again later.');
        showToast('Failed to load bikes. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  // Get unique brands
  const brands = Array.from(new Set(vehicles.map(vehicle => vehicle.brand)));
  
  // Get unique fuel types
  const fuelTypes = Array.from(new Set(vehicles.map(vehicle => vehicle.fuel)));

  const toggleBrand = (brand) => {
    if (selectedBrand.includes(brand)) {
      setSelectedBrand(selectedBrand.filter(b => b !== brand));
    } else {
      setSelectedBrand([...selectedBrand, brand]);
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
    setPriceRange([0, 5000]);
    setSelectedBrand([]);
    setSelectedFuel([]);
    setSearchTerm('');
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (pickupLocation && pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    
    const matchesBrand = selectedBrand.length === 0 || 
                         selectedBrand.includes(vehicle.brand);
    
    const matchesFuel = selectedFuel.length === 0 || 
                        selectedFuel.includes(vehicle.fuel);
    
    return matchesSearch && matchesPrice && matchesBrand && matchesFuel;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
        <BackgroundGraphics variant="bikes" />
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Loading Bikes
            </h1>
          </div>
          <LoadingState type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <BackgroundGraphics variant="bikes" />
      
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading bikes...</p>
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
            Rent a Bike in Andhra & Telangana
          </h1>
          <p className="text-gray-400 text-lg">
            Choose from our wide selection of bikes for your journey
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
                  placeholder="Search by bike name or location..."
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
                    max="5000"
                    step="100"
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

              {/* Brand */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedBrand.includes(brand)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {brand}
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
        {(searchTerm || priceRange[1] < 5000 || selectedBrand.length > 0 || selectedFuel.length > 0) && (
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 mb-8 border border-white/10">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-gray-400">Showing results for:</span>
              {searchTerm && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaSearch className="text-blue-400" />
                  {searchTerm}
                </span>
              )}
              {priceRange[1] < 5000 && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaRupeeSign className="text-blue-400" />
                  Up to ₹{priceRange[1]}
                </span>
              )}
              {selectedBrand.length > 0 && (
                <span className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <FaMotorcycle className="text-blue-400" />
                  {selectedBrand.join(', ')}
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
            <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
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

export default Bikes; 