import '../App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


  

function Home() {


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [popularMovies, setPopularMovies] = useState([]);
  const [topratedMovies, setTopRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/checkauth', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
          // Si l'utilisateur est authentifié, récupérer son nom
          const usernameResponse = await fetch('http://localhost:8001/api/getusername', {
            method: 'GET',
            credentials: 'include',
          });

          if (usernameResponse.ok) {
            const data = await usernameResponse.json();
            setUsername(data.username);
          } else {
            console.error('Failed to fetch username');
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };

    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/popularmovies`);
        if (response.ok) {
          const data = await response.json();
          setPopularMovies(data.results);
        } else {
          console.error('Failed to fetch popular movies');
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    checkAuthStatus();
    fetchPopularMovies();
  }, []);


   // Get top rated movies 
   const fetchTopRatedMovies = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/api/topratedmovies?page=${page}`);
      const data = await response.json();
      console.log(data);

      if (data.length > 0) {
        setTopRatedMovies(prevMovies => [...prevMovies, ...data]);
      } else {
        setHasMore(false); // Plus de films à charger
      }
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
    } finally {
      setIsLoading(false);
    }


  };
  
  const loadMoreMovies = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
 


  useEffect(() => {
    fetchTopRatedMovies(currentPage);
  }, [currentPage]);



  

  return (
    <div className='app-home'>
    <div className="container-home background">
      <div className='container-home-title'>
       {isAuthenticated ? (
        <h2>Welcome Back, <a href='/dashboard'>{username}</a>! </h2>
      ) : (
        <h2>Track films you’ve watched.
        Save those you want to see. 
        <span className='violet'> Login </span> to begin !</h2>
        
      )}
      </div>
    </div>
    <div className='container-home-movies'>
     <h3> Popular Movies</h3>
     <span className='border'> </span> 
      <div className='container-popular-movies'>
      {Array.isArray(popularMovies) && popularMovies.length > 0 ? (
      popularMovies.map(movie => (
    <div key={movie.id} className='movie-item'>
      <Link to={`/details?id=${movie.id}`}>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </Link>
    </div>
  ))
) : (
  <p>No movies available</p>
)}



      </div>
      <h3> Top Rated Movies</h3>
      <span className='border'> </span>
      <div className='container-top-movies'>
      {Array.isArray(topratedMovies) && topratedMovies.length > 0 ? (
      topratedMovies.map(topmovie => (
    <div key={topmovie.id} className='movie-item'>
      <Link to={`/details?id=${topmovie.id}`}>
      <img src={`https://image.tmdb.org/t/p/w500${topmovie.poster_path}`} alt={topmovie.title} />
      </Link>
     </div>
  ))
) : (
  <p>No movies available</p>
)}
      </div>
      <div className='container-load-more'>
      {hasMore && (
        <button onClick={loadMoreMovies} disabled={isLoading} className="load-more-btn">
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
          </div>
      </div>



     </div>
  );
}

export default Home;
