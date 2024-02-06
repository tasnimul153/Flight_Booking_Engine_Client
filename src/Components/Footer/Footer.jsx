import React from 'react';
import './footer.css';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer__container'>
                <div className='infoBox'>
                    <div className="about">
                        <h2>About</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className='services'>
                        <h2>Services</h2>
                        <ul>
                            <li>Flight search</li>
                            <li>Booking flights</li>
                            <li>Select seats</li>
                            <li>Cheap flights</li>
                        </ul>
                    </div>
                    <div className="contact">
                        <h2>Contact</h2>
                        <ul>
                            <li><span className='bold-span'>Address:</span> 51 Falcons Nest Cir</li>
                            <li><span className='bold-span'>Apartment:</span> 99-6</li>
                            <li><span className='bold-span'>Contact:</span> (432) 316 - 0316</li>
                        </ul>
                    </div>
                </div>
                <div className='iconsGroup'>
                    <FaFacebook className="icons" />
                    <FaInstagram className="icons" />
                    <FaTwitter className="icons" />
                    <FaYoutube className="icons" />
                </div>
                <div className='footer-last'>
                    <p>© 2023 All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;