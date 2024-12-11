const jwt = require('jsonwebtoken');

// Middleware to validate sign-up data
const signUpDataValidate = (req, res, next) => {
    const { name, confirmPassword, password, email } = req.body;

    if (!name || !password || !email || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match!",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long!",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format!",
        });
    }

    next();
};

// Middleware to validate login data
const loginDataValidate = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required!",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format!",
        });
    }

    next();
};

// Middleware to authenticate requests using JWT
const jwtAuth = (req, res, next) => {
    const token = req.cookies && req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is missing. Please log in.",
        });
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET);
        req.user = payload; // Attach user info from token to the request object
        next(); // Proceed to the next middleware or route
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid token. Authentication failed.",
            });
        }
    }
};

module.exports = { signUpDataValidate, loginDataValidate, jwtAuth };
