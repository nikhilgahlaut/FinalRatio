import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // For cookie management
import { jwtDecode } from 'jwt-decode'; // For decoding the JWT

function LandingPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('')
    const[greet,setGreet] = useState('')

    //utility function for greet based on current time
    const getGreeting = () => {
        // const now = new Date();
        const hour= new Date().getHours();
        console.log(hour)
        if(hour < 12){
            return 'Good Morning';
        }
        else if(hour >= 12 && hour < 14){
            return 'Good Afternoon';
        }
        else {
            return 'Good Evening';
        }
    }
    useEffect(() => {

        setGreet(getGreeting())
        // greeting();
        const intervalId = setInterval(()=>{setGreet(getGreeting);},3600000)
    },[]);


    console.log(greet);
    
    useEffect(() => {
        const token = Cookies.get('token'); // Retrieve JWT token from cookies
        console.log(token)
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token
                console.log('Decoded JWT:', decoded); // Optional: View decoded token in console
                console.log(decoded.username);
                //retrive username
                if (decoded && decoded.username) {
                    setIsLoggedIn(true); // Set user as logged in if token is valid
                    setUsername(decoded.username)
                }
                else {
                    setIsLoggedIn(false);
                }


            } catch (error) {
                console.error('Invalid JWT:', error); // Handle decoding error
                setIsLoggedIn(false);
            }
        }
    }, []);

    return (
        <div className="bg-white">
            <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24 dark:bg-gray-900">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-base font-semibold tracking-wider text-green-600 uppercase">A social media for learners</p>
                            <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl dark:text-white">{`${greet},`}</h1>
                            <h1 className="mt-4 text-2xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-4xl dark:text-white">{isLoggedIn && `${username}`}</h1>
                            <h2 className="mt-4 text-4xl text-black dark:text-white lg:mt-8 sm:text-xl xl:text-4xl">{isLoggedIn ? 'Welcome back!' : ''}</h2>

                            <Link
                                to={isLoggedIn ? "/dashboard" : "/join"}
                                title=""
                                className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
                                role="button"
                            >
                                {isLoggedIn ? "Dashboard" : "Join Us"}
                                <svg className="w-6 h-6 ml-8 -mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </Link>

                            <p className="mt-5 text-gray-600 dark:text-white">
                                {isLoggedIn ? '' : 'Already joined us?'}
                                {!isLoggedIn && (
                                    <Link to="/login" title="" className="text-black transition-all duration-200 hover:underline dark:text-white"> Log in</Link>
                                )}
                            </p>
                        </div>

                        <div>
                            <img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;