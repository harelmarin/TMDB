import '../App.css';


import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



function Dashboard() {


    const navigate = useNavigate();
    
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
                } else if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
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
    <div className='app-details'>
        TEST
    </div>
  );
}

export default Dashboard;
