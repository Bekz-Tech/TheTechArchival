import styled from 'styled-components';
import bgImage from '../../images/testimonial.jpeg'; // Ensure correct path to your image

export const ServicesContainer = styled.div`
    position: relative; 
    background: url(${bgImage}) no-repeat center center fixed;
    background-size: cover; 
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;
    cursor: pointer;
    padding: 100px 0;

    @media screen and (max-width: 1280px) {
        padding: 80px 0;
    }

    @media screen and (max-width: 1024px) {
        padding: 70px 0;
    }

    @media screen and (max-width: 768px) {
        height: 1300px;
        margin: 0 auto;
        color: white;
        padding: 60px 20px;
    }

    @media screen and (max-width: 480px) {
        height: 1300px;
        margin: -150px auto;
        padding: 50px 10px;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); 
        z-index: 1; 
        pointer-events: none; 
    }
`;

export const ServicesWrapper = styled.div`
    position: relative; 
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 0 50px;
    margin-bottom: 5em;
    z-index: 2; 

    @media screen and (max-width: 1280px) {
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        padding: 0 20px;
    }

    @media screen and (max-width: 480px) {
        grid-template-columns: 1fr;
        padding: 0 10px;
    }

    @media screen and (max-width: 375px) {
        grid-template-columns: 1fr;
        padding: 0;
    }
`;

export const ServicesCard = styled.div`
    background: #000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    max-height: 340px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
    color: white;
    position: relative;
    text-align: center; /* Center text alignment */
    cursor: pointer;

    &:hover {
        transform: scale(1.02);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        max-height: 300px;
        padding: 20px;
    }

    @media screen and (max-width: 480px) {
        max-height: 280px;
        padding: 15px;
    }
`;

export const ServicesIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 10px;

    @media screen and (max-width: 480px) {
        height: 120px;
        width: 120px;
    }
`;

export const ServicesH1 = styled.h1`
    font-size: 2.5rem;
    color: #000;
    margin: 1em 0;
    text-align: center;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`;

export const ServicesH2 = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
    text-align: center; /* Center the text */
`;

export const ServicesP = styled.p`
    font-size: 1rem;
    text-align: center; /* Ensure the text is centered */
    font-style: italic;
    overflow-y: auto;
`;
