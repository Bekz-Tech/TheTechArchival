import styled from 'styled-components';
import { Link } from 'react-router-dom';
import bgImage from '../../images/login-bg.jpeg';

export const Container = styled.div`
  overflow: hidden;
  background-size: cover;
  background-position: center;
  height: 100%;
  background-image: url(${bgImage});

  @media screen and (max-width: 1024px) {
    height: auto; /* Allow for taller content on smaller screens */
  }

  @media screen and (max-width: 768px) {
    background-image: none; /* Remove the background image */
  }

    @media screen and (max-width: 320px) {
    height:100vh;
    width: auto;
    }
`;

export const FormWrap = styled.div`
  height: auto; /* Changed to auto for better fitting */
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2; /* Ensure content is above the overlay */
  margin: -50px auto 0 auto !important;

  @media screen and (max-width: 1280px) {
    width: 350px; /* Slightly reduce width for larger tablets */
  }

  @media screen and (max-width: 1024px) {
    width: 300px; /* Reduce width for medium devices */
  }

  @media screen and (max-width: 768px) {
    width: 100%; /* Full width on smaller devices */
    margin: 20px auto; /* Auto-center the form */
    padding: 10px; /* Add padding for smaller screens */
  }

  @media screen and (max-width: 480px) {
    height: 100%; 
    width: 100%;
    padding: 20px; /* Add more padding for smallest screens */
  }
`;

export const Icon = styled(Link)`
  margin-left: 32px;
  margin-top: 32px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 35px;
  position: relative;
  z-index: 2;

  @media screen and (max-width: 480px) {
    margin-left: 16px;
    margin-top: 8px;
    font-size: 30px; /* Smaller font size */
  }
`;

export const FormContent = styled.div`
  height: auto; /* Change to auto */
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  color: #000000;

  @media screen and (max-width: 480px) {
    padding: 0 10px !important; 
  }

   @media screen and (max-width: 375px) {
   height: 50%;
   width: auto;
   }

   @media screen and (max-width: 320px) {
   height: 50vh;
   z-index:5;
  //  width: auto;
   }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  width: 100%;
  z-index: 3;
  margin: 10% auto; /* Adjusted for better centering */
  padding: 5%;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 1280px) {
    padding: 4%;
  }

  @media screen and (max-width: 1024px) {
    padding: 3%;
  }

  @media screen and (max-width: 768px) {
    padding: 2%; /* Reduce padding on smaller screens */
    margin: 15% auto; /* Adjust centering for better appearance */
  }

  @media screen and (max-width: 480px) {
    padding: 30px; /* More padding for smaller devices */
  }
`;

export const FormH1 = styled.h1`
  margin-bottom: 5%;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  position: relative;
  z-index: 3;

  @media screen and (max-width: 768px) {
    font-size: 35px; /* Smaller heading on tablets */
  }

  @media screen and (max-width: 480px) {
    font-size: 35px; /* Even smaller heading for mobile */
  }

   @media screen and (max-width: 320px){
   font-size: 20px;
   }
`;

export const FormLabel = styled.label`
  font-size:25px;
  position: relative;
  z-index: 3;
  margin-bottom: -5%;

    @media screen and (max-width: 768px){
    font-size: 25px;
    padding-bottom: 5px;
    // margin-bottom: 3px;
    }

      @media screen and (max-width: 320px){
font-size: 15px;
 padding-bottom: 0px;
      }
`;

export const FormInput = styled.input`
  margin-top: 0%;
  background: #000000;
  padding: 4% 16px;
  border-radius: 4px;
  transition: border-color 0.3s;
  position: relative;
  border: none;
  z-index: 3;
  color: #fff; /* Ensure text color is visible on dark background */

  &:focus {
    border-color: rgb(87, 65, 217);
    outline: rgb(87, 65, 217);
    outline-style: auto;
    outline-width: 1px;
  }

  &:-internal-autofill-selected {
    appearance: none !important;
    background-image: none !important;
    background-color: #000000 !important; /* Keeps the same background as input */
    color: #fff !important; /* Explicitly set the text color */
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #000000 inset !important;
    -webkit-text-fill-color: #fff !important; /* Ensures text is white */
  }

  @media screen and (max-width: 768px) {
    padding: 3% 12px; /* Adjust padding for smaller screens */
  }

  @media screen and (max-width: 480px) {
    padding: 4% 10px; /* More padding for touch inputs */
  }
`;

export const FormButton = styled.button`
  background: black;
  padding: 0;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
  z-index: 3;

  &:hover {
    background: #fff;
    color: black;
    border: solid 2px black;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px; /* Smaller button font */
    padding: 10px; /* Adjust padding */
  }

  @media screen and (max-width: 480px) {
    font-size: 16px; /* Even smaller for mobile */
    padding: 12px; /* Increase padding for touch */
  }
`;

export const Text = styled.span`
  text-align: center;
  color: #fff;
  font-size: 35px;
  position: relative;

  @media screen and (max-width: 768px) {
    font-size: 35px; /* Smaller text */
  }

  @media screen and (max-width: 480px) {
    font-size: 25px; /* Even smaller for mobile */
  }
`;

export const NavLogo = styled(Link)`
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-left: 50px !important;
  margin-top: 15px !important;
  gap: 20px;
  font-weight: bold;
  text-decoration: none;
  position: relative;
  z-index: 3;
  background-color: transparent;

  @media screen and (max-width: 768px) {
    color: rgb(87, 65, 217);
    margin-left: 20px; /* Reduce margin */
    font-size: 1.2rem; /* Smaller logo size */
  }
  
  @media screen and (max-width: 480px) {
    margin-left: 10px; /* Further reduce margin */
    font-size: 1rem; /* Smallest logo size */
  }
     @media screen and (max-width: 320px){
     margin-top: 0px ;
     margin-bottom; 20px;
      margin-left: 0px;
     text-align: center;
     }
`;
