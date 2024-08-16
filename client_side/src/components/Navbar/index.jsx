import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib';
import  Logo from '../../images/logo.svg';
import { animateScroll as scroll } from 'react-scroll'
import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavBtn,
    NavBtnLink
} from './NavbarElements';
const Navbar = ({ toggle }) => {

    const [scrollNav, setScrollNav] = useState(false)

    const changeNav = () => {
        let abortController = new AbortController();
        if (window.scrollY >= 80) {
            setScrollNav(true)
        } else {
            setScrollNav(false)
        }

        //console.log(window)

        return () => {
            abortController.abort();
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', changeNav)
    }, [])

    // Function from react-scroll
    const toggleHome = () => {
        scroll.scrollToTop();
    }


    return (
        // Empty tags are simplified <React.Fragment>

        // NavLogo is a react router link, which means that
        // it needs to have its own version of href, which is 'to'

        // IconContext.Provider is useful to change color of all icons
        // within the context

        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav scrollNav={scrollNav}>
                    <NavbarContainer>
                        <NavLogo to="/" onClick={toggleHome} scrollNav={scrollNav}>
                        <img src={Logo} style={{width:"2em", height:"2em"}}/>
                        <p>Babtech e-Learning</p>
                        </NavLogo>
                        <MobileIcon onClick={toggle}>
                            <FaBars />
                        </MobileIcon>
                        <NavMenu >
                            <NavItem scrollNav={scrollNav}>
                                <NavLinks
                                scrollNav={scrollNav}
                                to="about"
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass='active'
                                exact='true'
                                > Services </NavLinks>
                            </NavItem>
                            <NavItem scrollNav={scrollNav}>
                                <NavLinks
                                scrollNav={scrollNav}
                                to="discover"
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass='active'
                                exact='true'> Discover </NavLinks>
                            </NavItem >
                            <NavItem scrollNav={scrollNav}>
                                <NavLinks 
                                scrollNav={scrollNav}
                                to="services"
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass='active'
                                exact='true'> About </NavLinks>
                            </NavItem>
                            <NavItem >
                                <NavLinks
                                scrollNav={scrollNav} 
                                to="testimonials"
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass='active'
                                exact='true'> Testimonials </NavLinks>
                            </NavItem>
                        </NavMenu>
                        <NavBtn >
                            <NavBtnLink to="/signin" scrollNav={scrollNav}> Sign In</NavBtnLink>
                        </NavBtn>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar;