const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Access Denied: Invalid Token!' });
        }

        req.user = decoded; // Ajouter les informations décodées à la requête
        next();
    });
};

module.exports = authenticateToken;

