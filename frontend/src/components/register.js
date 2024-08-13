import React, { useState } from 'react';

import '../App.css';




function Register() {
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
      
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
  return (
    <div className='container-login'>
        <form onSubmit={handleSubmitRegister}> 

        <label htmlFor='name'>Name</label>
        <input type='text' id='name' name='name' required value={username} onChange={(e) => setUsername(e.target.value)}/>

        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email'required  value={email} onChange={(e) => setEmail(e.target.value)}/>


        <label htmlFor='password'>Password</label>
        <input type='password' id='password' name='password'required  value={password} onChange={(e) => setPassword(e.target.value)}  />

        <button type='submit'>Register</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        </form>

      
    </div>
  );
}

export default Register;
