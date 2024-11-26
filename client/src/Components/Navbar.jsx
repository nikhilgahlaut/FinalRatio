import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // For cookie management
import { jwtDecode } from 'jwt-decode'; // For decoding the JWT
import axios from 'axios';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check for token on component mount and whenever the token changes
    useEffect(() => {
        checkLoginStatus(); // Check login status when the component is mounted
    }, []); // Empty dependency array so it runs only once on mount

    const checkLoginStatus = () => {
        const token = Cookies.get('token'); // Retrieve JWT token from cookies
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token
                if (decoded) {
                    setIsLoggedIn(true); // Set user as logged in if token is valid
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Invalid JWT:', error); // Handle decoding error
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            // Call logout API using GET request to remove token from cookie
            const response = await axios.get('http://localhost:5000/user/logout', {
                withCredentials: true, // Make sure the cookie is included in the request
            });

            if (response.data.success) {
                // Remove token from cookies after logout
                Cookies.remove('token');

                // Update the login state immediately after logout
                setIsLoggedIn(false);

                // Navigate to the login page
                navigate('/login');
            } else {
                console.error('Logout failed:', response.data.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Optional: Show error message to the user
        }
    };

    return (
        <nav className="bg-[#fefdfb] border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Final Ratio
                    </span>
                </Link>
                <button
                    onClick={toggleMenu}
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isMenuOpen}>
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div className={`${isMenuOpen ? '' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#fefdfb] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#fefdfb] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link
                                to={'/'}
                                className="block py-2 px-3 text-white bg-green-700 rounded md:bg-transparent md:text-green-700 md:p-0 dark:text-white md:dark:text-green-500"
                                aria-current="page">
                                Home
                            </Link>
                        </li>
                        {!isLoggedIn ? (
                            <>
                                <li>
                                    <Link
                                        to={'/signup'}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={'/login'}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Login
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Logout
                                    </button>
                                </li>
                                <Link
                                    to={'/access'}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    Access
                                </Link>
                                <Link
                                    to={'/time'}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    Work
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
