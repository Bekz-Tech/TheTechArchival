import styled from 'styled-components';
import { Link } from 'react-router-dom';
import bgImage from '../../images/login-bg.jpeg';

export const Container = styled.div`
  overflow: hidden;
  background-size: cover;
  background-position: center;
  // display: grid;
  // align-items: center;
  // justify-content: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: url(${bgImage});


  @media screen and (max-width: 768px) {
    &:after {
      background-image: none;
    }
  }
`;

export const FormWrap = styled.div`
  height: 100%;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2; /* Ensure content is above the overlay */
  margin: -50px  auto 0 auto !important;

  @media screen and (max-width: 400px) {
    height: 80%;
  }
`;

export const Icon = styled(Link)`
  margin-left: 32px;
  margin-top: 32px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 32px;
  position: relative;
  z-index: 2;

  @media screen and (max-width: 480px) {
    margin-left: 16px;
    margin-top: 8px;
  }
`;

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  width: auto;
  color: #000000;
  @media screen and (max-width: 480px) {
    padding: 0 10px !important;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-directional: column;
  gap: 20px;
  background: #fff;
  max-width: 400px;
  height: auto;
  width: 100%;
  z-index: 3;
  display: grid;
  margin: 0 auto;
  padding: 5%;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;

export const FormH1 = styled.h1`
  margin-bottom: 5%;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  position: relative;
  z-index: 3;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  position: relative;
  z-index: 3;
    margin-bottom: -5%;
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
`;

export const FormButton = styled.button`
  background: black;
  padding:  0;
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
`;

export const Text = styled.span`
  text-align: center;
  color: #fff;
  font-size: 14px;
  position: relative;
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
  }
`;
