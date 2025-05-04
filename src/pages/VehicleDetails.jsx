import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaGasPump, FaCar, FaUsers } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const vehicleRef = doc(db, 'vehicles', id);
        const vehicleDoc = await getDoc(vehicleRef);

        if (vehicleDoc.exists()) {
          setVehicle({
            id: vehicleDoc.id,
            ...vehicleDoc.data()
          });
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Vehicle not found'}</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background with glowing circles */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group">
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Vehicles
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-neon-blue">
            {/* Image Gallery Section */}
            <div className="md:flex">
              <div className="md:w-3/5 relative group">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={vehicle.image || (vehicle.type === 'car' ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-neon-purple">
                  {vehicle.type === 'car' ? 'Car' : 'Bike'}
                </div>
              </div>

              {/* Details Section */}
              <div className="md:w-2/5 p-8 bg-gray-800/30">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{vehicle.name}</h1>
                      <div className="flex items-center text-yellow-400">
                        <FaStar className="mr-1" />
                        <span className="font-semibold">{vehicle.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-400 mb-6">
                      <FaMapMarkerAlt className="text-blue-400 mr-2" />
                      <span>{vehicle.location || 'Multiple locations'}</span>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-6 rounded-xl mb-6 flex-grow border border-gray-700/50">
                    <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">Vehicle Specifications</h2>
                    <div className="grid grid-cols-2 gap-6">

                    {vehicle.seats && (
                      <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                        <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                          <FaUsers className="text-blue-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Seating</div>
                          <div className="font-medium text-gray-200">{vehicle.seats} Seats</div>
                        </div>
                      </div>
                    )}
                    {vehicle.transmission && (
                      <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                        <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                          <FaCar className="text-purple-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Transmission</div>
                          <div className="font-medium text-gray-200">{vehicle.transmission}</div>
                        </div>
                      </div>
                    )}
                    {vehicle.fuelType && (
                      <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-pink-500/50 transition-colors">
                        <div className="bg-pink-900/30 p-2 rounded-lg mr-3">
                          <FaGasPump className="text-pink-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Fuel Type</div>
                          <div className="font-medium text-gray-200">{vehicle.fuelType}</div>
                        </div>
                      </div>
                    )}
                    {vehicle.availability && (
                      <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-colors">
                        <div className="bg-green-900/30 p-2 rounded-lg mr-3">
                          <FaClock className="text-green-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Availability</div>
                          <div className="font-medium text-gray-200">{vehicle.availability}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing and Booking Section */}
                <div className="mt-auto">
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-gray-400 text-sm">Price per day</div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mt-1">₹{vehicle.price}</div>
                      </div>
                      <button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-neon-purple hover:shadow-neon-blue"
                        onClick={() => navigate(`/booking/${vehicle.id}`)}
                      >
                        Book Now
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">* Price includes basic insurance and taxes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;