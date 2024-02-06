import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NearestAirports = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    

    useEffect(() => {
        const fetchLocationAndAccessToken = async () => {
            try {
                const locationResponse = await axios.get('https://geolocation-db.com/json/');
                setLatitude(locationResponse.data.latitude.toString());
                setLongitude(locationResponse.data.longitude.toString());

            } catch (error) {
                console.error('Error fetching location and access token:', error);
            }
        };
        fetchLocationAndAccessToken();
    }, []);
    return { latitude, longitude };
};

export default NearestAirports;
