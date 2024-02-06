import React, { useEffect, useRef } from 'react';
import './LoginForm.css';
import { FcGoogle } from "react-icons/fc";

const LoginForm = ({ toggle }) => {
    const formRef = useRef(null);

    useEffect(() => {
        // handle outside clicks on the form
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                toggle(false);
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Return a cleanup function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // add animation class
    useEffect(() => {
        if (toggle) {
            document.querySelector('.full-page').classList.add('animated-fade');
        } else {
            document.querySelector('.full-page').classList.remove('animated-fade');
        }
    }, [toggle]);

    return (
        <div className='full-page'>
            <div className="login-container" ref={formRef}>
                <div className='image'></div>
                <div className='form-box'>
                    <div className="login-header">
                        <h1>Sign In</h1>
                    </div>
                    <div className="login-body">
                        <div className="input-group">
                            <input type="email" placeholder="Email address" />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" />
                        </div>
                        <div className="partial-group">
                            <div className='checkbox-group'>
                                <input type="checkbox" disabled id="remember-me" />
                                <label htmlFor="remember-me">Remember me for 30 days</label>
                            </div>
                            <a href="#" className="forgot-link">Forgot password</a>
                        </div>
                        <button className="login-button">Log in</button>
                        <div className="divider"></div>
                        <button className="google-button"><FcGoogle className='icon'/> Log in with Google</button>
                    </div>
                    <div className="login-footer">
                        Don't have an account? <a href="#" className="register-link">Register now</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;