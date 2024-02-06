import React from 'react';

const SearchedAirports = ({ airport, airportCode, city, country, onSelect }) => {
    return (
        <>
            <div className='dropdownItem' onClick={() => onSelect(city, country, airport, airportCode)}>
                <span className='City'>{city}</span>
                <span className='Country'>{country}</span>
                <span className='Airport'>{airport}</span>
                <span className='AirportCode'>{airportCode}</span>
            </div>
        </>
    )
};