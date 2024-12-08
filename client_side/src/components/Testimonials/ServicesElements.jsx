import styled from 'styled-components';
import bgImage from '../../images/testimonial.jpeg'; // Make sure to use the correct path to your image

export const ServicesContainer = styled.div`
    position: relative; /* Required for positioning the pseudo-element */
    background: url(${bgImage}) no-repeat center center fixed;
    background-size: cover; /* Ensure the background image covers the entire container */
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;
    cursor: pointer;
    

    @media screen and (max-width: 768px) {
        height: 1300px;
        margin: auto 120px;
        color: white;
    }

    @media screen and (max-width: 480px) {
        height: 1300px;
        margin:  auto;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Dark overlay with 50% opacity */
        z-index: 1; /* Ensure the overlay is below the content but above the background image */
        pointer-events: none; /* Allow interaction with content */
    }
`;

export const ServicesWrapper = styled.div`
    position: relative; /* Ensure this content is above the dark overlay */
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 0 50px;
    margin-bottom: 5em;
    z-index: 2; /* Ensure the content is above the dark overlay */
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
    position: relative; /* Required for content layering */
    cursor: pointer;

    &:hover {
        transform: scale(1.02);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }
`;

export const ServicesIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 10px;
`;

export const ServicesH1 = styled.h1`
    font-size: 2.5rem;
    color: #000;
    margin: 1em 0;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`;

export const ServicesH2 = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
`;
export const ServicesH3 = styled.h3`
   @media screen and (max-width: 768px){
   text-align: justify;
   border: 2px solid red;
   }
`;

export const ServicesP = styled.p`
    font-size: 1rem;
    text-align: center;
    font-style: italic;
    overflow-y: auto;
`;
