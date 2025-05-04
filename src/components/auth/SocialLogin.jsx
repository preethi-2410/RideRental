import React from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const SocialLogin = () => {
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithGoogle();
      showToast('Successfully signed in with Google!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await authService.signInWithFacebook();
      showToast('Successfully signed in with Facebook!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <FaGoogle className="text-red-500" />
        Continue with Google
      </button>
      <button
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaFacebook />
        Continue with Facebook
      </button>
    </div>
  );
};

export default SocialLogin;
