import { FaCar, FaMotorcycle, FaUsers, FaShieldAlt, FaClock, FaMapMarkedAlt } from 'react-icons/fa';
import BackgroundGraphics from '../components/BackgroundGraphics';

const About = () => {
  const features = [
    {
      icon: <FaCar className="w-6 h-6" />,
      title: "Premium Vehicles",
      description: "Access to a wide range of well-maintained cars and bikes from leading manufacturers."
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "All vehicles are regularly serviced and sanitized for your safety and peace of mind."
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with any queries or concerns."
    },
    {
      icon: <FaMapMarkedAlt className="w-6 h-6" />,
      title: "Regional Coverage",
      description: "Extensive network of pickup and drop locations across Andhra Pradesh and Telangana."
    }
  ];

  const stats = [
    { value: "1000+", label: "Happy Customers" },
    { value: "160+", label: "Total Vehicles" },
    { value: "20+", label: "Cities" },
    { value: "4.8/5", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="relative overflow-hidden">
        <BackgroundGraphics variant="about" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
              About RentWheels
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Your trusted partner for hassle-free vehicle rentals in Andhra Pradesh and Telangana. We provide premium cars and bikes with 
              transparent pricing and exceptional service.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                To revolutionize the vehicle rental experience in Andhra Pradesh and Telangana by providing high-quality vehicles, 
                transparent pricing, and exceptional customer service. We aim to make mobility accessible, 
                convenient, and enjoyable for everyone in our service regions.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/30 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaCar className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" />
                <h3 className="text-2xl font-semibold text-white">Cars (100+ Fleet)</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Choose from our fleet of 100+ well-maintained cars. From economical hatchbacks to luxury sedans, 
                we offer a diverse range to suit every need and budget across Andhra Pradesh and Telangana.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• Hatchbacks & Sedans</li>
                <li>• Premium & Luxury Cars</li>
                <li>• SUVs & MUVs</li>
                <li>• Electric Vehicles</li>
              </ul>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaMotorcycle className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" />
                <h3 className="text-2xl font-semibold text-white">Bikes (60+ Fleet)</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Explore our collection of 60+ bikes perfect for your journeys across the Telugu states. 
                From daily commuters to powerful cruisers, find your ideal two-wheeler.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• Commuter Bikes</li>
                <li>• Sports Bikes</li>
                <li>• Cruiser Bikes</li>
                <li>• Electric Scooters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 