import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ComparePage.css';

const ComparePage = () => {
  const { countries } = useSelector((state) => state.countries);
  const [firstCountry, setFirstCountry] = useState('');
  const [secondCountry, setSecondCountry] = useState('');
  const [filteredCountries1, setFilteredCountries1] = useState([]);
  const [filteredCountries2, setFilteredCountries2] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const filterCountries = (value, excludedCountry) => {
    const trimmedValue = value.trim().toLowerCase();
    const words = trimmedValue.split(/\s+/);
    const isShortInput = words.length <= 2;
  
    return countries
    .filter(({ cca2, name: { common } }) => {
      const cca2Match = cca2.toLowerCase().includes(trimmedValue);
      const commonMatch = common.toLowerCase().includes(trimmedValue);
      return isShortInput ? cca2Match || commonMatch : commonMatch;
    })
    .filter(({ name: { common } }) => common !== excludedCountry)
    .sort((a, b) => {
      const aCca2Match = a.cca2.toLowerCase().startsWith(trimmedValue);
      const bCca2Match = b.cca2.toLowerCase().startsWith(trimmedValue);

      if (isShortInput) {
        return aCca2Match === bCca2Match
          ? a.cca2.localeCompare(b.cca2) || a.name.common.localeCompare(b.name.common)
          : aCca2Match ? -1 : 1;
      }

      return a.name.common.localeCompare(b.name.common);
    })
    .slice(0, 10);
  };

  const handleCountryChange = (value, setCountry, setFiltered, excludedCountry) => {
    setCountry(value);
    setFiltered(filterCountries(value, excludedCountry));
  };

  const handleCountrySelect = (country, setCountry, setFiltered) => {
    setCountry(`${country.name.common} (${country.cca2})`);
    setFiltered([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstCode = firstCountry.match(/\(([^)]+)\)/)?.[1];
    const secondCode = secondCountry.match(/\(([^)]+)\)/)?.[1];
    if (firstCode && secondCode) {
      const country1 = countries.find((c) => c.cca2 === firstCode);
      const country2 = countries.find((c) => c.cca2 === secondCode);
      setComparisonData({ country1, country2 });
      navigate(`/compare/${firstCode}/n/${secondCode}`)
      setFirstCountry('');
      setSecondCountry('');
    } else {
      navigate('/compare');
    };
  };

  const handleClickOutside = (e) => {
    if (!inputRefs.current.some((ref) => ref && ref.contains(e.target))) {
      setFilteredCountries1([]);
      setFilteredCountries2([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    
    <div className="compare-page">
      <h2>Compare Two Countries</h2>
      <form onSubmit={handleSubmit} className="compare-form" autoSave='off' autoComplete='off'>
        {[{
          value: firstCountry,
          setValue: setFirstCountry,
          filtered: filteredCountries1,
          setFiltered: setFilteredCountries1,
          excluded: secondCountry,
        }, {
          value: secondCountry,
          setValue: setSecondCountry,
          filtered: filteredCountries2,
          setFiltered: setFilteredCountries2,
          excluded: firstCountry,
        }].map(({ value, setValue, filtered, setFiltered, excluded }, i) => (
          <div key={i} className="input-container" ref={(el) => (inputRefs.current[i] = el)}>
            <input
              type="search"
              placeholder={`Country ${i + 1}`}
              value={value}
              onChange={(e) => handleCountryChange(e.target.value, setValue, setFiltered, excluded)}
            />
            {filtered.length > 0 && (
              <ul className="dropdown">
                {filtered.map((country) => (
                  <li key={country.cca2} onClick={() => handleCountrySelect(country, setValue, setFiltered)}>
                    {`${country.name.common} (${country.cca2})`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <button type="submit">Compare</button>
      </form>

      {comparisonData ? (
        <div className="comparison-details">
          <h3>Comparison Results</h3>
          {[comparisonData.country1, comparisonData.country2].map((country, i) => (
            <div key={i}>
              <h4>{country?.name.common}</h4>
              <p>Population: {country?.population?.toLocaleString()}</p>
              <p>Region: {country?.region}</p>
              <p>Capital: {country?.capital?.join(', ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Enter two countries to compare their details.</p>
      )}
    </div>
  );
};

export default ComparePage;