import './App.css';
import {BrowserRouter, Routes, Route}  from 'react-router-dom';

import Home from './components/home';
import Header from './components/header';
import Login from './components/login';
import Register from './components/register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>



      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path='/register' element={<Register/>} />

      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
