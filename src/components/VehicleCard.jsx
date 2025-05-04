import React from 'react';
import { Link } from 'react-router-dom';
import { FaGasPump, FaCar, FaUsers } from 'react-icons/fa';

const VehicleCard = ({ vehicle, bookingData }) => {
  // Use the Firestore document ID from the vehicle object
  const { name, type, imageUrl, price, seats, transmission, fuel, rating } = vehicle;
  const { location, startDate, endDate } = bookingData || {};

  console.log('VehicleCard - Vehicle data:', vehicle);
  console.log('VehicleCard - Vehicle ID:', vehicle.id);

  // Construct booking URL with parameters
  const bookingUrl = `/vehicle/${vehicle.id}${location ? `?location=${encodeURIComponent(location)}` : ''}${
    startDate ? `&start=${encodeURIComponent(startDate)}` : ''
  }${endDate ? `&end=${encodeURIComponent(endDate)}` : ''}`;

  console.log('VehicleCard - Generated URL:', bookingUrl);

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl || (type === 'car' ? '/car-placeholder.jpg' : '/bike-placeholder.jpg')} 
          alt={name}
          className="w-full h-52 object-cover transform transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = type === 'car' ? '/car-placeholder.jpg' : '/bike-placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-white">{rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {seats && (
            <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
              <FaUsers className="mr-2 text-blue-400" />
              <span>{seats} seats</span>
            </div>
          )}
          {transmission && (
            <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
              <FaCar className="mr-2 text-green-400" />
              <span>{transmission}</span>
            </div>
          )}
          {fuel && (
            <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
              <FaGasPump className="mr-2 text-purple-400" />
              <span>{fuel}</span>
            </div>
          )}
          <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
            <span className="text-pink-400 mr-2 font-bold">{type === 'car' ? '🚗' : '🏍️'}</span>
            <span className="capitalize">{type}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <div className="text-white">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">₹{price}</span>
            <span className="text-gray-400 ml-1">/hour</span>
          </div>
          <Link
            to={bookingUrl}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard; 