import React, { useEffect, useState, useRef, useContext } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import DropdownLocation from '../../Input-Dropdown/DropdownLocation';
import { debounce } from 'lodash';
import { NearestAirportsListContext } from '../../../../App'; // Context for nearest airports list

const Location = ({ tag, location, airport, airportCode, onSelect }) => {
    const containerRef = useRef(null); // create a ref
    const [accessToken, setAccessToken] = useState(''); // Set access token
    const [dropdown, setDropdown] = useState(false); // Toggle dropdown
    const [searchText, setSearchText] = useState(''); // Search text
    const [NearestAirportsList, setNearestAirportsList] = useContext(NearestAirportsListContext); // Set nearest airports list
    const [loading, setLoading] = useState(false);

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if the clicked element is neither the container nor the search box
            if (containerRef.current && !containerRef.current.contains(event.target) && !event.target.closest('.searchBox')) {
                setSearchText('');

                // Reset dropdown items to default
                document.querySelectorAll('.dropdownItem').forEach((item) => {
                    item.style.display = 'flex';
                });
                setDropdown(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    // Fetch location 
    const fetchLocations = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/locations?keyword=${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }
            const result = await response.json();
            console.log('Location:', result);
            setNearestAirportsList(result);
            setLoading(false);
            //setNearestAirportsList(...result);
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    const debouncedFetchLocations = debounce(fetchLocations, 500);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedFetchLocations(searchText);
        }
    }, [searchText]);

    // Search in the dropdown list
    const handleSearch = (event) => {
        const search = event.target.value.toUpperCase();
        setSearchText(search);

        const dropdownList = document.querySelectorAll('.dropdownItem');
        dropdownList.forEach((item) => {
            const city = item.querySelector('.City').textContent.toUpperCase();
            const country = item.querySelector('.Country').textContent.toUpperCase();
            const airport = item.querySelector('.airport-name').textContent.toUpperCase();
            const airportCode = item.querySelector('.airport-code').textContent.toLowerCase();
            if (city.indexOf(search) === -1 && country.indexOf(search) === -1 && airport.indexOf(search) === -1 && airportCode.indexOf(search) === -1) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
    };

    const handleSelect = (city, country, airport, airportCode) => {
        setSearchText('');
        document.querySelectorAll('.dropdownItem').forEach((item) => { item.style.display = 'flex'; });
        onSelect(city, country, airport, airportCode);
        setDropdown(false);
    };

    return (
        <>
            <div ref={containerRef} className="locationButton mainInput" onClick={() => {
                setDropdown(!dropdown);
            }}>
                <div className="dataBox DataLocation">
                    <span className='constant-tag'>{tag} <MdArrowDropDown className="icon" id='dropdownArrow' /></span>
                    <span className='location-name Middle'>{location}</span>
                    <div className="airportInfo" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <span className='airport-name Last'>{airport}</span>
                        <span className='airport-code Last'>{airportCode}</span>
                    </div>
                </div>
            </div>

            <div className="dropdownListSearch" style={dropdown ? { display: 'block' } : { display: 'none' }}>
                <div className='searchBox'>
                    <AiOutlineSearch className="icon" id='searchIcon' />
                    <input type="text" className='search' value={searchText} onChange={handleSearch} />
                </div>
                {loading && <div className='horizontal-loader'></div>}

                {NearestAirportsList.map((item) => (
                    <DropdownLocation
                        key={item.iataCode + item.relevance}
                        city={item.address.cityName}
                        country={item.address.countryName}
                        airport={item.name}
                        code={item.iataCode}
                        onDropdownItemSelect={handleSelect}
                    />
                ))}
            </div>
        </>
    );
};

export default Location;