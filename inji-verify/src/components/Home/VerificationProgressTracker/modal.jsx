import React from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ onClose, tickImage }) {
    const navigate = useNavigate();

    const handleOkayClick = () => {
        localStorage.setItem("isAuthenticated", "true"); 
        navigate('/dashboard'); 
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full sm:w-80 md:w-96 lg:w-96 text-center relative">
                <img src={tickImage} alt="Success" className="mx-auto mb-4 w-16 h-16" />
                <h2 className="text-lg font-bold">Travel Pass Verified</h2>
                <p className="text-gray-600">The traveler is cleared to cross the border</p>
                <button 
                    className="mt-4 bg-[#6941C6] text-white px-24 py-2 rounded-lg hover:bg-[#5a30b5] w-full sm:w-auto"
                    onClick={handleOkayClick}
                >
                    Okay
                </button>
            </div>
        </div>
    );
}

export default Modal;
