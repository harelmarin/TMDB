import React, { useState, useEffect } from 'react';
import '../App.css';



function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
  
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
          setSuccess(''); // Clear any previous success messages
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
    
        try {
            const response = await fetch('http://localhost:8001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            });
    
            if (response.ok) {
            setIsAuthenticated(true);
            setError('');
            // Optionally, redirect to login or another page
            window.location.href = '/';
            } else {
            const errorData = await response.text();
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
      const response = await fetch('http://localhost:8001/api/checkauth', { method: 'GET' });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
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
      const response = await fetch('http://localhost:8001/api/logout', { method: 'POST' });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // RETURN
  return (
    <div className="container-header">
      <h1>Zerdee</h1>
      <nav>
       
        {!isAuthenticated ? (
          <>
           <div className='container-nav-header'> 

           <div className='container-login'>
        <form onSubmit={handleSubmitLogin}> 
        <label htmlFor='email'></label>
        <input placeholder='Email' type='email' id='email' name='email'required/>


        <label htmlFor='password'></label>
        <input placeholder='Password'type='password' id='password' name='password'required/>

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
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        </form>
    </div>


          </>
        ) : (
          <>
            <a href="/profile">My Account</a>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
       
      </nav>
    </div>
  );
}
export default Header;
