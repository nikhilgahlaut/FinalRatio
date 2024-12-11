import Cookies from 'js-cookie';

export const isAuthenticated = () => {
    // Replace 'authToken' with the name of your cookie storing the authentication token
    const token = Cookies.get('token');
    return !!token; // Returns true if the token exists
};
