import './App.css';
import {BrowserRouter, Routes, Route}  from 'react-router-dom';

import Home from './components/home';
import Header from './components/header';
import Details from './components/details';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>



      <Route path="/" element={<Home/>} />
      <Route path='/details' element={<Details/>} />

      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
