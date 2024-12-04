import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // For cookie management
import { jwtDecode } from 'jwt-decode'; // For decoding the JWT
import axios from 'axios';
import { IoLogOut } from "react-icons/io5";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // To store the user's role
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus(); // Check login status when the component is mounted
    }, []);

    const checkLoginStatus = () => {
        const token = Cookies.get('token'); // Retrieve JWT token from cookies
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token
                if (decoded) {
                    setIsLoggedIn(true);
                    setUserRole(decoded.role); // Assuming the role is stored in the JWT as 'role'
                } else {
                    setIsLoggedIn(false);
                    setUserRole(null);
                }
            } catch (error) {
                console.error('Invalid JWT:', error); // Handle decoding error
                setIsLoggedIn(false);
                setUserRole(null);
            }
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user/logout', {
                withCredentials: true,
            });

            if (response.data.success) {
                Cookies.remove('token');
                setIsLoggedIn(false);
                setUserRole(null);
                navigate('/login');
            } else {
                console.error('Logout failed:', response.data.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-[#fefdfb] border-gray-200 fixed w-full z-50 top-0 ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                        Final Ratio
                        <span className="text-xs font-normal ml-1">Manager</span>
                    </span>
                </Link>

                <button
                    onClick={toggleMenu}
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#fefdfb] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#fefdfb]  md: ">

                        {!isLoggedIn ? (
                            <>
                                <li>
                                    <Link
                                        to={'/signup'}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 ">
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={'/login'}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 ">
                                        Login
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>

                                {userRole === 'app_admin' && (
                                    <Link
                                        to={'/access'}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 ">
                                        Access
                                    </Link>
                                )}
                                <Link
                                    to={'/time'}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 ">
                                    Timesheet
                                </Link>
                                <li>
                                    <Link
                                        to={'/dashboard'}
                                        className="block py-2 px-3 text-white bg-green-700 rounded md:bg-transparent md:text-green-700 md:p-0"
                                        aria-current="page">
                                        Workflow
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0">
                                        <IoLogOut size={25} />
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
