import styled from 'styled-components'
import { Link as LinkR } from 'react-router-dom'
import { Link as LinkS } from 'react-scroll'

export const Nav = styled.nav`
    background: ${({scrollNav}) => (scrollNav ? 'white' : 'black')};
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
    transition: 0.8s all ease;

    @media screen and (max-width: 768px) {
        height: 70px;
    }

    @media screen and (max-width: 480px) {
        height: 60px;
    }
`;

export const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    z-index: 1;
    width: 100%;
    padding: 0 50px;

    @media screen and (max-width: 1280px) {
        padding: 0 40px;
    }

    @media screen and (max-width: 1024px) {
        padding: 0 35px;
    }

    @media screen and (max-width: 768px) {
        padding: 0 30px;
    }

    @media screen and (max-width: 480px) {
        padding: 0 20px;
    }

    @media screen and (max-width: 375px) {
        padding: 0 15px;
    }

    @media screen and (max-width: 320px) {
        padding: 0 10px;
    }
`;

export const NavLogo = styled(LinkR)`
    color: ${({scrollNav}) => (scrollNav ? '#000000' : '#fff')};
    justify-self: flex-start;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    font-weight: bold;
    text-decoration: none;
    gap: 15px !important;

    @media screen and (max-width: 1280px) {
        font-size: 1.5rem;
    }

    @media screen and (max-width: 1024px) {
        font-size: 1.4rem;
    }

    @media screen and (max-width: 768px) {
        font-size: 1.4rem;
    }

    @media screen and (max-width: 480px) {
        font-size: 1.3rem;
    }

    @media screen and (max-width: 375px) {
        font-size: 1.2rem;
    }

    @media screen and (max-width: 320px) {
        font-size: 1.1rem;
    }
`;

export const MobileIcon = styled.div`
    display: none;

    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
        color: #fff;
    }
`;

export const NavMenu = styled.ul`
    color: ${({scrollNav}) => (scrollNav ? '#00000' : '#fff')};
    display: flex;
    align-items: center;
    list-style: none;
    text-align: center;
    margin-right: -22px;
    gap: 50px;

    @media screen and (max-width: 1280px) {
        gap: 40px;
    }

    @media screen and (max-width: 1024px) {
        gap: 30px;
    }

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavItem = styled.li`
    height: 80px;
`;

export const NavLinks = styled(LinkS)`
    color: ${({scrollNav}) => (scrollNav ? 'black' : 'white')};
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    font-weight: bold;

    &.active {
        border-bottom: 3px solid rgb(87,65,217);
        padding-bottom: 0.2em;
    }

    &:hover {
        transition: all 0.2s ease-in-out;
        color: rgb(87,65,217);
    }
`;

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: ${({scrollNav}) => (scrollNav ? 'black' : 'rgb(87,65,217)')};
    white-space: nowrap;
    padding: 10px 22px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }

    @media screen and (max-width: 768px) {
        display: none;
    }
`;
