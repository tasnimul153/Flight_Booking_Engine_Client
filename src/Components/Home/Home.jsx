import { React, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSwap } from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
import Radio from './Input-Main/Radio';
import Location from './Input-Main/Location/Location';
import DatePicker from './Input-Main/DatePicker';
import Passenger from './Input-Main/Passenger';
import './home.css';
import { useSearchInputs } from '../Functions/useSearchInputs';
import { fetchAccessToken } from '../../FetchAPIs';
import { NearestAirportsListContext } from '../../App'; // Context for nearest airports list
import image2 from '../../Assets/BackgroundHomePage2.jpg';
import image1 from '../../Assets/BackgroundHomePage1.jpg';
import image3 from '../../Assets/BackgroundHomePage3.jpg';
import NearestAirports from './Input-Main/Location/NearestAirports';

const Home = () => {

    const [accessToken, setAccessToken] = useState(''); // Set access token
    const [NearestAirportsList, setNearestAirportsList] = useContext(NearestAirportsListContext); // Set nearest airports list
    const [loading, setLoading] = useState(true);
    const slides = [image2, image3, image1];
    const [iterator, setIterator] = useState(0);

    const {
        fromData,
        toData,
        departureDate,
        returnDate,
        passengerAndClass,
        radioValue,
        handleRadioChange,
        handleSelect,
        handleDateSelect,
        handlePassengerAndClassSelect,
        onSwap,
        searchClicked,
    } = useSearchInputs();

    //const videoRef = useRef(null);

    // Fetch access token
    useEffect(() => {
        const getTokenFromBackend = async () => {
            try {
                const response = await fetchAccessToken();
                setAccessToken(response);
                console.log(response);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };
        getTokenFromBackend();
    }, []);

    // Get nearest airports
    const nearestAirports = NearestAirports(accessToken);

    useEffect(() => {
        if (nearestAirports.length > 0) {
            setNearestAirportsList(nearestAirports);
            console.log("Nearest Airports: ", nearestAirports);
            setLoading(false);
        } else {
            console.log("Fetching API: Failed (Nearest Airports) -- Home.jsx");
        }
    }, [nearestAirports]); // This effect depends on the nearestAirports data.

    // Loading will cause the video to speedup and reverse back the speed when loading is done
    /*useEffect(() => {
        if (loading) {
            videoRef.current.playbackRate = 3;
        } else {
            videoRef.current.playbackRate = 1;
        }
    }, [loading]);*/

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <section className='home'>
                {/*<div className='overlay2'></div>*/}
                {/*<div className="overlay"></div>*/}
                {/*<div className="overlayAnimation"></div>*/}
                {/*<video ref={videoRef} src={video} type="video/mp4" autoPlay muted loop></video>
                    <img src={image} alt="" />*/}
                {/*<img src={slides[currentSlide]} alt='background' className='backgroundImage' />*/}
          
                    <div className="overlay"></div>
                    <div className="slides">
                        {slides.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Slide ${index}`}
                                className={`slide ${index === currentSlide ? 'active' : ''}`}
                                style={{ animation: `${index === currentSlide ? 'slideIn' : ''} 1s` }}
                            />
                        ))}
                    </div>

                <div className="homeContent container">
                    {/*<div className="textDiv">
                        <span className="smallText">Let us help you to</span>
                        <h1 className="homeTitle">Chose your flights</h1></div>*/}

                    <div className="cardDiv">

                        <Radio onRadioChange={handleRadioChange} />

                        <div className="inputBox">
                            <div className='inputFieldBox'>
                                <AiOutlineSwap className="icon" onClick={onSwap} id='swapIcon' />
                                <Location
                                    tag='From'
                                    location={fromData.city}
                                    airport={fromData.airport}
                                    airportCode={fromData.airportCode}
                                    onSelect={(city, country, airport, airportCode) => handleSelect('From', city, country, airport, airportCode)}
                                />
                            </div>
                            <div className='inputFieldBox'>
                                <Location
                                    tag='To'
                                    location={toData.city}
                                    airport={toData.airport}
                                    airportCode={toData.airportCode}
                                    onSelect={(city, country, airport, airportCode) => handleSelect('To', city, country, airport, airportCode)}
                                />
                            </div>

                            <DatePicker
                                tag='Departure'
                                date={departureDate.date}
                                day={departureDate.day}
                                active={true}
                                onSelect={(date, day) => handleDateSelect('Departure', date, day)}
                            />
                            <DatePicker
                                tag='Return'
                                date={returnDate.date}
                                day={returnDate.day}
                                active={radioValue === 'oneway' ? false : true}
                                onSelect={(date, day) => handleDateSelect('Return', date, day)}
                            />

                            <Passenger
                                tag='Passengers & Class'
                                passenger_count={passengerAndClass.passenger_count}
                                class_type={passengerAndClass.class_type}
                                onSelect={(passenger_count, class_type) => handlePassengerAndClassSelect(passenger_count, class_type)}
                            />

                            <button className='searchBtn' onClick={searchClicked}>
                                <AiOutlineSearch className="icon" id='searchIcon' />Search
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
};

export default Home;