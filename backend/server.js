const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require ('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser()); 

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

a
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
            const token = jwt.sign({ id: results[0].id, email: results[0].email }, 'your_jwt_secret', { expiresIn: '1h' });

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




// Lancement du serveur
app.listen(8001, () => {
    console.log('Server is running on port 8001');
});




