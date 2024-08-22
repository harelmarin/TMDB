# Google Books Application

Application built with React for the frontend and Node.js with Express and MySQL for the backend. This project is intended as a practice exercise to demonstrate basic API utilisation with Database to add in wishlist the book you want to read (Sign up with firebase)
---

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contriubtion](#contribution)
---


## Features

- Consult books 
- Search all the books you want ( Google books api )
- Sign in with Google ( Firebase )
- Add book in wishlist 
- MySQL database for data storage

---

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

--- 
### Backend Setup

1. Clone the repository:

   ```bash
   git clone hhttps://github.com/harelmarin/Bookboxdd.git
   cd /backend
   npm install 
   ```

   Configure the MySQL Database named ''
   Copy the file '.env.example' to '.env' and fill in appropriate values

---


2. Start the backend server :
   ```bash
   cd /backend
   npm start
    ```

---

3. Frontend setup :

   ```bash
   cd /frontend
   npm install
   npm start
    ```

---

## Usage

- The frontend will be running on http://localhost:3000.
- The backend API will be running on http://localhost:8001

---

## API Endpoints 

- /api/register => Enregistre un utilisateur
- /api/login =>  Connecte un utilisateur si il est enregistré et si ses identifiants sont corrects 
- /api/logout => Déconnecte l'utilisateur 
- /api/checkauth => Vérifie sur l'utilisateur est bien authentifié 
- /api/getusername => Récupère le nom de l'utilisateur connecté

- /api/popularmovies => Récupère les films populaires avec l'api TMDB
- /api/searchmovies => Recherche à partir d'une query
- /api/moviedetails/:id => Récupère les détails d'un film avec son id avec l'api TMDB
- /api/similarmovies/:id => Récupère les films similaires au film spécifié avec l'id (api TMDB)
- /api/moviecredits/:id => Récupère les crédits d'un film avec son id avec l'api TMDB
- /api/director/:id/movies => Récupère tous les films d'un réalisateur
- /api/topratedmovies => Récupère les films les mieux notés via l'api TMDB






--- 

## Contribution

Harel Marin => https://github.com/harelmarin
   
  

   

