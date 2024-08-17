import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

import searchIcon from '../assets/img/search.svg';


import Human from '../assets/img/human.svg';



function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();


  
    // Register function
    const handleSubmitRegister = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:8001/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
  
        if (response.ok) {
          setSuccess('Registration successful');
          setError('');
          // Optionally, redirect to login or another page
          window.location.href = '/';
        } else {
          const errorData = await response.text();
          setError(errorData);
          setSuccess('');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setError('An error occurred. Please try again.');
        setSuccess(''); // Clear any previous success messages
      }
    };

    // LOGIN FUNCTION

   const handleSubmitLogin = async (e) => {
    e.preventDefault();

    console.log('Attempting to log in with:', { email, password });

    try {
        const response = await fetch('http://localhost:8001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Inclure les cookies
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            setSuccess('Login successful');
            setError('');
            setIsAuthenticated(true);
            window.location.href = '/';
        } else {
            const errorData = await response.text();
            console.log('Error response:', errorData);
            setError(errorData);
        }
    } catch (error) {
        console.error('Error during login:', error);
        setError('An error occurred. Please try again.');
    }
};

    
// Check if user is authenticated
const checkAuthStatus = async () => {
    try {
        console.log('Sending request to check authentication');
        
        // Inclure credentials pour envoyer les cookies
        const response = await fetch('http://localhost:8001/api/checkauth', {
            method: 'GET',
            credentials: 'include', // Inclure les cookies
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            console.log('User is authenticated');
            setIsAuthenticated(true);
        } else {
            console.log('User is not authenticated');
            setIsAuthenticated(false);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
    }
};

  useEffect(() => {
    checkAuthStatus();
  }, []);
  


  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/logout', 
        {
            method: 'POST',
            credentials: 'include',
        });
      if (response.ok) {
        setIsAuthenticated(false);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  // Handle Search Query Change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
        setSearchResults([]);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8001/api/searchmovies?query=${query}`);
        if (response.ok) {
            const data = await response.json();
            const filteredResults = data.results.filter(movie => movie.poster_path);
            setSearchResults(filteredResults);
        } else {
            console.error('Failed to fetch search results');
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};


// Handle Search Form Submit
const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/search?query=${searchQuery}`);
    setSearchQuery('');
    setSearchResults([]);
  }
};

// Handle Enter Key Press in Search Input
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearchSubmit(e);
    window.location.reload();
  }
};
   // Fonction pour gérer le clic sur la recherche 
   const handleMovieClick = (movieId) => {
    navigate(`/details?id=${movieId}`);
    window.location.reload();
};





  // RETURN
  return (
    <div className="header">
    <div className="container-header">
     <a href='/'><h1>TMDB</h1></a> 
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}


      <form className='form-search'> 
              <input className='input-search' type='text' placeholder='Search for a movie' value={searchQuery} onChange={handleSearchChange} onKeyPress={handleKeyPress}/> 
              <img src={searchIcon} alt="Search Icon" className='search-icon' />
          {searchResults.length > 0 && (
                    <div className="container-search-results">
                        {searchResults.map((movie) => (
                           
                            <div key={movie.id} className="search-result-item"  onClick={() => handleMovieClick(movie.id)}>
                                
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                                <div className='container-column'>
                                <p>{movie.title}</p>
                                <p>{movie.release_date}</p>

                                </div>
                               
                                
                            </div>
                         
                        ))}
                    </div>
                )}
          </form>

         


      <nav>

        {!isAuthenticated ? (
          <>
        
           <div className='container-nav-header'> 
           
           <div className='container-login'>
        <form onSubmit={handleSubmitLogin}> 
        <label htmlFor='email'></label>
        <input placeholder='Email' type='email' id='emaillog' name='emaillog'required  onChange={(e) => setEmail(e.target.value)}/>


        <label htmlFor='password'></label>
        <input placeholder='Password'type='password' id='passwordlog' name='passwordlog'required onChange={(e) => setPassword(e.target.value)}/>

        <button type='submit'>Login</button>
        </form>
    </div>

            <button className='register-button'  onClick={() => setIsFormVisible(!isFormVisible)}>Register</button>
            </div>

            
            <div className={`container-register ${isFormVisible ? 'show' : ''}`}>
            <form onSubmit={handleSubmitRegister}> 

        <label htmlFor='name'>Name</label>
        <input autoComplete='off' type='text' id='name' name='name' required value={username} onChange={(e) => setUsername(e.target.value)}/>

        <label htmlFor='email'>Email</label>
        <input autoComplete='off' type='email' id='email' name='email'required  value={email} onChange={(e) => setEmail(e.target.value)}/>


        <label htmlFor='password'>Password</label>
        <input autoComplete='off' type='password' id='password' name='password'required  value={password} onChange={(e) => setPassword(e.target.value)}  />

        <button type='submit'>Register</button>
        </form>
    </div>


          </>
        ) : (
          <>


            <div className='container-profile'>
            <img src={Human} alt='human' />
            

            <div className='container-dashboard'>
            <button onClick={() => window.location.href = '/dashboard'}>Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
            </div>
            </div>
           
          </>
        )}
       
      </nav>
    </div>
    </div>
  );
}
export default Header;
