const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification
function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Récupérer le token JWT depuis les cookies

    if (!token) return res.status(401).send('Access Denied');

    // Vérifier le token JWT
    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user; // Stocker les informations décodées du token dans req.user
        next(); // Passer à la route suivante
    });
}

module.exports = authenticateToken;


