import styled from 'styled-components';
import bgImage from '../../images/infobg.jpg';

export const InfoContainer = styled.div`
    color: #fff;
    display: grid;
    align-items: center !important;
    position: relative; /* Required for positioning the pseudo-element */
    background: ${({ lightBg }) =>
        lightBg
            ? '#f9f9f9'
            : `url(${bgImage}) no-repeat center center fixed`};
    background-size: ${({ lightBg }) => (lightBg ? 'auto' : 'cover')};

    @media screen and (max-width: 768px) {
        padding: 10% 0;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ lightBg }) =>
            lightBg ? 'none' : 'rgba(0, 0, 0, 0.5)'};
        z-index: 1;
        pointer-events: none;
    }
`;

export const InfoWrapper = styled.div`
    display: grid;
    z-index: 2; /* Ensure content is above the dark overlay */
    min-height: 100vh;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    overflow-y: visible;
    align-items: center;
`;

export const InfoRow = styled.div`
    display: grid;
    padding: 0 3%;
    grid-auto-columns: minmax(1fr, 1fr);
    align-items: center;
    gap: ${({ lightBg }) => (lightBg ? '50px' : '0')};
    width: 100%;
    height: 80%;
    grid-template-areas: ${({ imgStart }) => (imgStart ? `'col2 col1'` : `'col1 col2'`)};
    background-color: ${({ imgStart }) => (imgStart ? 'none' : 'white')};

    @media screen and (max-width: 768px) {
        grid-template-areas: ${({ imgStart }) => (imgStart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`)};
    }
`;

export const Column1 = styled.div`
    margin-bottom: 15px;
    padding: 0;
    grid-area: col1;
`;

export const Column2 = styled.div`
    padding: 0 15px;
    grid-area: col2;
    height: 100%;
    display: grid;
    align-items: center !important;
`;

export const TextWrapper = styled.div`
    max-width: 600px;
    margin-right: ${({ imgStart }) => (imgStart ? '5%' : '0')};
`;

export const TopLine = styled.p`
    color: rgb(87,65,217);
    font-size: 16px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 16px !important;
    margin-top: 10%;
    @media screen and (max-width: 480px) {
        margin-top: 0;
    }
`;

export const Heading = styled.h1`
    margin-bottom: 24px !important;
    font-size: 2em;
    line-height: 1.1;
    font-weight: 600;
    color: ${({ lightText }) => (lightText ? '#f7f8fa' : '#010606')};

    @media screen and (max-width: 480px) {
        font-size: 32px;
    }
`;

export const Subtitle = styled.p`
    max-width: 500px;
    margin-bottom: 35px !important;
    font-size: 18px;
    line-height: 24px;
    color: ${({ darkText }) => (darkText ? '#010606' : '#fff')};
`;

export const BtnWrap = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const ImgWrap = styled.div`
    height: 100%;
    display: grid;
    align-items: center;
`;

export const Img = styled.img`
    width: 100%;
    height: 80%;
    margin: 0 0 10px 0;
    padding-right: 0;
    transform: translateY(-100px);
    opacity: 0;
    transition: transform 1s ease-in-out, opacity 3s ease-in-out;

    &.fadeIn {
        transform: translateY(0);
        opacity: 1;
    }
`;
