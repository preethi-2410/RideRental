import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-400 text-xl" />,
    error: <FaExclamationCircle className="text-red-400 text-xl" />,
    info: <FaInfoCircle className="text-blue-400 text-xl" />
  };

  const backgrounds = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20'
  };

  return createPortal(
    <div
      className={`fixed bottom-4 right-4 z-50 transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-lg ${backgrounds[type]}`}>
        {icons[type]}
        <p className="text-white">{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
