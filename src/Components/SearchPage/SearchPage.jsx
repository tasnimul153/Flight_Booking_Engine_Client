import { React, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineSwap } from "react-icons/ai";
import Location from "../Home/Input-Main/Location/Location";
import DatePicker from "../Home/Input-Main/DatePicker";
import Passenger from "../Home/Input-Main/Passenger";
import { useSearchInputs } from "../Functions/useSearchInputs";
import Radio from "../Home/Input-Main/Radio";
import "./searchPage.css";
import { fetchAccessToken } from "../../FetchAPIs";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Flight from "./Flight";
import { Link } from "react-router-dom";


const SearchPage = () => {
    const data = useLocation();
    const [filterFlights, setFilterFlights] = useState([]);
    const searchParams = new URLSearchParams(data.search);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [dataAvailable, setDataAvailable] = useState(false);

    const [flightData, setFlightData] = useState({
        "data": [],
        "dictionaries": {
            "locations": {},
            "aircraft": {},
            "currencies": {},
            "carriers": {}
        }
    });

    axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

    const {
        setFromData,
        setToData,
        setDepartureDate,
        setReturnDate,
        setPassengerAndClass,
        passengerAndClass,
        formatDate,
        fromData,
        toData,
        returnDate,
        departureDate,
        radioValue,
        handleRadioChange,
        handleSelect,
        handleDateSelect,
        handlePassengerAndClassSelect,
        onSwap,
        passengerCount,
        classType,
        searchClicked,
    } = useSearchInputs();

    const [sortByPrice, setSortByPrice] = useState(1);

    useEffect(() => {
        for (let param of searchParams.entries()) {
            console.log(param); // logs a [key, value] pair for each query parameter
        }
    }, [data.search]);

    // Fetch access token from backend
    useEffect(() => {
        const getTokenFromBackend = async () => {
            try {
                const response = await fetchAccessToken();
                setAccessToken(response);
            } catch (error) {
                console.error('Error fetching access token:', error);
                setAccessToken('');
            }
        };
        getTokenFromBackend();
    }, []);

    const [params, setParams] = useState({
        originLocationCode: searchParams.get("fromAirportCode"),
        destinationLocationCode: searchParams.get("toAirportCode"),
        departureDate: formatDate(searchParams.get("departureDateExact")),
        // Uncomment the next line if you wish to include returnDate in your request
        // returnDate: returnDateTime,
        adults: searchParams.get("passengerCount"),
        // Uncomment the next line if you wish to include travelClass in your request
        // travelClass: classType,
        nonStop: false,
        // Uncomment the next line if you wish to include currencyCode in your request
        currencyCode: 'USD',
        max: 50,
    });

    useEffect(() => {
        const fetchFlightOffers = async () => {
            setLoading(true); // Set loading to true before starting the fetch
            setDataAvailable(false);
            try {
                if (accessToken) {
                    const response = await axios.get(
                        'https://test.api.amadeus.com/v2/shopping/flight-offers',
                        {
                            params: params,
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log(response.data);
                    if (response.data.data.length > 0) {
                        setDataAvailable(true);
                        setFlightData(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching flight offers:', error);
            } finally {
                setLoading(false); // Set loading to false after fetch is complete
            }
        };

        fetchFlightOffers();
    }, [accessToken]);


    const triggureFilter = (e) => {
        if (e.target.type === 'radio') {
            let val = e.target.value;
            setSortByPrice(val);

            // if val == 1 then sort by price low to high
            // if val == 2 then sort by price high to low
            if (val == 1) {
                setFilterFlights([...filterFlights.sort((a, b) => a.price.total - b.price.total)]);
            } else if (val == 2) {
                setFilterFlights([...filterFlights.sort((a, b) => b.price.total - a.price.total)]);
            }
        } else if (e.target.type == 'checkbox' && e.target.checked) {
            setFilterFlights([...filterFlights, e.target.value]);
        } else {
            setFilterFlights(filterFlights.filter((flight) => flight !== e.target.value));
        }
    }

    return (
        <>
            {
                loading ?
                    <>
                        <div className="loading" style={{marginBottom: "20px"}}>
                            <div className="loader controller-loading">
                                <div className="wrapper">
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                                <div className="wrapper" style={{ marginTop: "-100px" }}>
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                            </div>
                            <div className="loader">
                                <div className="wrapper">
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                                <div className="wrapper" style={{ marginTop: "-100px" }}>
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="loading">
                            <div className="loader controller-loading">
                                <div className="wrapper">
                                    <div class="circle"></div>
                                    <div class="line-1"></div>
                                    <div class="line-2"></div>
                                    <div class="line-3"></div>
                                    <div class="line-4"></div>
                                </div>
                                <div class="wrapper" style={{ marginTop: "-100px" }}>
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                            </div>
                            <div className="loader">
                                <div className="wrapper">
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                                <div className="wrapper" style={{ marginTop: "-100px" }}>
                                    <div className="circle"></div>
                                    <div className="line-1"></div>
                                    <div className="line-2"></div>
                                    <div className="line-3"></div>
                                    <div className="line-4"></div>
                                </div>
                            </div>
                        </div>
                    </> : dataAvailable ?
                        <div className="Container">
                            <div className="search-box-container">
                                <div className="search-inputs">
                                    <div className="locFirst">
                                        <Location
                                            tag='From'
                                            location={fromData.city}
                                            airport={fromData.airport}
                                            airportCode={fromData.airportCode}
                                            onSelect={(city, country, airport, airportCode) => handleSelect('From', city, country, airport, airportCode)}
                                        />
                                    </div>
                                    <div className="locLast">
                                        <Location
                                            tag='To'
                                            location={toData.city}
                                            airport={toData.airport}
                                            airportCode={toData.airportCode}
                                            onSelect={(city, country, airport, airportCode) => handleSelect('To', city, country, airport, airportCode)}
                                        />
                                    </div>
                                    <div className="dateLast">
                                        <DatePicker
                                            tag='Departure'
                                            date={departureDate.date}
                                            day={departureDate.day}
                                            active={true}
                                            onSelect={(date, day) => handleDateSelect('Departure', date, day)}
                                        />
                                    </div>
                                    <div className="dateLast">
                                        <DatePicker
                                            tag='Return'
                                            date={returnDate.date}
                                            day={returnDate.day}
                                            active={radioValue === 'oneway' ? false : true}
                                            onSelect={(date, day) => handleDateSelect('Return', date, day)}
                                        />
                                        {/*<AiOutlineSwap className="icon" onClick={onSwap} id='swapIcon' />*/}
                                    </div>
                                    <div className="lastPass">
                                        <Passenger
                                            tag='Passengers & Class'
                                            passenger_count={passengerAndClass.passenger_count}
                                            class_type={passengerAndClass.class_type}
                                            onSelect={(passenger_count, class_type) => handlePassengerAndClassSelect(passenger_count, class_type)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="searched-flights-container">

                                <div className="controller">
                                    <div className="controller-container">
                                        <div className="filter-flights">
                                            <span className="ct-title">Flights </span><span className="flight-count">({Object.keys(flightData.dictionaries.carriers).length})</span>
                                            <div className="flight-filter-box">
                                                {
                                                    Object.entries(flightData.dictionaries.carriers).map(([carrierId, carrierName], index) => {
                                                        return (
                                                            <div className="carrier" key={index}>
                                                                <input type="checkbox" value={carrierId} onChange={triggureFilter} />
                                                                <label htmlFor="">{carrierName}</label>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sort-by-price-container">
                                        <h3 className="sp-title">Sort by price</h3>
                                        <div className="radio-sort">
                                            <input type="radio" className="lowToHigh" checked value={1} onChange={triggureFilter} />
                                            <label htmlFor="">Low to high</label>
                                        </div>
                                        <div className="radio-sort">
                                            <input type="radio" className="highToLow" value={2} onChange={triggureFilter} />
                                            <label htmlFor="" className="lb2">High to low</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flights">
                                    {
                                        flightData.data.map((flight, index) => {
                                            if ((filterFlights.length === 0)) {
                                                return (
                                                    <Flight
                                                        key={index}
                                                        flight={flight}
                                                        dictionaries={flightData.dictionaries}
                                                        passengerAndClass={passengerAndClass}
                                                    />
                                                );
                                            } else {
                                                for (let i = 0; i < flight.validatingAirlineCodes.length; i++) {
                                                    if (filterFlights.includes(flight.validatingAirlineCodes[i])) {
                                                        return (
                                                            <Flight
                                                                key={index}
                                                                flight={flight}
                                                                dictionaries={flightData.dictionaries}
                                                                passengerAndClass={passengerAndClass}
                                                            />
                                                        );
                                                    }
                                                }
                                            }
                                        })
                                    }

                                </div>
                            </div>
                        </div> :
                        <div className="container-unavailable">
                            <div className="unavailable">
                                <h1>Sorry, no flights available</h1>
                            </div>
                            <Link to='/'>
                                <button>Go back</button>
                            </Link>
                        </div>
            }
        </>
    );
};

export default SearchPage;

