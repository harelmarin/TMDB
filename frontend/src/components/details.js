import '../App.css';


import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
  

function Details() {

    const [movieDetails, setmoviedetails] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState([]);
    const [genres, setGenres] = useState([]);
    const [country, setCountry] = useState([]);
    const [originalLanguage, setOriginalLanguage] = useState('');

    const navigate = useNavigate();
    

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
                setGenres(data.genres); 
                setCountry(data.production_countries);
                setOriginalLanguage(data.original_language);
                console.log(data);
            } else {
                console.error('Failed to fetch movie details');
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    // Handle similar movies 
    const fetchSimilarMovies = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/similarmovies/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                const filteredResults = data.results.filter(movie => movie.poster_path);
                setSimilarMovies(filteredResults);
            } else {
                console.error('Failed to fetch similar movies');
            }
        } catch (error) {
            console.error('Error fetching similar movies:', error);
        }
    }

    // Handle pour le réal du film 
     const fetchMovieCredits = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/moviecredits/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                const director = data.crew.find(person => person.job === 'Director');
                setDirector(director ? director.name : 'Unknown Director');
                console.log(director);
            } else {
                console.error('Failed to fetch movie credits');
            }
        } catch (error) {
            console.error('Error fetching movie credits:', error);
        }
    }


    // Handle pour le cast du film 
    const fetchMovieCast = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/moviecredits/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                const cast = data.cast;
                const filteredCast = cast.filter(person => person.profile_path);
                setCast(filteredCast);
            } else {
                console.error('Failed to fetch movie credits');
            }
        } catch (error) {
            console.error('Error fetching movie credits:', error);
        }
    }

    




    useEffect(() => {
        fetchMovieDetails();
        fetchSimilarMovies();
        fetchMovieCredits();
        fetchMovieCast();
    }, []);

    // Fonction pour gérer le clic sur un film similaire
    const handleMovieClick = (movieId) => {
        navigate(`/details?id=${movieId}`);
        window.location.reload(); // Forcer le rechargement de la page
    };







  return (
    <div className='app-details'>
    {movieDetails ? (
                
                    <div key={movieDetails.id} className='movie-details'>
                        <img src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} alt={movieDetails.title} />
                        <div className='movie-details-info'>
                        <h2>{movieDetails.title}</h2>
                        <h5>{director}</h5>
                        <p>Release : {movieDetails.release_date}</p>
                        <p>{movieDetails.runtime} min</p>
                        <h4> <span className='violet'>{movieDetails.vote_average} </span> /  10 </h4>
                        <span className='border'></span>
                        <div className='overview'>
                        <h3>{movieDetails.overview}</h3>
                        </div>
                        <span className='border'></span>
                        </div>
                        
                        <div className='movie-details-genres'>
                        <h3> Genres</h3>
                        <span className='border'></span>
                        <div className='container-genres'>
                        {genres.map(genre => (
                                <div key={genre.id} className='genre-item'>
                                    <p>{genre.name}</p>
                                </div>
                            ))}
                        </div>
                        <h3> Country</h3>
                        <span className='border'></span>
                        <div className='container-country'>
                        {country.map(country => (
                                <div key={country.id} className='genre-item'>
                                    <p>{country.name}</p>
                                </div>
                            ))}
                            </div>
                        <h3> Original Language</h3>
                        <span className='border'></span>
                        <div className='container-language'>
                            <p>{originalLanguage}</p>
                            </div>
                        </div> 



                    </div>
            ) : (
                <p>Loading...</p>
            )}

                    <div className='movie-details-cast'>
                        <h3> Cast</h3>
                        <span className='border'></span>
                        <div className='container-cast'>
                        {cast.map(person => (
                            <div key={person.id} className='cast-item'>
                                <img src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`} alt={person.name} />            
                            </div>
                            
                        ))}
                        </div>
                        </div>


            <h3 className='title-similar nomargin'>Similar Movies</h3>
            <span className='border soixantedix'></span>
            <div className='container-similar-movies'>

                {similarMovies.map(movie => (
                    <div key={movie.id} className='similar-movie-item'>
                    
                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title}    onClick={() => handleMovieClick(movie.id)}/>
                       
                    </div>
                ))}
                
                </div>

    
               
    </div>
  );
}

export default Details;
