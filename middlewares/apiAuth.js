const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token !== process.env.BEARER_TOKEN) {
        return res.sendStatus(401); // Unauthorized
    }

    next(); // Proceed to the next middleware or route handler
};

export default authenticateToken;