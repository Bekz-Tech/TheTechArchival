import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FooterContainer = styled.footer`
    background-color: #000000;
    padding: 48px 0;
`;

export const FooterWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;
    gap: 10%;
    margin: 0;

    @media screen and (max-width: 1280px) {
        padding: 40px 0;
    }

    @media screen and (max-width: 1024px) {
        padding: 36px 0;
    }

    @media screen and (max-width: 768px) {
        padding: 32px 0;
    }

    @media screen and (max-width: 480px) {
        padding: 24px 0;
    }

    @media screen and (max-width: 375px) {
        padding: 20px 0;
    }

    @media screen and (max-width: 320px) {
        padding: 16px 0;
    }
`;

export const FooterLinksContainer = styled.div`
    display: flex;
    justify-content: center;

    @media screen and (max-width: 1024px) {
        padding-top: 24px;
    }
`;

export const FooterLinksWrapper = styled.div`
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap to the next line */
    justify-content: center; /* Center the items */

    @media screen and (max-width: 768px) {
        flex-direction: row; /* Change to row for smaller screens */
    }
`;

export const FooterLinkItems = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; /* Center-align items */
    margin: 16px;
    text-align: center; /* Center text */
    width: 160px;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width: 480px) {
        margin: 10px;
        width: 120px; /* Adjust width for smaller screens */
    }

    @media screen and (max-width: 375px) {
        margin: 8px;
        width: 100px; /* Further adjust width for smaller screens */
    }

    @media screen and (max-width: 320px) {
        margin: 5px;
        width: 100%; /* Full width on very small screens */
    }
`;

export const FooterLinkTitle = styled.h1`
    font-size: 1.2em;
    margin-bottom: 16px;
    color: rgb(87, 65, 217);
    text-align: center; /* Center the title text */

    @media screen and (max-width: 768px) {
        font-size: 1.1em;
    }

    @media screen and (max-width: 480px) {
        font-size: 1rem;
    }

    @media screen and (max-width: 375px) {
        font-size: 0.9rem;
    }

    @media screen and (max-width: 320px) {
        font-size: 0.8rem;
    }
`;

export const FooterLink = styled.a`
    color: #fff;
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        color: rgb(87, 65, 217);
        transition: 0.3s ease-out;
    }

    @media screen and (max-width: 768px) {
        font-size: 13px;
    }

    @media screen and (max-width: 480px) {
        font-size: 12px;
    }

    @media screen and (max-width: 320px) {
        font-size: 11px;
    }
`;

export const FooterLinks = styled(Link)`
    color: #fff;
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        color: #01bf71;
        transition: 0.3s ease-out;
    }

    @media screen and (max-width: 768px) {
        font-size: 13px;
    }

    @media screen and (max-width: 480px) {
        font-size: 12px;
    }

    @media screen and (max-width: 320px) {
        font-size: 11px;
    }
`;

export const SocialMedia = styled.section`
    max-width: 1000px;
    width: 100%;
`;

export const SocialMediaWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;

    @media screen and (max-width: 820px) {
        flex-direction: column;
    }
`;

export const SocialLogo = styled(Link)`
    color: rgb(87, 65, 217);
    justify-self: start;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-weight: bold;

    @media screen and (max-width: 480px) {
        font-size: 1.4rem;
    }

    @media screen and (max-width: 320px) {
        font-size: 1.2rem;
    }
`;

export const WebsiteRights = styled.small`
    color: #fff;
    margin-bottom: 16px;
    padding-left: 80px;

    @media screen and (max-width: 820px) {
        padding-left: 0;
        text-align: center; /* Center-align text on small screens */
    }

    @media screen and (max-width: 320px) {
        text-align: center;
        width: 100%;
    }
`;

export const SocialIcons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 240px;

    @media screen and (max-width: 480px) {
        width: 200px;
    }

    @media screen and (max-width: 320px) {
        width: 180px;
    }
`;

export const SocialIconLink = styled.a`
    color: #fff;
    font-size: 24px;

    @media screen and (max-width: 768px) {
        font-size: 22px;
    }

    @media screen and (max-width: 320px) {
        font-size: 20px;
    }
`;
