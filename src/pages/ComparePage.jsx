import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './ComparePage.css';

const ComparePage = () => {
  const { countries } = useSelector((state) => state.countries);
  const [firstCountry, setFirstCountry] = useState('');
  const [secondCountry, setSecondCountry] = useState('');
  const [filteredCountries1, setFilteredCountries1] = useState([]);
  const [filteredCountries2, setFilteredCountries2] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const navigate = useNavigate();
  const { firstCode, secondCode } = useParams();
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
      setComparisonData({
        country1: countries.find((c) => c.cca2 === firstCode),
        country2: countries.find((c) => c.cca2 === secondCode),
      });
      navigate(`/compare/${firstCode}/n/${secondCode}`);
      setFirstCountry('');
      setSecondCountry('');
    } else {
      navigate('/compare');
      setComparisonData(null);
    };
  };

  const loadComparisonData = (firstCode, secondCode) => {
    if (firstCode && secondCode) {
      const country1 = countries.find((c) => c.cca2 === firstCode);
      const country2 = countries.find((c) => c.cca2 === secondCode);
      if (country1 && country2) {
        setComparisonData({ country1, country2 });
        setFirstCountry(`${country1.name.common} (${country1.cca2})`);
        setSecondCountry(`${country2.name.common} (${country2.cca2})`);
      }
    }
  };

  useEffect(() => {
    if (firstCode && secondCode) {
      loadComparisonData(firstCode, secondCode);
    }
  }, [firstCode, secondCode, countries]);

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
      <h2 className='compare-title'>Compare Two Countries</h2>
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
              aria-label={`Search for country ${i + 1}`}
            />
            {filtered.length > 0 && (
              <ul className="dropdown" role="listbox">
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
          <div className="comparison-cards">
            {[comparisonData.country1, comparisonData.country2].map((country, i) => (
              <div key={i} className='country-card'>
                <div className="flag-image">
                  <img
                    src={country?.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    className='flag'
                  />
                </div>
                <div className="country-details">
                  <div className="country-header">
                    <h3 className="country-name">{country?.name.common} <span className="cca2">({country?.cca2})</span></h3>
                  </div>
                  <div className="detail-row">
                    <span>Official Name</span>
                    <span>:</span>
                    <span>{country?.name.official}</span>
                  </div>
                  <div className="detail-row">
                    <span>Population</span>
                    <span>:</span>
                    <span>{country?.population?.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Area</span>
                    <span>:</span>
                    <span>{country?.area?.toLocaleString()} km<sup>2</sup></span>
                  </div>
                  <br />
                  <h4>Geographic Information</h4>
                  <hr />
                  <div className="detail-row">
                    <span>Capital</span>
                    <span>:</span>
                    <span>{country?.capital?.join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Subregion</span>
                    <span>:</span>
                    <span>{country?.subregion || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Region</span>
                    <span>:</span>
                    <span>{country?.region}</span>
                  </div>
                  <div className="detail-row">
                    <span>Timezones</span>
                    <span>:</span>
                    <span>{country?.timezones.join(', ')}</span>
                  </div>
                  <br />
                  <h4>Cultural Information</h4>
                  <hr />
                  <div className="detail-row">
                    <span>Language</span>
                    <span>:</span>
                    <span>{Object.values(country?.languages || {}).join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Currency</span>
                    <span>:</span>
                    <span>{Object.values(country?.currencies || {}).map(currency => currency.name).join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Demonym</span>
                    <span>:</span>
                    <span>{country?.demonyms?.eng?.m || 'N/A'}</span>
                  </div>
                  <br />
                  <h4>Political Information</h4>
                  <hr />
                  <div className="detail-row">
                    <span>Independent</span>
                    <span>:</span>
                    <span>{country?.independent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-row">
                    <span>UN Member</span>
                    <span>:</span>
                    <span>{country?.unMember ? 'Yes' : 'No'}</span>
                  </div>
                  <br />
                  <h4>Additional Information</h4>
                  <hr />
                  <div className="detail-row">
                    <span>Longitude</span>
                    <span>:</span>
                    <span>{country?.latlng[1] || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Latitude</span>
                    <span>:</span>
                    <span>{country?.latlng[0] || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Maps</span>
                    <span>:</span>
                    <span>
                      <a href={country?.maps?.googleMaps} target="_blank" rel="noopener noreferrer">Link to Google Maps</a>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Enter two countries to compare their details.</p>
      )}
    </div>
  );
};

export default ComparePage;