import { React, useEffect, useState } from "react";
import "./navbar.css";
import { SiYourtraveldottv } from "react-icons/si";
import { AiFillCloseCircle } from "react-icons/ai";
import { HiBars3BottomRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginForm from "../Authentication/LoginForm";

const Navbar = () => {
  const location = useLocation();
  const [navLink, setNavLink] = useState("navLink");
  const [buttonClass, setButtonClass] = useState("signupButtonHomePage");
  const [logoClass, setLogoClass] = useState("logoHomePage");

  const [active, setActive] = useState("navBar");
  const [navBarBackground, setNavBarBackground] = useState("transparent");
  const [signupButtonClicked, setSignupButtonClicked] = useState(false);
  const [toggleButtonColor, setToggleButtonColor] = useState("black");

  useEffect(() => {
    if (location.pathname === "/") {
      // Home Page
      setNavLink("navLink");
      setButtonClass("signupButtonHomePage");
      setLogoClass("logoHomePage");
      setNavBarBackground("transparent");
      setToggleButtonColor("black");
    } else {
      // Other Pages
      setNavLink("navLinkOthers");
      setButtonClass("signupButtonOtherPage");
      setLogoClass("logoOtherPage");
      setNavBarBackground("white");
      if (signupButtonClicked) {
        setNavBarBackground('url("../../Assets/image-from-rawpixel-id-3713064-original.png")');
      } else {
        setNavBarBackground("white");
      }
    }
  }, [location.pathname, signupButtonClicked]);

  // Toggle Navigation Bar
  const showNav = () => {
    if (active === "navBar activeNavBar") {
      setActive("navBar");
    } else {
      setActive("navBar activeNavBar");
    }
  };

  // Sign Up Button Click
  const onSignupButtonClick = () => {
    setSignupButtonClicked(!signupButtonClicked);
  };

  return (
    <>
      {/* Sign Up Button Clicked */}
      {signupButtonClicked && (<LoginForm toggle={setSignupButtonClicked} />)}

      {/* Navigation Bar */}
      <section className="navBarSection" style={{ background: navBarBackground }}>
        <header className="header flex">
          {/* Company Logo */}
          <div className="logoDiv">
            <Link to="/" className="logo flex">
              <h1 className={logoClass}>
                <SiYourtraveldottv /> A-1 TRAVEL AND TOURS
              </h1>
            </Link>
          </div>

          {/* Navigation Bar */}
          <div className={active}>
            <ul className="navLists flex">
              <li className="navItem">
                <Link to='/'>
                  <a href="#" className={navLink}>HOME</a>
                </Link>
              </li>
              <li className="navItem">
                <a href="#" className={navLink}>SERVICES</a>
              </li>
              <li className="navItem">
                <a href="#" className={navLink}>ABOUT</a>
              </li>
              <button className={buttonClass} onClick={onSignupButtonClick}>Sign Up</button>
            </ul>
          </div>

          {/* Toggle Navigation Bar */}
          <div className="toggleNavBar" onClick={showNav}>
            <HiBars3BottomRight className="icon" style={{color: toggleButtonColor}} />
          </div>
        </header>
      </section>
    </>
  );
};

export default Navbar;
