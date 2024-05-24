import React from 'react';
import injiLogo from "../../../assets/inji-logo.svg";

function Navbar(props: any) {
    // Logo goes here
    return (
        <nav className="bg-white border-gray-200 xs:px-4 md:px-20 py-3.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap xs:justify-start md:justify-between items-center h-[40px] mx-0">
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 000 2h12a1 1 0 100-2H4z"
                              clip-rule="evenodd"></path>
                    </svg>
                </button>
                <a href="/inji-verify/public" className="flex items-center">
                    <img className="h-[100%]" src='/assets/images/inji_verify.svg'/>
                </a>
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
