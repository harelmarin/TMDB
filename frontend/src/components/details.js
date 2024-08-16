import '../App.css';

import { useState, useEffect } from 'react';
  

function Details() {

    const [movieDetails, setmoviedetails] = useState([]);
    

    // Handle the movie ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    // Fetch movie details

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/moviedetails/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                setmoviedetails(data);
                console.log(data);
            } else {
                console.error('Failed to fetch movie details');
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    useEffect(() => {
        fetchMovieDetails();
    }, []);





  return (
    <div className='app-details'>
    {movieDetails ? (
                
                    <div key={movieDetails.id} className='movie-details'>
                        <img src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} alt={movieDetails.title} />
                        <div className='movie-details-info'>
                        <h2>{movieDetails.title}</h2>
                        <h3>{movieDetails.overview}</h3>
                        <p>Release date: {movieDetails.release_date}</p>
                        <p>Rating : {movieDetails.vote_average}</p>
                        </div>
                    </div>
            ) : (
                <p>Loading...</p>
            )}
    </div>
  );
}

export default Details;
