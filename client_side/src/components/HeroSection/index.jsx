import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    HeroContainer,
    HeroBg,
    ImgBg,
    HeroContent,
    HeroH1,
    HeroP,
    HeroBtnWrapper,
    ArrowForward,
    MarqueeContainer,
    MarqueeContent,
    CourseButton,
    HoverImage,
    ButtonContainer
} from './HeroElements';
import bgImg from "../../images/coding-bg.avif";
import { ButtonNavigate } from '../ButtonElement';
import backend from "../../images/backend.jpeg";
import cyberSecurity from "../../images/cyber-security.jpeg";
import dataScience from "../../images/data-science.jpeg";
import frontend from "../../images/frontend.jpeg";
import mobileApp from "../../images/mobile-app.jpeg";
import fullstack from "../../images/fullstack.jpeg";
import ui from "../../images/ui-ux.jpeg";

const HeroSection = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [fade, setFade] = useState('in');
    const hoverImageRefs = useRef([]);
    const marqueeContentRef = useRef();

    const heroTexts = [
        "Become A Tech Professional Today",
        "Join Our Coding Bootcamp",
        "Learn From Industry Experts",
        "Build Real-World Projects"
    ];

    const courseButtons = [
        { text: "Frontend Development", image: frontend },
        { text: "Backend Development", image: backend },
        { text: "Full Stack Development", image: fullstack },
        { text: "Mobile Development", image: mobileApp },
        { text: "Data Science", image: dataScience },
        { text: "UI/UX Design", image: ui },
        { text: "Cybersecurity", image: cyberSecurity },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFade('out');
            setTimeout(() => {
                setCurrentTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
                setFade('in');
            }, 1000); // Match this duration to the fadeOut animation duration
        }, 4000);

        return () => clearInterval(interval);
    }, [heroTexts.length]);

    const getStyledText = (text) => {
        const words = text.split(' ');
        const lastWord = words.pop();
        return (
            <>
                {words.join(' ')} <span style={{ color: '#01bf71' }}>{lastWord}</span>
            </>
        );
    };

    const handleMouseEnter = (index) => {
        hoverImageRefs.current[index].classList.add('visible');
        marqueeContentRef.current.style.animationPlayState = 'paused';
    };

    const handleMouseLeave = (index) => {
        hoverImageRefs.current[index].classList.remove('visible');
        marqueeContentRef.current.style.animationPlayState = 'running';
    };

    return (
        <HeroContainer id="home">
            <HeroBg>
                <ImgBg src={bgImg} alt="hero section background image" />
            </HeroBg>
            <HeroContent>
                <HeroH1 fade={fade}>{getStyledText(heroTexts[currentTextIndex])}</HeroH1>
                <HeroP>
                    Sign up for the next cohort of virtual classes. <br />
                    Code with a team of experts on real-time projects.
                </HeroP>
                <Link to="/chatbot">
                    <HeroBtnWrapper>
                        <ButtonNavigate
                            to="/chatbot"
                            smooth={true}
                            duration={500}
                            spy={true}
                            exact="true"
                            primary={true}
                            big={true}
                            dark={true}
                            fontBig={true}
                        >
                            Get started
                            <ArrowForward />
                        </ButtonNavigate>
                    </HeroBtnWrapper>
                </Link>
            </HeroContent>
            <MarqueeContainer>
                <MarqueeContent ref={marqueeContentRef}>
                    {courseButtons.concat(courseButtons).map((course, index) => (
                        <ButtonContainer
                            key={index}
                        >
                            <CourseButton
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                {course.text}
                            </CourseButton>
                            <HoverImage
                                ref={el => hoverImageRefs.current[index] = el}
                                src={course.image}
                                alt={course.text}
                            />
                        </ButtonContainer>
                    ))}
                </MarqueeContent>
            </MarqueeContainer>
        </HeroContainer>
    );
};

export default HeroSection;
