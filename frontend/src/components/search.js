import '../App.css';

import { useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';



  

function Search() {




    // Handle the search query
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const fetchSearchResults = async () => {
        console.log(query);
        try {
            const response = await fetch(`http://localhost:8001/api/search/${query}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const filteredResults = data.results.filter(movie => movie.poster_path);
                setSearchResults(filteredResults);
                
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    useEffect(() => {
        fetchSearchResults();
    }, []);


    // Fonction pour gérer le clic sur un film similaire
    const handleMovieClick = (movieId) => {
        navigate(`/details?id=${movieId}`);
        window.location.reload(); // Forcer le rechargement de la page
    };


  return (
    <div className='app-search'>

    <h3 className='title-similar'>Search results for <span className='violet'>{query} </span></h3>  
    <span className='border soixantedix'></span>

        <div className='container-app-search'>
            {searchResults.map(movie => (
                <div key={movie.id} className='search-result'>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}  onClick={() => handleMovieClick(movie.id)}/>
                </div>
            ))}
        </div>
   
    </div>
  );
}

export default Search;
