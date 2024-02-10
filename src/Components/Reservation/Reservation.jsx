import { createContext, useState, React, useContext, useEffect } from "react";
import { json, useLocation, useNavigate, useParams } from "react-router-dom";
import './Reservation.css';
import { FaLuggageCart } from "react-icons/fa";
import { FlightDetailsContext } from "../Contexts/FlightDetailContext";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import axios from "axios";
import { fetchAccessToken } from "../../FetchAPIs";


const Reservation = () => {

    const navigate = useNavigate();
    const data = useLocation();
    //const ticketDetails = new URLSearchParams(data.search);

    const { metaData, setMetaData } = useContext(FlightDetailsContext);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [flightData, setFlightData] = useState({});

    //const passengerCount = metaData.passengerAndClass.passenger_count;
    const passengerCount = 1;

    const handleOnClick = async () => {
        console.log(metaData);
    };

    const sendEmailSMTP = () => {

        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;

        const emailSubject = 'Ticket Request';
        /*const emailBody = `
            Ticket issue request from ${firstName} ${lastName},
            \n\nPassenger Details:
            \n\nFirst Name: ${firstName}
            \nLast Name: ${lastName}
            \nEmail: ${email}
            \nPhone: ${phone}
            \n
            \n\nFlight Details:
            \n\nFlight Number: ${ticketDetails.get('flightNumber')}
            \nDeparture: ${ticketDetails.get('fromAirportCode')}
            \nArrival: ${ticketDetails.get('toAirportCode')}
            \nDeparture Date: ${ticketDetails.get('departureDate')}
            \nReturn Date: ${ticketDetails.get('returnDate')}
            \nPassengers: ${ticketDetails.get('passengerCount')}
            \nClass: ${ticketDetails.get('classType')}
            \nPrice: ${ticketDetails.get('Price')}
            \nTrip Type: ${ticketDetails.get('tripType')}
        `;*/

        const emailBody = ``;

        fetch(`${process.env.REACT_APP_SEND_MAIL_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'shaheen@a1travel.net',
                subject: emailSubject,
                body: emailBody
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('A booking agent will confirm your booking soon...Thank you!');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        //console.log(metaData);
        //alert(passengerCount);

        //console.log(jsonPayloadFlightOffers);
    };

    useEffect(() => {
        const printMetaData = () => {
            console.log(metaData);
        };
        printMetaData();
    }, []);

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£'
    };

    const price = {
        grandTotal: metaData.flight.data.flightOffers[0].price.grandTotal,
        currency: metaData.flight.data.flightOffers[0].price.currency,
        symbol: currencySymbols[metaData.flight.data.flightOffers[0].price.currency] || metaData.flight.data.flightOffers[0].price.currency
    }

    const dictionaries = metaData.dictionary;
    const flightSegments = metaData.flight.data.flightOffers[0].itineraries[0];

    return (
        <div className="container-reservation">
            <div className="final-details">
                <h3>Confirm Booking</h3>
                <div className="display-details">
                    <div className="customer-inputs">
                        {
                            Array.from({ length: passengerCount }, (_, index) => (
                                <div className="each-customer" key={index}>
                                    <h4 className="passenger-number-label">Passenger {index + 1} <span className="star" style={{ color: "red" }}>*</span></h4>
                                    <div className="input-group name-section">
                                        <div className="input-box">
                                            <label htmlFor="">First Name <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" id="firstName" />
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="">Middle Name <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" id="middleName" />
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="">Last Name <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" id="lastName" />
                                        </div>
                                    </div>
                                    <div className="input-group contact-section">
                                        <div className="input-box">
                                            <label htmlFor="">Email <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="email" id="email" />
                                            <MdOutlineMail className="icon" />
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="">Contact <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" id="contact" />
                                            <FiPhoneCall className="icon" />
                                        </div>
                                    </div>
                                    <div className="input-group demographic-section">
                                        <div className="input-box">
                                            <label htmlFor="">Date of Birth <span className="star" style={{ color: "red" }}>*</span></label>
                                            <div className="dropDownGroup">
                                                <div className="dropdown-item">
                                                    <label htmlFor="year">Year</label>
                                                    <select name="year" id="yearSelect">
                                                        {Array.from({ length: new Date().getFullYear() - 1904 }, (_, index) => (
                                                            <option key={index} value={new Date().getFullYear() - index}>
                                                                {new Date().getFullYear() - index}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="dropdown-item">
                                                    <label htmlFor="month">Month</label>
                                                    <select name="month" id="monthSelect">
                                                        {Array.from({ length: 12 }, (_, index) => (
                                                            <option key={index} value={index + 1}>
                                                                {index + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="dropdown-item">
                                                    <label htmlFor="day">Day</label>
                                                    <select name="day" id="daySelect">
                                                        {Array.from({ length: 31 }, (_, index) => (
                                                            <option key={index} value={index + 1}>
                                                                {index + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="">Gender <span className="star" style={{ color: "red" }}>*</span></label>
                                            <select name="gender" id="genderSelect">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="input-group card-section">
                            <div className="card-meta-1">
                                <div className="input-box">
                                    <label htmlFor="">Card Number <span className="star" style={{ color: "red" }}>*</span></label>
                                    <input type="text" id="cardNumber" />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="">Card Holder <span className="star" style={{ color: "red" }}>*</span></label>
                                    <input type="text" id="cardHolder" />
                                </div>
                            </div>
                            <div className="card-meta-2">
                                <label htmlFor="">Expiry Date</label>
                                <div className="dropDownGroup">
                                    <div className="dropdown-item">
                                        <label htmlFor="year">Year <span className="star" style={{ color: "red" }}>*</span></label>
                                        <select name="year" id="yearSelect">
                                            {Array.from({ length: 10 }, (_, index) => (
                                                <option key={index} value={new Date().getFullYear() - index}>
                                                    {new Date().getFullYear() - index}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="dropdown-item">
                                        <label htmlFor="month">Month <span className="star" style={{ color: "red" }}>*</span></label>
                                        <select name="month" id="monthSelect">
                                            {Array.from({ length: 12 }, (_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="dropdown-item">
                                        <div className="input-box">
                                            <label htmlFor="">CVV <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" id="cvv" />
                                        </div>
                                    </div>
                                    <div className="dropdown-item cardType">
                                        <label htmlFor="month">Card Type <span className="star" style={{ color: "red" }}>*</span></label>
                                        <select name="cardType" id="cardType">
                                            <option value="Visa">Visa</option>
                                            <option value="Master">Master</option>
                                            <option value="American Express">American Express</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card-meta-3">
                                <label htmlFor="">Billing Address</label>
                                <div className="dropDownGroup">
                                    <div className="dropdown-item country">
                                        <label htmlFor="" style={{ fontWeight: "bold" }}>Country <span className="star" style={{ color: "red" }}>*</span></label>
                                        <select name="country" id="countrySelect">
                                            <option value="Bangladesh">Bangladesh</option>
                                            <option value="India">India</option>
                                            <option value="Pakistan">Pakistan</option>
                                        </select>
                                    </div>
                                    <div className="grid-bi">
                                        <div className="input-box country">
                                            <label htmlFor="">Address 1 <span className="star" style={{ color: "red" }}>*</span></label>
                                            <input type="text" />
                                        </div>
                                        <div className="input-box country">
                                            <label htmlFor="">Address 2</label>
                                            <input type="text" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="card-meta-4">
                                <div className="dropDownGroup">
                                    <div className="input-box">
                                        <label htmlFor="">City <span className="star" style={{ color: "red" }}>*</span></label>
                                        <input type="text" />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="">State <span className="star" style={{ color: "red" }}>*</span></label>
                                        <input type="text" />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="">Zip Code <span className="star" style={{ color: "red" }}>*</span></label>
                                        <input type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="booking-details">
                        <div className="information-container">
                            <div className="flight-detail-container">
                                <h3 className="title-right">Flight Details</h3>

                                <div className="flightDetails">
                                    <div className="priceDisplay">
                                        <p>{price.symbol}{price.grandTotal}</p>
                                    </div>
                                    {
                                        flightSegments.segments.map((segment, index) => (
                                            <div className="segmentContainer" key={index}>
                                                <div className="carrier-info" >
                                                    <div className="carrier">
                                                        <img src={`https://images.kiwi.com/airlines/64/${segment.carrierCode}.png`} alt={segment.carrierCode} />
                                                        <div className="signature">
                                                            <h3>{dictionaries.carriers[segment.carrierCode]}</h3>
                                                            <p>{dictionaries.aircraft[segment.aircraft.code]}</p>
                                                        </div>
                                                    </div>
                                                    <div className="travel-comfort">
                                                        {segment.numberOfStops === 0 ? <p className="stopOver" style={{ color: "rgb(0, 194, 97)" }}>Direct</p> : <p className="stopOver" style={{ color: "orange" }}>{segment.numberOfStops} stop</p>}
                                                        {<p className="duration">{
                                                            segment.duration.split('T')[1].split('H')[0] + ` ${segment.duration.split('T')[1].split('H')[0] > 9 ? 'Hours' : 'Hour'}` + ' ' + segment.duration.split('T')[1].split('H')[1].split('M')[0] + `${segment.duration.split('T')[1].split('H')[1].split('M')[0] > 9 ? ' Minutes' : ' Minute'}`
                                                        }</p>}
                                                    </div>
                                                </div>
                                                <div className="destinations">
                                                    <div className="departure-info">
                                                        <h3 className="iataCode">{segment.departure.iataCode}</h3>
                                                        <p className="departure-date date">{`${new Date(segment.departure.at).getDate()}
                                                    ${new Date(segment.departure.at).toLocaleString('default', { month: 'short' })},
                                                    ${new Date(segment.departure.at).getFullYear()}`}</p>
                                                        <p className="departure-time time">{segment.departure.at.split('T')[1].split(':')[0] + ':' + segment.departure.at.split('T')[1].split(':')[1]}</p>
                                                    </div>
                                                    <div className="arrival-info">
                                                        <h3 className="iataCode">{segment.arrival.iataCode}</h3>
                                                        <p className="arrival-date date">{`${new Date(segment.arrival.at).getDate()}
                                                    ${new Date(segment.arrival.at).toLocaleString('default', { month: 'short' })},
                                                    ${new Date(segment.arrival.at).getFullYear()}`}</p>
                                                        <p className="arrival-time time">{segment.arrival.at.split('T')[1].split(':')[0] + ':' + segment.arrival.at.split('T')[1].split(':')[1]}</p>
                                                    </div>
                                                </div>
                                                <div className="features">
                                                    <div className="cabinType feature">{metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].cabin}</div>
                                                    <div className="circle"></div>
                                                    <div className="classType feature">CLASS {metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].class}</div>
                                                    <div className="circle"></div>
                                                    <div className="fareType feature">{metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].fareBasis}</div>
                                                    <div className="circle"></div>
                                                    <div className="baggage feature">CHECKIN {`${metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].includedCheckedBags.quantity} x ${metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].includedCheckedBags.weight ? metaData.flight.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[index].includedCheckedBags.weight : '0' } kg`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <button className="confirmBtn" onClick={handleOnClick}>Confirm booking</button>
                                </div>

                            </div>
                            <div className="each-passenger-detail">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;