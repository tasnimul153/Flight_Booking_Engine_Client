import { React, useState, useEffect } from 'react';
import { useRef } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import CounterButton from '../Input-Dropdown/CounterButton';
import './passenger.css';

const Passenger = ({ tag, passenger_count, class_type, onSelect }) => {
    const [dropdown, setDropdown] = useState(false);
    const [radioValue, setRadioValue] = useState(class_type);
    const dropdownRef = useRef(null);

    const handleRadioChange = (event) => {
        const newRadioValue = event.target.value;
        setRadioValue(newRadioValue);
        onSelect(passenger_count, newRadioValue);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdown(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdown]);

    return (
        <>
            <div className="passengers mainInput" ref={dropdownRef} style={{ position: 'relative' }}>
                <div className="dataBox passengerBox" onClick={() => { setDropdown(!dropdown); }}>
                    <span className='constant-tag'>{tag} <MdArrowDropDown className="icon" id='dropdownArrow' /></span>
                    <span className='number-of-passenger Middle'>{passenger_count} Traveler</span>
                    <span className='class-type Last'>{class_type}</span>
                </div>
                {dropdown && (
                    <div className={`passengerAndClassDropdown ${dropdown ? 'activeDrop' : 'inactiveDrop'}`}>
                        <div className='container'>
                            <div className='radio-inputs'>
                                <label className={`radio ${radioValue === 'Economy' ? 'active-radio' : ''}`}>
                                    <input
                                        type="radio"
                                        name='radio'
                                        value="Economy"
                                        checked={radioValue === "Economy"}
                                        onChange={handleRadioChange}
                                    />
                                    <span className="name">Economy</span>
                                </label>
                                <label className={`radio ${radioValue === 'Premium Economy' ? 'active-radio' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name='radio' 
                                        value="Premium Economy" 
                                        checked={radioValue === "Premium Economy"} 
                                        onChange={handleRadioChange}
                                    />
                                    <span className="name">Premium Economy</span>
                                </label>
                                <label className={`radio ${radioValue === 'Business' ? 'active-radio' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name='radio' 
                                        value="Business" 
                                        checked={radioValue === "Business"}
                                        onChange={handleRadioChange}
                                    />
                                    <span className="name">Business</span>
                                </label>
                                <label className={`radio ${radioValue === 'First Class' ? 'active-radio' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name='radio' 
                                        value="First Class" 
                                        checked={radioValue === "First Class"} 
                                        onChange={handleRadioChange}
                                    />
                                    <span className="name">First Class</span>
                                </label>
                            </div>
                            <div className='passengerCount'>
                                <span className='adultsTitle'>Passengers</span>
                                <CounterButton count={passenger_count} setCount={onSelect} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default Passenger;