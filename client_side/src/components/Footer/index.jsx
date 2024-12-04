import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa'; // Assuming you're using Font Awesome icons
import {
    FooterLinks,
    FooterContainer,
    FooterWrap,
    FooterLinksContainer,
    FooterLinkItems,
    FooterLinksWrapper,
    FooterLinkTitle,
    FooterLink,
    SocialMedia,
    SocialMediaWrap,
    SocialLogo,
    SocialIcons,
    WebsiteRights,
    SocialIconLink,
} from './FooterElements';
import { animateScroll as scroll } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    // Function from react-scroll
    const toggleHome = () => {
        scroll.scrollToTop();
    };

    const navigate = useNavigate();

    return (
        <FooterContainer>
            <FooterWrap>
                <FooterLinksContainer>
                    <FooterLinksWrapper>
                        <FooterLinkItems>
                            <FooterLinkTitle> About us </FooterLinkTitle>
                            <FooterLink to="/chatbot"> How it works </FooterLink>
                            <FooterLink to="/testimonials"> Testimonials </FooterLink>
                            <FooterLink to="/"> Careers </FooterLink>
                            <FooterLink to="/"> Investors </FooterLink>
                            <FooterLink to="/"> Terms of Service </FooterLink>
                        </FooterLinkItems>
                        <FooterLinkItems>
                            <FooterLinkTitle> Contact us </FooterLinkTitle>
                            <FooterLink to="/"> Contact </FooterLink>
                            <FooterLink to="/"> Support </FooterLink>
                            <FooterLink to="/"> Destinations </FooterLink>
                            <FooterLink to="/"> Sponsorships </FooterLink>
                        </FooterLinkItems>
                    </FooterLinksWrapper>
                    <FooterLinksWrapper>
                        <FooterLinkItems>
                            <FooterLinkTitle> Videos </FooterLinkTitle>
                            <FooterLink to="/"> Submit Video </FooterLink>
                            <FooterLink to="/"> Ambassadors </FooterLink>
                            <FooterLink to="/"> Agency </FooterLink>
                            <FooterLink to="/"> Influencers </FooterLink>
                        </FooterLinkItems>
                        <FooterLinkItems>
                            <FooterLinkTitle> Social Media </FooterLinkTitle>
                            <FooterLink href="https://web.facebook.com/KrakenFX/?_rdc=1&_rdr" target="_blank"> Facebook </FooterLink>
                            <FooterLink href='https://twitter.com/krakenfx' target="_blank"> Twitter </FooterLink>
                            <FooterLink href='https://www.instagram.com/krakenfx/' target="_blank"> Instagram </FooterLink>
                            <FooterLink href='https://www.linkedin.com/company/krakenfx' target="_blank"> Linkedin </FooterLink>
                        </FooterLinkItems>
                    </FooterLinksWrapper>
                </FooterLinksContainer>
                <SocialMedia>
                    <SocialMediaWrap>
                        <SocialLogo to='/' onClick={toggleHome}>
                            Babtech e-Learning
                        </SocialLogo>
                        <WebsiteRights>Babtech e-Learning © {new Date().getFullYear()} All rights reserved. </WebsiteRights>
                        <SocialIcons>
                            <SocialIconLink href="https://web.facebook.com/KrakenFX/?_rdc=1&_rdr" target="_blank" aria-label="Facebook">
                                <FaFacebook />
                            </SocialIconLink>
                            <SocialIconLink href='https://www.instagram.com/krakenfx/' target="_blank" aria-label="Instagram">
                                <FaInstagram />
                            </SocialIconLink>
                            <SocialIconLink href="/" target="_blank" aria-label="Youtube">
                                <FaYoutube />
                            </SocialIconLink>
                            <SocialIconLink href='https://twitter.com/krakenfx' target="_blank" aria-label="Twitter">
                                <FaTwitter />
                            </SocialIconLink>
                            <SocialIconLink href='https://www.linkedin.com/company/krakenfx' target="_blank" aria-label="Linkedin">
                                <FaLinkedin />
                            </SocialIconLink>
                        </SocialIcons>
                    </SocialMediaWrap>
                </SocialMedia>
            </FooterWrap>
            <button onClick={() => {navigate('./videoCall')}}> to videocall</button>
            <button
        onClick={() => navigate("/testVc")}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Test Video Call
      </button>
        </FooterContainer>
    );
};

export default Footer;
