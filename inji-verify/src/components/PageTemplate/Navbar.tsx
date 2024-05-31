import React, {useState} from 'react';
import {ReactComponent as MenuIcon} from "../../assets/burger-menu-svgrepo-com.svg";

const MobileDropDownMenu = ({showMenu}: {showMenu: boolean}) => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    return (<div>
        <div id="menu"
             className="absolute right-0 top-[68px] w-[100vw] bg-white rounded-md shadow-lg p-3 ring-1 ring-black ring-opacity-5 font-bold text-[14px]">
            <a href="/" className="block px-1 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>
            <a href="/" className="block px-1 py-2 text-sm text-primary hover:bg-gray-100">Verify Credentials</a>
            <div className="relative">
                <button id="submenuButton"
                        className="w-full text-left px-1 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowSubMenu(show => !show)}
                >Help
                </button>
                {
                    showSubMenu && (<div id="submenu"
                                         className="absolute top-[36px] left-[-12px] mt-2 w-[100vw] bg-white rounded-md py-1 ring-1 ring-black ring-opacity-5">
                        <a href="https://community.mosip.io/" className="block px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100">Contact us</a>
                        <a href="https://docs.mosip.io/inji/inji-verify/overview"
                           className="block px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</a>
                        <a href="#" className="block px-[26px] py-2 text-sm text-gray-400 hover:bg-gray-100">FAQs</a>
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
        <nav className="bg-white border-gray-200 xs:px-4 lg:px-20 py-3.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap xs:justify-start lg:justify-between items-center h-[40px] mx-0">
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-3 text-sm text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                <div className="w-full lg:block lg:w-auto" id="navbar-default">
                    <ul className="hidden lg:flex mt-4 lg:flex-row lg:space-x-8 lg:mt-0 lg:text-sm lg:font-medium">
                        <li>
                            <a href="/"
                               className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded lg:bg-transparent lg:text-gray-700 lg:p-0 dark:text-white"
                               aria-current="page">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/"
                               className="block py-2 pr-4 pl-10 text-primary font-medium rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent">
                                Verify Credentials
                            </a>
                        </li>
                        <li>
                            <a href=""
                               className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent">
                                Documents
                            </a>
                        </li>
                        <li>
                            <a href="https://community.mosip.io/"
                               className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent">
                                MOSIP Community
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent">
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
