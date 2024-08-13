import './App.css';
import {BrowserRouter, Routes, Route}  from 'react-router-dom';

import Home from './components/home';
import Header from './components/header';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>



      <Route path="/" element={<Home/>} />

      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
