import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ComparePage.css';

const ComparePage = () => {
  const { firstCca2: urlFirstCca2, secondCca2: urlSecondCca2 } = useParams();

  const [countries, setCountries] = useState([]);
  const [firstCountry, setFirstCountry] = useState('');
  const [firstCca2, setFirstCca2] = useState('');
  const [secondCountry, setSecondCountry] = useState('');
  const [secondCca2, setSecondCca2] = useState('');
  const [filteredCountries1, setFilteredCountries1] = useState([]);
  const [filteredCountries2, setFilteredCountries2] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const navigate = useNavigate();
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

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

  useEffect(() => {
    if (urlFirstCca2 && urlSecondCca2) {
      const firstCountryData = countries.find((c) => c.cca2 === urlFirstCca2);
      const secondCountryData = countries.find((c) => c.cca2 === urlSecondCca2);
      setComparisonData({ firstCountryData, secondCountryData });
      setFirstCca2(urlFirstCca2);
      setSecondCca2(urlSecondCca2);
      setFirstCountry(
        `${firstCountryData?.name.common || ''} (${urlFirstCca2})`
      );
      setSecondCountry(
        `${secondCountryData?.name.common || ''} (${urlSecondCca2})`
      );
    } else {
      setComparisonData(null);
    }
  }, [urlFirstCca2, urlSecondCca2, countries]);

  const filterCountries = (value, isFirst) => {
    const words = value.trim().split(/\s+/);
    let filteredCountries = [];
  
    if (words.length > 3) {
      filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      filteredCountries = countries.filter(country => {
        const cca2Match = country.cca2.toLowerCase().includes(value.toLowerCase());
        const cca3Match = country.cca3.toLowerCase().includes(value.toLowerCase());
        const nameMatch = country.name.common.toLowerCase().includes(value.toLowerCase());
        return cca2Match || cca3Match || nameMatch;
      });
    }
  
    if (isFirst) {
      filteredCountries = filteredCountries.filter(country => country.name.common !== secondCountry);
    } else {
      filteredCountries = filteredCountries.filter(country => country.name.common !== firstCountry);
    }
  
    filteredCountries.sort((a, b) => {
      const aMatch = a.cca2.toLowerCase().includes(value.toLowerCase()) ? 1 : 0;
      const bMatch = b.cca2.toLowerCase().includes(value.toLowerCase()) ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      
      const aCca3Match = a.cca3.toLowerCase().includes(value.toLowerCase()) ? 1 : 0;
      const bCca3Match = b.cca3.toLowerCase().includes(value.toLowerCase()) ? 1 : 0;
      if (aCca3Match !== bCca3Match) return bCca3Match - aCca3Match;
  
      return a.name.common.localeCompare(b.name.common);
    });
  
    return filteredCountries;
  };

  const handleFirstCountryChange = (e) => {
    const value = e.target.value;
    setFirstCountry(value);
    setFilteredCountries1(filterCountries(value, true));
  };

  const handleSecondCountryChange = (e) => {
    const value = e.target.value;
    setSecondCountry(value);
    setFilteredCountries2(filterCountries(value, false));
  };

  const handleCountrySelect = (country, isFirst) => {
    if (isFirst) {
      setFirstCountry(`${country.name.common} (${country.cca2})`);
      setFirstCca2(country.cca2);
      setFilteredCountries1([]);
    } else {
      setSecondCountry(`${country.name.common} (${country.cca2})`);
      setSecondCca2(country.cca2);
      setFilteredCountries2([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstCca2 && secondCca2) {
      navigate(`/compare/${firstCca2}/n/${secondCca2}`);
      setFirstCountry('');
      setFirstCca2('');
      setSecondCountry('');
      setSecondCca2('');
    } else {
      navigate('/compare');
    }
  };

  const handleClickOutside = (e) => {
    if (firstInputRef.current && !firstInputRef.current.contains(e.target)) {
      setFilteredCountries1([]);
    }
    if (secondInputRef.current && !secondInputRef.current.contains(e.target)) {
      setFilteredCountries2([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='compare-page'>
      <h2>Would you like to compare two countries?</h2>
      <h3>Please provide two country names</h3>
      <form onSubmit={handleSubmit} className="compare-form" autoComplete='off'>
        <div ref={firstInputRef} className="input-container">
          <input
            type="search"
            placeholder="First Country"
            value={firstCountry}
            onChange={handleFirstCountryChange}
          />
          {filteredCountries1.length > 0 && (
            <ul className="dropdown">
              {filteredCountries1.map(country => (
                <li key={country.cca2} onClick={() => handleCountrySelect(country, true)}>
                  {`${country.name.common} (${country.cca2})`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={secondInputRef} className="input-container">
          <input
            type="search"
            placeholder="Second Country"
            value={secondCountry}
            onChange={handleSecondCountryChange}
          />
          {filteredCountries2.length > 0 && (
            <ul className="dropdown">
              {filteredCountries2.map(country => (
                <li key={country.cca2} onClick={() => handleCountrySelect(country, false)}>
                  {`${country.name.common} (${country.cca2})`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
      {comparisonData ? (
        <div className="comparison-details">
          <h3>Comparison Details</h3>
          <div className="country-details">
            <div>
              <h4>{comparisonData.firstCountryData?.name.common}</h4>
              <p>Population: {comparisonData.firstCountryData?.population}</p>
              <p>Region: {comparisonData.firstCountryData?.region}</p>
              <p>Capital: {comparisonData.firstCountryData?.capital?.join(', ')}</p>
            </div>
            <div>
              <h4>{comparisonData.secondCountryData?.name.common}</h4>
              <p>Population: {comparisonData.secondCountryData?.population}</p>
              <p>Region: {comparisonData.secondCountryData?.region}</p>
              <p>Capital: {comparisonData.secondCountryData?.capital?.join(', ')}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Submit two countries to see the comparison details.</p>
      )}
    </div>
  );
};

export default ComparePage;