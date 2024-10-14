import React from 'react';
import styled from 'styled-components';
import bgImage from "../../images/infobg.jpg";
import frontendImg from "../../images/frontend.jpeg";
import uiuxImg from "../../images/ui-ux.jpeg";
import fullstackImg from "../../images/fullstack.jpeg";
import dataAnalysisImg from "../../images/mobile-app.jpeg";
import dataScienceImg from "../../images/data-science.jpeg";
import softwareEngImg from "../../images/mobile-app.jpeg";
import backendDevImg from "../../images/backend.jpeg";
import cyberSecImg from "../../images/cyber-security.jpeg";

const courses = [
  { name: 'Frontend Development', description: 'Learn to build modern web applications using HTML, CSS, and JavaScript.', image: frontendImg },
  { name: 'UI/UX Design', description: 'Design intuitive and engaging user interfaces and experiences.', image: uiuxImg },
  { name: 'Fullstack Development', description: 'Become a versatile developer by mastering both frontend and backend technologies.', image: fullstackImg },
  { name: 'Data Analysis', description: 'Analyze and interpret complex data to make informed business decisions.', image: dataAnalysisImg },
  { name: 'Data Science', description: 'Explore the world of data science and learn how to extract insights from data.', image: dataScienceImg },
  { name: 'Software Engineering', description: 'Learn principles of software design and development for creating scalable applications.', image: softwareEngImg },
  { name: 'Backend Development', description: 'Focus on server-side development and database management.', image: backendDevImg },
  { name: 'Cyber Security', description: 'Understand techniques for protecting systems and networks from cyber threats.', image: cyberSecImg },
];

const CardDescription = styled.p`
  font-size: 0.8em;
  font-weight: semi-bold;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
  color: #fff;
  padding: 10px;
  border-radius: 0 0 10px 10px;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  z-index: 3;
`;

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  padding: 10px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s, color 0.3s, background 0.3s;
  overflow: hidden;
  height: auto;
  cursor: pointer;
  z-index: 2;

  &:hover {
    transform: scale(1.05);
    background: rgba(0, 0, 0, 1);
    color: #fff;
  }

  &:hover ${CardDescription} {
    transform: translateY(0);
    opacity: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s;
    z-index: 1;
  }
`;

const Container = styled.div`
  background: url('${bgImage}') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 3% 0;

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

const CardContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  padding: 1% 30px;
  z-index: 2;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  @media (max-width: 375px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (max-width: 320px) {
    grid-template-columns:1fr;
    gap: 10px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 230px;
  border-radius: 10px;
  position: relative;
  z-index: 2;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 5px;
  margin-top: 1%;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }

  @media (max-width: 480px) {
    font-size: 1em;
  }

  @media (max-width: 375px) {
    font-size: 0.9em;
  }

  @media (max-width: 320px) {
    font-size: 0.8em;
  }
`;

const CardHeader = styled.h1`
  font-size: 2.5em;
  margin-bottom: 15px;
  text-align: center;
  color: white;
  font-weight: 700;
  z-index: 2;
  border:2px solid red;

  @media (max-width: 768px) {
    font-size: 2em;
  }

  @media (max-width: 480px) {
    font-size: 1.8em;
  }

  @media (max-width: 375px) {
    font-size: 1.5em;
  }

  @media (max-width: 320px) {
    font-size: 1.5em;
  }
`;

const Courses = () => {
  return (
    <Container>
      <CardHeader>Our Courses</CardHeader>
      <CardContainer>
        {courses.map((course, index) => (
          <Card key={index}>
            <CardImage src={course.image} alt={course.name} />
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </Card>
        ))}
      </CardContainer>
    </Container>
  );
};

export default Courses;
