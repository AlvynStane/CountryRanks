import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from './redux/slices/countriesSlice';
import bgVideo from './assets/bg_video_2.mp4';
import './App.css';
import AppRoutes from './components/AppRoutes';

const App = () => {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCountries());
    }
  }, [status, dispatch]);

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
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <AppRoutes countries={countries} />
        )}
      </div>
    </div>
  );
};

export default App;