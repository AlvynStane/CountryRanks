import React, { useState } from "react";
import { useSelector } from 'react-redux';
import './LandingPage.css';

const LandingPage = () => {
    const { countries } = useSelector((state) => state.countries);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('population');
    const [selectedRegions, setSelectedRegions] = useState([]);

    const handleRegionClick = (region) => {
        setSelectedRegions(prev => {
            if (prev.includes(region)) {
                return prev.filter(r => r !== region);
            } else {
                return [...prev, region];
            }
        });
    };

    const filteredCountries = countries.filter(country => 
        (country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.cca2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedRegions.length === 0 || selectedRegions.includes(country.region))
    );

    const sortedCountries = [...filteredCountries].sort((a, b) => {
        if (sortOption === 'population') {
            return b.population - a.population;
        } else if (sortOption === 'area') {
            return b.area - a.area;
        }
        return 0;
    });

    const formatNumber = (number) => {
        if (number >= 1e9) return `${(number / 1e9).toFixed(2)} B`;
        if (number >= 1e6) return `${(number / 1e6).toFixed(0)} M`;
        if (number >= 1e3) return `${(number / 1e3).toFixed(0)} K`;
        return number;
      };

    const rankedCountries = [...countries].sort((a, b) => b.population - a.population);

    return (
        <div className="landing-page">
            <h1>World Rank</h1>
            <div className="landing-header">
                <h3>Found {filteredCountries.length} countries</h3>
                <input 
                    type="text" 
                    placeholder="Search by Code, Name & Region" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search countries"
                />
            </div>
            <div className="landing-container">
                <div className="left-container">
                    <div className="sort-container">
                        <label htmlFor="sort">Sort by :</label>
                        <select 
                            id="sort" 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                            aria-label="Sort countries"
                        >
                            <option value="population">Population</option>
                            <option value="area">Area</option>
                        </select>
                    </div>
                    <div className="chip-container">
                        <label>Region :</label>
                        <div>
                            {Array.from(new Set(countries.map(country => country.region))).map(region => (
                                <div 
                                    key={region} 
                                    className={`chip ${selectedRegions.includes(region) ? 'selected' : ''}`} 
                                    onClick={() => handleRegionClick(region)}
                                >
                                    {region}
                                </div>
                            ))}
                        </div>
                    </div>  
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Flag</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Population</th>
                                <th>Area(Km<sup>2</sup>)</th>
                                <th>Region</th>
                            </tr>
                        </thead>
                        <tbody>
                        {sortedCountries.map((country) => {
                            const rank = rankedCountries.findIndex(c => c.cca2 === country.cca2) + 1;
                            return <tr key={country.cca2}>
                                <td>{rank}</td>
                                <td><img src={country.flags.png} alt={country.name.common} /></td>
                                <td>{country.cca2}</td>
                                <td>{country.name.common}</td>
                                <td>{formatNumber(country.population)}</td>
                                <td>{formatNumber(country.area)}</td>
                                <td>{country.region}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;