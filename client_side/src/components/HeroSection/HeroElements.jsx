import styled, { keyframes } from 'styled-components';
import { MdKeyboardArrowRight, MdArrowForward } from 'react-icons/md';
import { ButtonNavigate } from '../ButtonElement';

// Define keyframes for slide animation
const slide = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const HeroContainer = styled.div`
    background: #0c0c0c;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 90vh;
    position: relative;
    z-index: 1;
    :before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%),
        linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%);
        z-index: 2;
    }
`;

export const HeroBg = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const ImgBg = styled.img`
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    background: #232a34;
    opacity: 50%;
`;

export const HeroContent = styled.div`
    z-index: 3;
    max-width: 1200px;
    position: absolute;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 15vh;
`;

export const HeroH1 = styled.h1`
    color: #fff;
    font-size: 54px;
    text-align: center;
    @media screen and (max-width: 768px) {
        font-size: 40px;
    }

    @media screen and (max-width: 480px) {
        font-size: 32px;
    }
`;

export const HeroP = styled.p`
    margin-top: -2% !important;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600px;
    font-weight: bold;

    @media screen and (max-width: 768px) {
        margin: 5% 0 !important;
        font-size: 18px;
        font-weight: normal;
    }

    @media screen and (max-width: 480px) {
        font-size: 16px;
    }
`;

export const HeroBtnWrapper = styled.div`
    margin-top: 5% !important;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size: 20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)``;

export const MarqueeContainer = styled.div`
    position: absolute;
    bottom: 5%;
    width: 100%;
    height: auto;
    overflow-x: hidden; /* Hide horizontal overflow */
    overflow-y: visible !important; /* Allow vertical overflow */
    white-space: nowrap;
    z-index: 11;
`;


export const MarqueeContent = styled.div`
    display: flex;
    gap: 1%;
    white-space: nowrap;
    width: max-content;
    animation: ${slide} 60s linear infinite;
`;

export const ButtonContainer = styled.div`
    display: inline-block;
    width: auto;
    margin-right: 100px;
`;

export const CourseButton = styled(ButtonNavigate)`
    position: relative;
    display: inline-block;
    transition: transform 0.3s ease-in-out;
    &:hover {
        transform: scale(1.03);
    }
`;

export const HoverImage = styled.img`
    // position: absolute;
    bottom: 100%; /* Position above the button */
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    height: 200px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 1000;
    border-radius: 10px;
    margin-right: 100px;


    &.visible {
        opacity: 1;
    }
`;
