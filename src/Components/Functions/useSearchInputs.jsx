import {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { NearestAirportsListContext } from "../../App";

export const useSearchInputs = () => {

    const [NearestAirportsList, setNearestAirportsList] = useContext(NearestAirportsListContext); 

    const [fromData, setFromData] = useState({
        city: 'Dhaka',
        country: 'Bangladesh',
        airport: 'Hazrat Shahjalal Int',
        airportCode: 'DAC'
    });

    const [toData, setToData] = useState({
        city: 'New York',
        country: 'United States',
        airport: 'John F. Kennedy Int',
        airportCode: 'JFK'
    });

    useEffect(() => {
        if (NearestAirportsList.length > 0) {
            setFromData({
                city: NearestAirportsList[0].address.cityName,
                country: NearestAirportsList[0].address.countryName,
                airport: NearestAirportsList[0].name,
                airportCode: NearestAirportsList[0].iataCode
            });
            setToData({
                city: NearestAirportsList[1].address.cityName,
                country: NearestAirportsList[1].address.countryName,
                airport: NearestAirportsList[1].name,
                airportCode: NearestAirportsList[1].iataCode
            });
        }
    }, []);

    const [departureDate, setDepartureDate] = useState({
        date: '16 Aug 23',
        day: 'Monday',
    });

    const [returnDate, setReturnDate] = useState({
        date: '16 Aug 23',
        day: 'Monday',
    });

    const [passengerAndClass, setPassengerAndClass] = useState({
        passenger_count: 1,
        class_type: 'Economy',
    });

    const [radioValue, setRadioValue] = useState('oneway');

    const navigate = useNavigate();

    // Airport Selection 
    const handleSelect = (tag, city, country, airport, airportCode) => {
        const selectedData = { city, country, airport, airportCode };
        tag === 'From' ? setFromData(selectedData) : setToData(selectedData);
    };

    // Date Selection
    const handleDateSelect = (tag, date, day) => {
        const selectedDate = { date, day };
        tag == 'Departure' ? setDepartureDate(selectedDate) : setReturnDate(selectedDate);
    };

    // Passenger and Class Selection
    const handlePassengerAndClassSelect = (newPassengerCount, newClassType) => {
        const selectedData = {
            passenger_count: newPassengerCount !== undefined ? newPassengerCount : passengerAndClass.passenger_count,
            class_type: newClassType !== undefined ? newClassType : passengerAndClass.class_type,
        };
        setPassengerAndClass(selectedData);
    };

    // Swap Button
    const onSwap = () => {
        const temp = fromData;
        setFromData(toData);
        setToData(temp);
    };

    // Current date function 
    const getCurrentDate = () => {
        const date = new Date();
        const options = { day: 'numeric', month: 'long', year: '2-digit' };
        return {
            date: date.toLocaleDateString('en-US', options),
            day: date.toLocaleDateString('en-US', { weekday: 'long' })
        };
    };

    // Radio Button
    const handleRadioChange = (radio) => {
        setRadioValue(radio);
        if (radio === 'oneway') {
            setReturnDate({ date: 'N/A', day: '-' });
        } else if(radio === 'roundtrip') {
            setReturnDate({...getCurrentDate()});
        }
    };

    // Set current date
    useEffect(() => {
        setDepartureDate({ ...getCurrentDate()});
        handleRadioChange('oneway');
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    };

    const fromCountry = fromData.country;
    const fromCity = fromData.city;
    const fromAirport = fromData.airport;
    const fromAirportCode = fromData.airportCode;

    const toCountry = toData.country;
    const toCity = toData.city;
    const toAirport = toData.airport;
    const toAirportCode = toData.airportCode;

    const departureDateExact = departureDate.date;
    const returnDateExact = returnDate.date;
    const departureDay = departureDate.day;
    const returnDay = returnDate.day;

    const passengerCount = passengerAndClass.passenger_count;
    const classType = passengerAndClass.class_type;

    // Search Button
    const searchClicked = () => {
        
        const queryParams = [
            `fromCountry=${fromCountry}`,
            `fromCity=${fromData.city}`,
            `fromAirport=${fromData.airport}`,
            `fromAirportCode=${fromData.airportCode}`,
            
            `toCountry=${toData.country}`,
            `toCity=${toData.city}`,
            `toAirport=${toData.airport}`,
            `toAirportCode=${toData.airportCode}`,

            `departureDateExact=${departureDateExact}`,
            `departureDay=${departureDay}`,
            `returnDateExact=${returnDateExact}`,
            `returnDay=${returnDay}`,

            `passengerCount=${passengerAndClass.passenger_count}`,
            `classType=${passengerAndClass.class_type}`,

            `tripType=${radioValue}`
        ].join('&');

        navigate(`/search?${queryParams}`);
    };


    return {

        setFromData,
        setToData,
        setPassengerAndClass,
        setDepartureDate,
        setReturnDate,
        
        fromData,
        toData,
        departureDate,
        returnDate,
        passengerAndClass,

        radioValue,
        getCurrentDate,
        handleSelect,
        handleDateSelect,
        handlePassengerAndClassSelect,
        onSwap,
        searchClicked, 
        handleRadioChange,
        
        /*fromCountry,
        fromCity,
        fromAirport,
        fromAirportCode,
        toCountry,
        toCity,
        toAirport,
        toAirportCode,

        departureDateExact,
        returnDateExact,
        
        departureDay,
        returnDay,

        returnDate,
        passengerCount,
        classType,*/
        radioValue, 
        formatDate
    };
};