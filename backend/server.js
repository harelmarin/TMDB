const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require ('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser()); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.log('Database connection error:', err);
    } else {
        console.log('Database connected');
    }
});

const secret = process.env.SESSION_SECRET;


// Inscription
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking existing user:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            return res.status(409).send('User already exists');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Internal server error');
            }

            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
                if (err) {
                    console.error('Error inserting new user:', err);
                    return res.status(500).send('Internal server error');
                }
                res.status(201).send('Registration successful');
            });
        });
    });
});


// Connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        // Comparer les mots de passe
        bcrypt.compare(password, results[0].password, (err, validPassword) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal server error');
            }

            if (!validPassword) {
                return res.status(401).send('Invalid email or password');
            }

            // Générer un JWT
            const token = jwt.sign({ id: results[0].id, email: results[0].email }, secret, { expiresIn: '1h' });

            // Envoyer le token dans un cookie HttpOnly
            res.cookie('token', token, {
                httpOnly: true,  // Cookie non accessible via JavaScript
                secure: true,    // Cookie envoyé uniquement via HTTPS
                sameSite: 'Strict' // Cookie envoyé uniquement avec les requêtes "same-site"
            });

            res.send('Login successful');
        });
    });
});


// Déconnexion
app.post('/api/logout', (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error');
        }

        // Supprimer le cookie JWT
        res.clearCookie('token', {
            httpOnly: true, 
            secure: false,    
            sameSite: 'Strict'
        });

        res.status(200).send('Logout successful');
    });
});

// Vérifier si l'utilisateur est authentifié
app.get('/api/checkauth', (req, res) => {
    const token = req.cookies.token; // Récupère le token depuis les cookies

    if (!token) {
        return res.status(401).send('Not Authenticated');
    }

    // Vérification du token
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {

        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).send('Not Authenticated');
        }

        // Si le token est valide, l'utilisateur est authentifié
        res.status(200).send('Authenticated');
    });
});



// Lancement du serveur
app.listen(8001, () => {
    console.log('Server is running on port 8001');
});




