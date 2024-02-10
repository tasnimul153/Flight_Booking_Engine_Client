import React, { createContext, useContext, useEffect, useState } from "react";
import { useFlightSearch } from "../SearchPage/useFlightSearch";
import { MdFlight } from "react-icons/md";
import { FaSuitcaseRolling } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaLuggageCart } from "react-icons/fa";
import { FlightDetailsContext } from "../Contexts/FlightDetailContext";
import { fetchAccessToken } from "../../FetchAPIs";
import axios from "axios";


const Flight = ({ flight, dictionaries, passengerAndClass }) => {

    /*useEffect(() => {
        const fetchFlightOffers = async () => {
            setLoading(true); // Set loading to true before starting the fetch
            axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/flights`, { params })
                .then((response) => {
                    setFlightData(response.data);
                    console.log(response.data);
                    setLoading(false); // Set loading to false after fetch is complete
                })
                .catch((error) => {
                    console.error('Error fetching flight offers:', error);
                    setLoading(false); // Set loading to false in case of error
                });
        }
        fetchFlightOffers();
    }, [params]);*/

    const navigate = useNavigate();
    const [isExpended, setIsExpended] = useState(false);

    const { metaData, setMetaData } = useContext(FlightDetailsContext);
    const [fetchComplete, setFetchComplete] = useState(false);

    const jsonPayloadFlightOffers = {
        data: {
            type: 'flight-offers-pricing',
            flightOffers: [flight]
        }
    };

    const parseDuration = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/); // matches PT#H#M
        const hours = match[1] ? parseInt(match[1]) : 0; // gets hours if present, otherwise 0
        const minutes = match[2] ? parseInt(match[2]) : 0; // gets minutes if present, otherwise 0
        return hours * 60 + minutes; // returns duration in minutes
    };

    const handleFlightDetailSelect = () => {
        setIsExpended(!isExpended);
        console.log(isExpended);
    }

    const getTokenFromBackend = async () => {
        try {
            const response = await fetchAccessToken();
            console.log(`Flight AccessToken: ${response}`);
            return response; // Return the token
        } catch (error) {
            console.error('Error fetching access token:', error);
            return ''; // Return empty string in case of error
        }
    };

    const fetchFlightOffers = async (token) => {
        setFetchComplete(false);
        try {
            if (token) {
                const response = await axios.post(
                    'https://test.api.amadeus.com/v1/shopping/flight-offers/pricing',
                    jsonPayloadFlightOffers,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log(`Reservations Pricing: ${JSON.stringify(response.data)}`);
                setFetchComplete(true);
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching flight offers:', error);
        } finally {
            console.log();
        }
    };

    const handleFlightSelectButton = async () => {

        delete flight.lastTicketingDateTime; // delete lastTicketingDateTime from flight object


        const token = await getTokenFromBackend();
        const flightOffers = await fetchFlightOffers(token);

        setMetaData({
            flight: flightOffers,
            dictionary: dictionaries
        });

        /*console.log(`Flight Data: ${JSON.stringify({
            flight: flightOffers,
            dictionary: dictionaries
        })}`);*/
        //console.log(`Flight Data: ${JSON.stringify(flightOffers)}`);
    }

    useEffect(() => {
        const navigateToReservation = async () => {
            if (fetchComplete) {
                navigate(`/Reservation?${[]}`);
            }
        }
        navigateToReservation();
    }, [fetchComplete]);

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£'
    };

    const currencySymbol = currencySymbols[flight.price.currency] || flight.price.currency;

    return (
        <div className="flight">
            <div className="carrier-info">
                <div className="carriers">
                    {
                        flight.itineraries[0].segments.map((segment, index) => {
                            // put flight carrierCode and id in hash map
                            const carrierCode = segment.carrierCode;
                            const carrierName = dictionaries.carriers[carrierCode];

                            return (
                                <div key={segment.id} className="each-carrier">
                                    <div className="carrier-company">
                                        <div className="carrier-logo">
                                            <img src={`https://images.kiwi.com/airlines/64/${carrierCode}.png`} alt="AF" />
                                        </div>
                                        <div className="carrier-name">{carrierName}</div>
                                    </div>
                                    <p className="carrier-model">{dictionaries.aircraft[segment.aircraft.code]}</p>
                                </div>
                            );
                        })
                    }
                </div>

                <div className="pricing">
                    <span className="price-currency">{currencySymbol}</span>
                    <span className="price">{Math.floor(flight.price.grandTotal)}</span>
                </div>
            </div>

            {/** Flight facilites information*/}
            <div className="facilities-info">
                <div className="left-facilities">
                    <div className="checked-bags">
                        <FaSuitcaseRolling className="icon" /> Checked luggage {
                            flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity
                        } {
                            flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight &&
                            `(${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight}
                                            ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit})`
                        }
                    </div>
                    <div className="dot-gray"></div>
                    {
                        flight.itineraries[0].segments.length - 1 > 0 ?
                            <div className="layover-count">
                                {`${flight.itineraries[0].segments.length - 1} Transit`}
                            </div> : <div className="layover-count">Direct Flight</div>
                    }
                    {flight.itineraries[0].segments.length - 1 > 0 ? <div className="dot-gray"></div> : null}
                    {

                        flight.itineraries[0].segments.length - 1 > 0 ?
                            <div className="layover-duration-total"> Transit duration total:
                                {
                                    (() => {
                                        // Parse total duration in minutes
                                        let totalDurationMinutes = parseDuration(flight.itineraries[0].duration);

                                        flight.itineraries[0].segments.forEach((segment) => {
                                            // Parse segment duration in minutes
                                            const segmentDurationMinutes = parseDuration(segment.duration);

                                            // Subtract segment duration from total duration
                                            totalDurationMinutes -= segmentDurationMinutes;
                                        });

                                        const layoverHours = Math.floor(totalDurationMinutes / 60);
                                        const layoverMinutes = totalDurationMinutes % 60;

                                        return ` ${layoverHours} ${layoverHours > 9 ? 'Hours' : 'Hour'}, ${layoverMinutes} ${layoverMinutes > 9 ? 'Minutes' : 'Minute'} `;
                                    })()
                                }
                            </div>
                            : null
                    }
                </div>
                <div className="right-facilities">
                    {passengerAndClass.class_type}
                </div>
            </div>

            <div className="itineraries-data">
                <div className="left-iti">
                    <span className="departure-airport">{flight.itineraries[0].segments[0].departure.iataCode}</span>
                    <span className="departure-date">
                        {
                            `
                        ${new Date(flight.itineraries[0].segments[0].departure.at).getDate()}
                        ${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString('default', { month: 'short' })}, 
                        ${new Date(flight.itineraries[0].segments[0].departure.at).getFullYear()}
                        `
                        }
                    </span>
                    <span className="departure-time">
                        {
                            new Date(flight.itineraries[0].segments[0].departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        }
                    </span>
                </div>

                <div className="middle-iti">
                    <div className="visual-flight-meta-data">
                        <div className="left-dot"></div>
                        <div className="line">
                            <MdFlight className="icon" />
                        </div>
                        <div className="right-dot"></div>
                    </div>
                    <div className="total-flight-duration">
                        {
                           // flight.itineraries[0].duration.split('T')[1].split('H')[0] + ` ${flight.itineraries[0].duration.split('T')[1].split('H')[0] > 9 ? 'Hours' : 'Hour'}` + ' ' + flight.itineraries[0].duration.split('T')[1].split('H')[1].split('M')[0] + `${flight.itineraries[0].duration.split('T')[1].split('H')[1].split('M')[0] > 9 ? ' Minutes' : ' Minute'}`
                        }
                    </div>
                </div>
                <div className="right-iti">
                    <span className="departure-airport">{flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}</span>
                    <span className="departure-date">
                        {
                            `
                                               ${new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).getDate()}
                                               ${new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleString('default', { month: 'short' })}, 
                                               ${new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).getFullYear()}
                                            `
                        }
                    </span>
                    <span className="departure-time">
                        {
                            new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        }
                    </span>
                </div>
            </div>
            {
                isExpended &&
                <div className="details">
                    {
                        flight.itineraries[0].segments.map((segment, index) => {
                            const carrierCode = segment.carrierCode;
                            const carrierName = dictionaries.carriers[carrierCode];
                            return (
                                <div key={index} style={{ border: "none", padding: 0, margin: 0 }}>
                                    <div className="carrier-detail">
                                        <div className="each-carrier">
                                            <div className="company">
                                                <div className="logo">
                                                    <img src={`https://images.kiwi.com/airlines/64/${carrierCode}.png`} alt="AF" />
                                                </div>
                                                <div className="name">{carrierName}</div>
                                            </div>
                                            <p className="model">{dictionaries.aircraft[segment.aircraft.code]}</p>
                                        </div>
                                    </div>
                                    <div className="travel-detail">
                                        <div className="departure demographic">
                                            <span className="airport-code">{segment.departure.iataCode}</span>
                                            <span className="terminal">Terminal {segment.departure.terminal}</span>
                                            <span className="departure-date">
                                                {
                                                    `
                                                ${new Date(segment.departure.at).getDate()}
                                                ${new Date(segment.departure.at).toLocaleString('default', { month: 'short' })}, 
                                                ${new Date(segment.departure.at).getFullYear()}
                                                `
                                                }
                                            </span>
                                            <span className="departure-time">
                                                {
                                                    new Date(segment.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                                }
                                            </span>
                                        </div>
                                        <div className="visual">
                                            <div className="visualContainer">
                                                <MdFlight className="icon" />
                                                <div className="lineJourney"></div>
                                            </div>
                                        </div>
                                        <div className="arrival demographic">
                                            <span className="airport-code">{segment.arrival.iataCode}</span>
                                            <span className="terminal">Terminal {segment.arrival.terminal}</span>
                                            <span className="departure-date">
                                                {
                                                    `
                                                ${new Date(segment.arrival.at).getDate()}
                                                ${new Date(segment.arrival.at).toLocaleString('default', { month: 'short' })}, 
                                                ${new Date(segment.arrival.at).getFullYear()}
                                                `
                                                }
                                            </span>
                                            <span className="departure-time">
                                                {
                                                    new Date(segment.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                                }
                                            </span>
                                        </div>
                                        <div className="check-in bags">
                                            <div className="title-bags">
                                                <h3>CHECK IN</h3>
                                                <FaLuggageCart className="icon" />
                                            </div>
                                            <div className="baggage">
                                                {//segment.baggage.allowance.handBag.weight} {segment.baggage.allowance.handBag.weightUnit}
                                                    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity
                                                } {
                                                    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight &&
                                                    `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight}
                                            ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit}`
                                                }
                                            </div>
                                        </div>
                                        <div className="cabin bags">
                                            <div className="title-bags">
                                                <h3>CABIN</h3>
                                                <FaLuggageCart className="icon" />
                                            </div>
                                            <div className="baggage">
                                                {//segment.baggage.allowance.handBag.weight} {segment.baggage.allowance.handBag.weightUnit}
                                                    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity
                                                } {
                                                    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight &&
                                                    `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight}
                                            ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="layover-details">

                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            }

            <div className="operation-buttons">
                <div className="flight-detail-button operation-button" onClick={handleFlightDetailSelect}>
                    <span>Flight Details</span>
                </div>
                <div className="select-button" onClick={handleFlightSelectButton}>
                    SELECT
                </div>
            </div>
        </div>
    );
}

export default Flight;