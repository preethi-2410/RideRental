import React from 'react';

const BackgroundGraphics = ({ variant = 'default' }) => {
  const variants = {
    default: (
      <>
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float-delayed"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-12 h-12 border-2 border-purple-500/30 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-12 h-12 border-2 border-pink-500/30 rounded-lg rotate-12 animate-spin-slow-reverse"></div>
        
        {/* Floating Dots */}
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-purple-400/40 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-pink-400/40 rounded-full animate-float-delayed-slow"></div>
        
        {/* Lines */}
        <div className="absolute top-1/2 left-20 w-24 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent rotate-45"></div>
        <div className="absolute bottom-1/2 right-20 w-24 h-[1px] bg-gradient-to-l from-pink-500/50 to-transparent -rotate-45"></div>
      </>
    ),
    cars: (
      <>
        {/* Car-themed graphics */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float-delayed"></div>
        
        <div className="absolute top-1/4 left-10 w-16 h-8 border-2 border-blue-500/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-8 border-2 border-purple-500/30 rounded-full animate-bounce-slow-delayed"></div>
        
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse-delayed"></div>
        
        <div className="absolute top-1/2 left-20 w-32 h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        <div className="absolute bottom-1/2 right-20 w-32 h-[2px] bg-gradient-to-l from-purple-500/50 to-transparent"></div>
      </>
    ),
    bikes: (
      <>
        {/* Bike-themed graphics */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float-delayed"></div>
        
        <div className="absolute top-1/4 left-10 w-12 h-12 border-2 border-purple-500/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-12 h-12 border-2 border-pink-500/30 rounded-full animate-spin-slow"></div>
        
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-purple-400/40 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-pink-400/40 rounded-full animate-float-delayed-slow"></div>
        
        <div className="absolute top-1/2 left-20 w-24 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent rotate-45"></div>
        <div className="absolute bottom-1/2 right-20 w-24 h-[1px] bg-gradient-to-l from-pink-500/50 to-transparent -rotate-45"></div>
      </>
    ),
    about: (
      <>
        {/* About-themed graphics */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float-delayed"></div>
        
        <div className="absolute top-20 left-1/4 w-16 h-16 border-2 border-blue-500/30 rounded-lg rotate-45 animate-float-slow"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 border-2 border-purple-500/30 rounded-lg -rotate-45 animate-float-delayed-slow"></div>
        
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-20 w-4 h-4 bg-purple-400/40 rounded-full animate-pulse-delayed"></div>
        
        <div className="absolute top-2/3 left-1/4 w-32 h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent rotate-45"></div>
        <div className="absolute bottom-2/3 right-1/4 w-32 h-[2px] bg-gradient-to-l from-purple-500/50 to-transparent -rotate-45"></div>
      </>
    ),
    contact: (
      <>
        {/* Contact-themed graphics */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-float-delayed"></div>
        
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-purple-500/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-pink-500/30 rounded-full animate-spin-slow-reverse"></div>
        
        <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-purple-400/40 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-pink-400/40 rounded-full animate-float-delayed-slow"></div>
        
        <div className="absolute top-2/3 left-40 w-40 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent rotate-45"></div>
        <div className="absolute bottom-2/3 right-40 w-40 h-[1px] bg-gradient-to-l from-pink-500/50 to-transparent -rotate-45"></div>
      </>
    )
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {variants[variant]}
    </div>
  );
};

export default BackgroundGraphics; 