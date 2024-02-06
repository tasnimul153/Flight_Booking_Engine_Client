import { React } from "react";

const DropdownLocation = ({ city, country, airport, code, onDropdownItemSelect}) => {

    const handleSelect = () => {
        onDropdownItemSelect(city, country, airport, code);
    };

    return (
        <div className="dropdownItem" onClick={handleSelect}>
            <div className="MetaLocation">
                <div className="location-name">
                    <span className="City">{city}</span>,{" "}
                    <span className="Country">{country}</span>
                </div>
                <span className="airport-name">{airport}</span>
            </div>
            <span className="airport-code">{code}</span>
        </div>
    );
};

export default DropdownLocation;