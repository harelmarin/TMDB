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
                httpOnly: true,
                secure: false,    
                sameSite: 'Strict' 
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

// Get le nom de l'utilisateur
app.get('/api/getusername', (req, res) => {
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

        // Utiliser l'ID de l'utilisateur stocké dans le token pour récupérer le nom d'utilisateur depuis la base de données
        const userId = decoded.id;

        db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching username:', err);
                return res.status(500).send('Internal server error');
            }

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            // Envoyer le nom d'utilisateur
            res.status(200).send({ username: results[0].username });
        });
    });
});

// GET les films populaires

app.get('/api/popularmovies', async (req, res) => {

        const apiKey = process.env.TMDB_API_KEY;
        console.log("apik key :", apiKey);
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-EN&page=1`;
      
        try {
          const response = await fetch(url);
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error fetching popular movies:', error);
          res.status(500).json({ error: 'Failed to fetch popular movies' });
        }
      })

// GET recherche de films temps réeel

    app.get('/api/searchmovies', async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${query}&page=1&include_adult=false&sort_by=popularity.desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// GET recherche de films dans une autre page

app.get('/api/search/:query', async (req, res) => {
    const { query } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${query}&page=1&include_adult=false&sort_by=popularity.desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});



// GET détails d'un film

app.get('/api/moviedetails/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-EN`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

// GET films similaires

app.get('/api/similarmovies/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-EN&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        res.status(500).json({ error: 'Failed to fetch similar movies' });
    }
});


// GET crédits d'un film

app.get('/api/moviecredits/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        res.status(500).json({ error: 'Failed to fetch movie credits' });
    }
}
);


// Route pour récupérer les films d'un réalisateur
app.get('/api/director/:id/movies', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}&language=en-EN`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.crew.filter(movie => movie.job === 'Director')); // Filtrer pour ne garder que les films dirigés par ce réalisateur
    } catch (error) {
        console.error('Error fetching movies by director:', error);
        res.status(500).json({ error: 'Failed to fetch movies by director' });
    }
});

// Route pour récupérer les détails d'un réalisateur via son id 
app.get('/api/director/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-EN`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching director details:', error);
        res.status(500).json({ error: 'Failed to fetch director details' });
    }
});


//Route pour récupérer les films les mieux notés 
app.get('/api/topratedmovies', async (req, res) => {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-EN&page=1-3`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching top rated movies:', error);
        res.status(500).json({ error: 'Failed to fetch top rated movies' });
    }
});





// Lancement du serveur
app.listen(8001, () => {
    console.log('Server is running on port 8001');
});




