import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bgVideo from './assets/bg_video_2.mp4';
import './App.css';
import AppRoutes from './components/AppRoutes';

const App = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className='app'>
      <video src={bgVideo} autoPlay loop muted className="background-video" />
      <header className="header">
        <h1>Country Rank Population</h1>
        <nav className='header-link'>
          <Link to="/">HOME</Link>
          <Link to="/compare">COMPARE</Link>
          <Link to="/news">NEWS</Link>
        </nav>
      </header>
      <div className="content">
        <AppRoutes countries={countries} /> 
      </div>
    </div>
  );
};

export default App;