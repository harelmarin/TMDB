import '../App.css';
import { useState, useEffect } from 'react';




  

function Home() {


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

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

    checkAuthStatus();
  }, []);

  return (
    <div className={`container-home background`}>
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
  );
}

export default Home;
