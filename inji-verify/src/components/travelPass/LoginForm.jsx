import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import driverImage from '../../assets/images/travel_pas_welcome_page.png';

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
      event.preventDefault(); // Prevents form submission or page refresh
      handleLogin();
    }
  };

  return (
    <div className="flex">
      <div
        className="relative bg-cover bg-center flex items-center justify-center h-full w-[60%]"
        style={{ backgroundImage: `url(${driverImage})` }}
      >
        <div className="relative z-10 h-[100vh] text-white p-16 flex flex-col justify-center"></div>
      </div>
      <div className="bg-white flex items-center justify-center p-8 w-[40%]">
        <div className="w-full max-w-sm">
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
                  onKeyDown={handleKeyDown} // Handles the Enter key press
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
    </div>
  );
}

export default LoginForm;
