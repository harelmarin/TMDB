import './App.css';
import {BrowserRouter, Routes, Route}  from 'react-router-dom';

import Home from './components/home';
import Header from './components/header';
import Details from './components/details';
import Search from './components/search';
import Real from './components/realisateur';
import Dashboard from './components/dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>



      <Route path="/" element={<Home/>} />
      <Route path='/details' element={<Details/>} />
      <Route path='/search' element={<Search/>} />
      <Route path='/real' element={<Real/>} />
      <Route path='/dashboard' element={<Dashboard/>} />


      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
