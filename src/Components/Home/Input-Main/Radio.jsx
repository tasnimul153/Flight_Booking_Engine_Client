import { React, useState } from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

const Radio = ({ onRadioChange }) => {
    const [activeRadio, setActiveRadio] = useState('radio_input oneway');

    const toggleRadio = (event) => { 
        const radioValue = event.target.value;
        setActiveRadio('radio_input' + " " + radioValue);
        onRadioChange(radioValue);
    };

    return (
        <div className="radioBox">
            <div className={activeRadio === 'radio_input oneway' ? 'radio_input activeRadio' : 'radio_input'} onClick={toggleRadio}>
                <IoCheckmarkCircleSharp className='icon' id={activeRadio === 'radio_input oneway' ? 'activeIcon' : 'inactiveIcon'} />
                <input type="radio" className='radio_button' value="oneway" name="oneway" id="oneway" checked={activeRadio === 'radio_input oneway'} onChange={toggleRadio} />
                <label htmlFor="oneway" onClick={toggleRadio} className='radio_label'>One Way</label>
            </div>
            <div className={activeRadio === 'radio_input roundtrip' ? 'radio_input activeRadio' : 'radio_input'} onClick={toggleRadio}>
                <IoCheckmarkCircleSharp className='icon' id={activeRadio === 'radio_input roundtrip' ? 'activeIcon' : 'inactiveIcon'} />
                <input type="radio" className='radio_button' value="roundtrip" name="roundtrip" id="roundtrip" checked={activeRadio === 'radio_input roundtrip'} onChange={toggleRadio} />
                <label htmlFor="roundtrip" className='radio_label'>Round Trip</label>
            </div>
            <div className={activeRadio === 'radio_input multicity' ? 'radio_input activeRadio' : 'radio_input'} onClick={toggleRadio}>
                <IoCheckmarkCircleSharp className='icon' id={activeRadio === 'radio_input multicity' ? 'activeIcon' : 'inactiveIcon'} />
                <input type="radio" className='radio_button' value="multicity" name="multicity" id="multicity" checked={activeRadio === 'radio_input multicity'} onChange={toggleRadio} />
                <label htmlFor="multicity" className='radio_label'>Multi City</label>
            </div>
        </div>
    );
};

export default Radio;