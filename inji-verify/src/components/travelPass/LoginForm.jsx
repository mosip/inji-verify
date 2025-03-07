import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import driverImage from '../../assets/images/login_page.png';

function LoginForm({ sentOtp }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    sentOtp();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); 
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="relative bg-cover bg-center flex items-center justify-center w-full md:w-[60%] h-[50vh] md:h-full"
        style={{ backgroundImage: `url(${driverImage})` }}
      >
        <div className="text-center text-white absolute top-[30%] w-full px-4">
          <h1 className="font-inter font-semibold text-3xl md:text-[60px] leading-tight md:leading-[90px] tracking-[-2%]">
            Welcome Officer -<br /> Verifying Safe Travel!
          </h1>
          <p className="text-lg mt-2">Ensuring Secure and Reliable TruckPass Verification</p>
        </div>
      </div>
      <div className="bg-white flex items-center justify-center p-8 w-full md:w-[40%] h-[50vh] md:h-full">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold mb-6 text-[#101828]">Log In</h2>
          <form className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown} 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error ? "border-red-500 focus:ring-red-500" : "border-[#D0D5DD] focus:ring-purple-500"
                }`}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button
              type="button"
              className={`w-full h-[44px] py-2 text-white rounded-md transition ${
                email && validateEmail(email)
                  ? "bg-[#7F56D9] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleLogin}
              disabled={!email || !validateEmail(email)}
            >
              Log in with OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
