import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import Logo from "../../images/logo.svg"; // Make sure this path is correct
import { animateScroll as scroll } from "react-scroll";
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";

const Navbar = ({ toggle, otp }) => {
  const [scrollNav, setScrollNav] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
    return () => {
      window.removeEventListener("scroll", changeNav);
    };
  }, []);

  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <Nav scrollNav={scrollNav}>
        <NavbarContainer>
          <NavLogo to="/" onClick={toggleHome}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "2em", height: "2em" }}
            />
            <p>Babtech e-Learning</p>
          </NavLogo>

          {!otp && (
            <>
              <MobileIcon onClick={toggle}>
                <FaBars />
              </MobileIcon>
              <NavMenu>
                <NavItem>
                  <NavLinks to="about" smooth duration={500} spy exact>
                    Services
                  </NavLinks>
                </NavItem>
                <NavItem>
                  <NavLinks to="discover" smooth duration={500} spy exact>
                    Discover
                  </NavLinks>
                </NavItem>
                <NavItem>
                  <NavLinks to="services" smooth duration={500} spy exact>
                    About
                  </NavLinks>
                </NavItem>
                <NavItem>
                  <NavLinks to="testimonials" smooth duration={500} spy exact>
                    Testimonials
                  </NavLinks>
                </NavItem>
              </NavMenu>
              <NavBtn>
                <NavBtnLink to="/signin">Sign In</NavBtnLink>
                <NavBtnLink
                  to="/code-authenticator"
                  style={{ marginLeft: "10px" }}
                >
                  Register
                </NavBtnLink>
              </NavBtn>
            </>
          )}
        </NavbarContainer>
      </Nav>
    </IconContext.Provider>
  );
};

export default Navbar;
