import '../App.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
  

function Real() {

        const urlParams = new URLSearchParams(window.location.search);
        const RealId = urlParams.get('id');
        const navigate = useNavigate();

        const [movies, setMovies] = useState([]);
        const [directorName, setDirectorName] = useState('');

        const fetchRealisateurMovies = async () => {
            try {
                const response = await fetch(`http://localhost:8001/api/director/${RealId}/movies`);
                if (response.ok) {
                    const data = await response.json();
                    const filteredMovies = data.filter(movie => movie.poster_path);
                    setMovies(filteredMovies);
                } else {
                    console.error('Failed to fetch movies by realisateur');
                }
            } catch (error) {
                console.error('Error fetching movies by realisateur:', error);
            }
        }

        // Requête pour récupérer les détails du réalisateur
    const fetchRealisateurDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/director/${RealId}`);
            if (response.ok) {
                const data = await response.json();
                setDirectorName(data.name);  // Stocker le nom du réalisateur
                console.log(data);  // Vérifiez les détails du réalisateur
            } else {
                console.error('Failed to fetch director details');
            }
        } catch (error) {
            console.error('Error fetching director details:', error);
        }
    }
    
        useEffect(() => {
            fetchRealisateurMovies();
            fetchRealisateurDetails();
        }, []);

         // Fonction pour gérer le clic sur un film similaire
    const handleMovieClick = (movieId) => {
        navigate(`/details?id=${movieId}`);
        window.location.reload(); // Forcer le rechargement de la page
    };


  return (
    <div className='app-search'>

         <h3 className='title-similar'>Movies by <span className='violet'>{directorName}</span></h3>
            <span className='border soixantedix'></span>
            <div className='container-app-search'>
                {movies.map(movie => (
                    <div key={movie.id} className='search-result'>
                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title}  onClick={() => handleMovieClick(movie.id)}/>
                    </div>
                ))}
            </div>
   
    </div>
  );
}

export default Real;
