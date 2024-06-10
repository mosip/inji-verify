import React, {useState} from 'react';
import {ReactComponent as MenuIcon} from "../../assets/burger-menu-svgrepo-com.svg";
import { MdArrowForwardIos } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import {ReactComponent as NewTabIcon} from "../../assets/new-tab.svg";

const SubMenu = () => {
    return (
        <div id="help-submenu"
             className="absolute top-[36px] left-[-12px] mt-2 w-[100vw] lg:w-[250px] lg:top-[24px] lg:left-[-190px] bg-white rounded-md py-1 ring-1 ring-black ring-opacity-5 lg:py-5 lg:shadow-lg">
            <a id="contact-us"
                href="https://community.mosip.io/"
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center w-full px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100 lg:px-4">Contact us <NewTabIcon className="mx-1.5"/></a>
            <a id="documentation"
                href="https://docs.mosip.io/inji/inji-verify/overview"
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center w-full px-[26px] py-2 text-sm text-gray-700 hover:bg-gray-100 lg:px-4">Documentation <NewTabIcon className="mx-1.5" /></a>
            <button id="faq" className="block text-left w-full px-[26px] py-2 text-sm text-gray-400 hover:bg-gray-100 lg:px-4" disabled>FAQs</button>
        </div>
    );
}

const MobileDropDownMenu = ({showMenu}: { showMenu: boolean }) => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    return (<div className="lg:hidden">
        {
            showMenu && (
                <div id="menu"
                     className="absolute right-0 top-[68px] w-[100vw] bg-white rounded-md shadow-lg p-3 ring-1 ring-black ring-opacity-5 font-bold text-[14px] z-[1000]">
                    <a id="home-button" href="/" className="block px-1 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>
                    <a id="verify-credentials-button" href="/" className="block px-1 py-2 text-sm text-primary hover:bg-gray-100">Verify Credentials</a>
                    <div className="relative">
                        <button id="submenu-button"
                                className="inline-flex items-center w-full text-left px-1 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                    setShowSubMenu(show => !show)
                                }}
                        >Help <MdArrowForwardIos className={`mx-1.5 ${showSubMenu ? "rotate-90" : ""}`}/>
                        </button>
                        {showSubMenu && (<SubMenu/>)}
                    </div>
                </div>
            )
        }
    </div>)
}

const DesktopMenu = () => {
    const [showHelp, setShowHelp] = useState(false);
    return (
        <div className="hidden lg:block w-full lg:w-auto" id="navbar-default">
            <ul className="hidden lg:flex mt-4 lg:flex-row lg:space-x-10 lg:mt-0 lg:text-sm lg:font-medium">
                <li>
                    <a id="home-button"
                       href="/"
                       className="block py-2 rounded text-black"
                       aria-current="page">
                        Home
                    </a>
                </li>
                <li>
                    <a id="verify-credentials-button"
                       href="/"
                       className="block py-2 rounded text-primary">
                        Verify Credentials
                    </a>
                </li>
                <li className="relative">
                    <button id="help-button"
                       onClick={() => setShowHelp(show=>!show)}
                       className="inline-flex items-center cursor-pointer py-2 rounded text-black">
                        Help <MdExpandLess className={`mx-1.5 ${showHelp ? "" : "rotate-180"}`}/>
                    </button>
                    {showHelp && (<SubMenu/>)}
                </li>
            </ul>
        </div>
    );
}

function Navbar(props: any) {
    const [showMenu, setShowMenu] = useState(false);
    // Logo goes here
    return (
        <nav className="bg-white border-gray-200 xs:px-4 lg:px-20 py-3.5 rounded">
            <div className="container flex flex-wrap xs:justify-start lg:justify-between items-center h-[40px] mx-0">
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-3 text-sm text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false" id="hamburger"
                        onClick={() => setShowMenu(show => !show)}
                >
                    <MenuIcon id="menu-icon" style={{width: "25px", height: "19px"}}/>
                </button>
                <a href="/" className="flex items-center">
                    <img id="inji-verify-logo" className="h-[100%]" src='/assets/images/inji_verify.svg' alt="inji-verify-logo"/>
                </a>
                <DesktopMenu/>
                <MobileDropDownMenu showMenu={showMenu}/>
            </div>
        </nav>
    )
        ;
}

export default Navbar;
