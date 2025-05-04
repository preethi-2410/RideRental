import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaComponent = ({ onChange }) => {
  console.log('ReCAPTCHA Site Key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);

  const handleChange = (token) => {
    console.log('ReCAPTCHA token received:', token ? 'Valid token received' : 'No token');
    onChange(token);
  };

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={handleChange}
        theme="dark"
        onError={() => console.error('ReCAPTCHA Error occurred')}
        onExpired={() => console.log('ReCAPTCHA Expired')}
      />
    </div>
  );
};

export default ReCaptchaComponent;
