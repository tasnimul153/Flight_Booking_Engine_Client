import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFlightSearch = (
  AccessToken,
  origin,
  destination,
  departureDateTime,
  returnDateTime,
  passengerCount,
  classType
) => {
  const [flightOffers, setFlightOffers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: departureDateTime,
    // Uncomment the next line if you wish to include returnDate in your request
    // returnDate: returnDateTime,
    adults:  1,
    // Uncomment the next line if you wish to include travelClass in your request
    // travelClass: classType,
    nonStop: false,
    // Uncomment the next line if you wish to include currencyCode in your request
    currencyCode: 'USD',
    max: 250,
  });

  useEffect(() => {
    const fetchFlightOffers = async () => {
      try {
        if (AccessToken) {
          const response = await axios.get(
            'https://test.api.amadeus.com/v2/shopping/flight-offers',
            {
              params: searchParams,
              headers: {
                Authorization: `Bearer ${AccessToken}`,
              },
            }
          );
          console.log(response.data);
          setFlightOffers(response.data);
        }
      } catch (error) {
        console.error('Error fetching flight offers:', error);
      }
    };
    fetchFlightOffers();
  }, [searchParams, AccessToken]);

  return flightOffers;
};
