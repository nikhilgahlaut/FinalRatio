import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RequireAuth = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = Cookies.get('token'); // Check for the authentication token
        console.log('req auth token:',authToken);
        
        if (!authToken) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    return children; // Render children (protected component) if authenticated
};

export default RequireAuth;
