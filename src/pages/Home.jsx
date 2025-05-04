import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { FaCar, FaMotorcycle, FaShieldAlt, FaHeadset, FaStar, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import '../styles/animations.css';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section with Enhanced Glowing Effect */}
      <div className="relative overflow-hidden">
        {/* Animated background with glowing circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 animate-gradient animate-slide-in">
                Find Your Perfect Ride
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
                Experience the freedom of the open road with our premium selection of cars and bikes
              </p>
            </div>
            
            {/* Search Form with Enhanced Glow */}
            <div className="max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 animate-slide-in delay-300">
              <div className="glow-shadow rounded-2xl animate-pulse-glow">
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Vehicles with Enhanced Effects */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-slide-in">
              Featured Vehicles
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in delay-200">
              Explore our most popular vehicles that customers love
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Car */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-neon-blue group animate-slide-in delay-300">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="Featured Car" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-neon-purple">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">Toyota Camry</h3>
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Available in Hyderabad</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">₹100/hr</span>
                  <Link 
                    to="/vehicle/toyota-camry" 
                    className="flex items-center text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    View Details
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Featured Bike */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-neon-purple group animate-slide-in delay-400">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="Featured Bike" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-neon-purple">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">Royal Enfield</h3>
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span>4.9</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Available in Visakhapatnam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">₹70/hr</span>
                  <Link 
                    to="/vehicle/royal-enfield" 
                    className="flex items-center text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    View Details
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Another Featured Car */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-neon-blue group animate-slide-in delay-500">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="Featured Car" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-neon-blue">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">Honda City</h3>
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span>4.7</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Available in Vijayawada</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">₹85/hr</span>
                  <Link 
                    to="/vehicle/honda-city" 
                    className="flex items-center text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    View Details
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Enhanced Glassmorphism */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl hover:shadow-neon-blue transition-colors duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <FaCar className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">Wide Selection</h3>
              <p className="text-gray-400">Choose from a variety of cars and bikes to suit your needs and preferences</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl hover:shadow-neon-purple transition-colors duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">Best Prices</h3>
              <p className="text-gray-400">Competitive rates with no hidden charges and flexible rental options</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl hover:shadow-neon-pink transition-colors duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <FaHeadset className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">24/7 Support</h3>
              <p className="text-gray-400">Round-the-clock customer support for your convenience and peace of mind</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Enhanced Glassmorphism */}
      <div className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from our satisfied customers about their experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:shadow-neon-blue transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  RK
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Rahul Kumar</h4>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"Exceptional service! I rented a Toyota Camry for a business trip and was impressed by the car's condition and the smooth booking process. The staff was very professional and helpful."</p>
              <p className="text-blue-400 mt-4 text-sm">Hyderabad • Business Trip</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:shadow-neon-purple transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AP
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Ananya Patel</h4>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"The Royal Enfield I rented was in perfect condition! Had an amazing road trip experience. The pricing was transparent and the 24/7 support gave me peace of mind throughout the journey."</p>
              <p className="text-purple-400 mt-4 text-sm">Visakhapatnam • Road Trip</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:shadow-neon-pink transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SK
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Suresh Kumar</h4>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"Best rental service I've used! The Honda City was spotless and well-maintained. The pickup and drop-off process was quick and hassle-free. Will definitely use again!"</p>
              <p className="text-pink-400 mt-4 text-sm">Vijayawada • Weekend Getaway</p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:shadow-neon-blue transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MP
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Meera Prakash</h4>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"As a first-time renter, I was nervous, but the team made it so easy! The bike was in great condition, and their flexible rental options really helped with my budget."</p>
              <p className="text-blue-400 mt-4 text-sm">Hyderabad • Daily Commute</p>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:shadow-neon-purple transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  VR
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Vikram Reddy</h4>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"Outstanding customer service! When I had a last-minute change in plans, they were incredibly accommodating. The vehicle was clean, fuel-efficient, and perfect for my needs."</p>
              <p className="text-purple-400 mt-4 text-sm">Visakhapatnam • Family Trip</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add a Call to Action Section with Animation */}
      <div className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gray-800/30 backdrop-blur-lg p-12 rounded-2xl hover:shadow-neon-blue transition-all duration-300 animate-slide-in">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 animate-gradient">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-400 mb-8 text-xl animate-fade-in delay-200">
              Book your perfect vehicle today and experience the freedom of the open road
            </p>
            <Link 
              to="/cars" 
              className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:scale-105 transition-all duration-300 group animate-pulse-glow"
            >
              Browse Vehicles
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add these styles to your CSS/Tailwind config */}
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          background-size: 200%;
          animation: gradient 8s linear infinite;
        }
        .shadow-neon-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        .shadow-neon-purple {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        .glow-shadow {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Home; 