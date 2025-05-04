import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import BackgroundGraphics from '../components/BackgroundGraphics';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="w-5 h-5" />,
      title: "Phone",
      details: "+91 9876543210",
      link: "tel:+919876543210"
    },
    {
      icon: <FaWhatsapp className="w-5 h-5" />,
      title: "WhatsApp",
      details: "+91 9876543210",
      link: "https://wa.me/919876543210"
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email",
      details: "support@rentwheels.com",
      link: "mailto:support@rentwheels.com"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Working Hours",
      details: "24/7 Service",
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="relative overflow-hidden">
        <BackgroundGraphics variant="contact" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to us through any of the following channels 
              or fill out the contact form below.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
                  <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{info.title}</h3>
                          {info.link ? (
                            <a 
                              href={info.link} 
                              className="text-gray-400 hover:text-purple-400 transition-colors"
                              target={info.title === 'WhatsApp' ? '_blank' : undefined}
                              rel={info.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-gray-400">{info.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office Location */}
                <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      <FaMapMarkerAlt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Office Location</h3>
                      <p className="text-gray-400">
                        123 Main Street<br />
                        Hyderabad, Telangana 500001<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/30 transform hover:scale-105 transition-all duration-300">
                <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 