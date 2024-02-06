import { useState, useEffect } from 'react';
import axios from 'axios';
import useCurrentLocation from './useCurrentLocation';

const NearestAirports = (AccessToken) => {
    const [nearestAirport, setNearestAirport] = useState([]);
    const { latitude, longitude } = useCurrentLocation();

    useEffect(() => {
        const fetchNearestAirports = async () => {
            try {
                if (AccessToken) {
                    const response = await axios.get(
                        'https://test.api.amadeus.com/v1/reference-data/locations/airports',
                        {
                            params: {
                                latitude: latitude,
                                longitude: longitude,
                            },
                            headers: {
                                Authorization: `Bearer ${AccessToken}`,
                            },
                        }
                    );
                    setNearestAirport(response.data.data);
                    //console.log("Nearest Airports: ", response.data.data);
                }
            } catch (error) {
                console.error('Error fetching nearest airports:', error);
            }
        };
        
        // Only fetch airports if AccessToken and user's location are available
        if (AccessToken && latitude && longitude) {  fetchNearestAirports();  }
    }, [AccessToken, latitude, longitude]);
    return nearestAirport;
};

export default NearestAirports;
