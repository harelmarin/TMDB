import '../App.css';


import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';



function Dashboard() {


    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    
    // Handle pour sécuriser l'accès à la page
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:8001/api/dashboard', {
                    credentials: 'include' // Inclure les cookies avec la demande
                });
                if (response.status === 401) {
                    // Utilisateur non authentifié, redirection vers la page de connexion
                    navigate('');
                }  else if (response.ok) {
                    const data = await response.json();
                    setWatchlist(data.watchlist);
                    console.log(data);
                } else {
                    console.error('Failed to fetch dashboard data');
                }
            }
            catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }
        fetchDashboardData();

    }, []);





    // Fonction pour gérer le clic sur un film similaire
    const handleMovieClick = (movieId) => {
        navigate(`/details?id=${movieId}`);
        window.location.reload(); // Forcer le rechargement de la page
    };




  return (
    <div className='app-dashboard'>
        <h3 className='title-similar'>Dashboard</h3>
        <span className='border soixantedix'></span>

        {watchlist.length > 0 ? (
        <div className='container-app-search'>
            {watchlist.map(movie => (
                <div key={movie.id} className='search-result'>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} onClick={() => handleMovieClick(movie.movie_id)} />
                </div>
            ))}
        </div>
    ) : (
        <p className='no-results'>No movies in your watchlist</p>
    )}
    </div>

  );
}

export default Dashboard;
