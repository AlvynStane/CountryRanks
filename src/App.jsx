import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/compare">COMPARE</NavLink>
          <NavLink to="/news">NEWS</NavLink>
        </nav>
      </header>
      <div className="content">
        {status === 'loading' ? (
          <div className='loader'>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => dispatch(fetchCountries())}>Retry</button>
          </div>
        ) : (
          <AppRoutes countries={countries} />
        )}
      </div>
    </div>
  );
};

export default App;