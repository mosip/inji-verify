import React, {useState} from 'react';
import {ReactComponent as MenuIcon} from "../../assets/burger-menu-svgrepo-com.svg";

const MobileDropDownMenu = ({showMenu}: {showMenu: boolean}) => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    return (<div>
        <div id="menu"
             className="absolute right-0 top-[68px] w-[100vw] bg-white rounded-md shadow-lg p-3 ring-1 ring-black ring-opacity-5 font-bold text-[14px]">
            <a href="#" className="block px-1 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>
            <a href="#" className="block px-1 py-2 text-sm text-primary hover:bg-gray-100">Verify Credentials</a>
            <div className="relative">
                <button id="submenuButton"
                        className="w-full text-left px-1 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowSubMenu(show => !show)}
                >Help
                </button>
                {
                    showSubMenu && (<div id="submenu"
                                         className="absolute top-[36px] left-[-12px] mt-2 w-[100vw] bg-white rounded-md py-1 ring-1 ring-black ring-opacity-5">
                        <a href="#" className="block px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100">Contact us</a>
                        <a href="#"
                           className="block px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</a>
                        <a href="#" className="block px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100">FAQs</a>
                    </div>)
                }
            </div>
        </div>
    </div>)
}

function Navbar(props: any) {
    const [showMenu, setShowMenu] = useState(false);
    // Logo goes here
    return (
        <nav className="bg-white border-gray-200 xs:px-4 md:px-20 py-3.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap xs:justify-start md:justify-between items-center h-[40px] mx-0">
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-3 text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false" id="hamburger"
                        onClick={() => setShowMenu(show=>!show)}
                >
                    <MenuIcon style={{width: "25px", height: "19px"}}/>
                </button>
                <a href="/" className="flex items-center">
                    <img className="h-[100%]" src='/assets/images/inji_verify.svg'/>
                </a>
                <div>
                    {showMenu && <MobileDropDownMenu showMenu={showMenu}/>}
                </div>
                <div className="w-full md:block md:w-auto" id="navbar-default">
                    <ul className="hidden md:flex mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:p-0 dark:text-white"
                               aria-current="page">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-10 text-primary font-medium rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Verify Credentials
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Documents
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                MOSIP Community
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Help
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
        ;
}

export default Navbar;
