import React from "react";
import './LandingPage.css';

const LandingPage = ({ countries }) => {
    const sortedCountries = [...countries].sort((a, b) => b.population - a.population);

    const formatNumber = (number) => {
        if (number >= 1e9) {
            return `${(number / 1e9).toFixed(2)} B`;
        } else if (number >= 1e6) {
            return `${(number / 1e6).toFixed(0)} M`;
        } else if (number >= 1e3) {
            return `${(number / 1e3).toFixed(0)} K`;
        }
        return number.toLocaleString();
    };

    return (
        <div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Flag</th>
                            <th>Country</th>
                            <th>Population</th>
                            <th>Area(Km<sup>2</sup>)</th>
                            <th>Region</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCountries.map((country, index) => (
                            <tr key={country.cca2}>
                                <td>{index + 1}</td>
                                <td><img src={country.flags.png} alt={country.name.common} /></td>
                                <td>{country.name.common}</td>
                                <td>{formatNumber(country.population)}</td>
                                <td>{formatNumber(country.area)}</td>
                                <td>{country.region}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LandingPage;