import { useState, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useOutsideClick from './useOutsideClick';


const languages = {
    en:{ code: "en", label: "English" },
    es:{ code: "es", label: "Español" },
    fr:{ code: "fr", label: "Français" },
    ar: { code: "ar", label: "Arabic" },
};

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { i18n, t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[i18n.language] || languages['en']);
    const langDropdownRef = useRef(null);
    const navigator = useNavigate();

    useOutsideClick(langDropdownRef, () => setDropdownOpen(false));
   
    const handleLanguageChange  = (e) => {
        i18n.changeLanguage(e.target.id);
        setDropdownOpen(!isDropdownOpen);
        setSelectedLanguage(languages[e.target.id]);
    }

    const handleNavOptions = (e) => {
        let id = e.target.id;
        if(id === 'home'){
            navigator('/login');
            localStorage.setItem("isAuthenticated", "false");
        }
    };

    return (
        <nav className="w-full bg-[#FFFFFF] px-20 h-[80px] text-black flex items-center justify-between">
            <div className="text-3xl font-bold italic">
            <a className='text-[#202020] cursor-pointer'>TruckPass Verify</a>

            </div>
            <div className="flex space-x-6 text-[#202020] ">
                <div onClick={handleNavOptions} className="flex space-x-6">
                    <button id='home' className='cursor-pointer font-semibold'>Home</button>
                    <button id='help' className='cursor-pointer font-semibold'>Help</button>
                </div>
                <div className="relative inline-block text-left" ref={langDropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="rounded-lg font-semibold cursor-pointer"
                    >
                        {selectedLanguage.label}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute mt-2 w-28 bg-white rounded-lg shadow-lg z-30">
                            <ul className="py-1" onClick={handleLanguageChange}>
                                <li id='en' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                                <li id='fr' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">French</li>
                                <li id='ar' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Arabic</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* <NavbarItem label="Home" to="/" />
        <NavbarItem label="About" to="/about" />
        <NavbarItem label="Contact" to="/contact" /> */}
            </div>
        </nav>
    );
};

export default Navbar;
