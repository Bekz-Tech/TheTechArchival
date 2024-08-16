import React, { useState } from 'react';
import styled from 'styled-components';
import ChatbotBtn from '../chatbotBtn';
import BtnWrapperStyle from '../btnWrapperstyle';
import { submitEnquiry } from '../../../firebase/utils'; 

const ContactForm = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await submitEnquiry(formData);
      console.log('Enquiry submitted successfully');
      // Reset form after submission
      setFormData({
        name: '',
        phoneNumber: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }
  };

  return (
    <StyledEnquiryForm>
      <StyledInput
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <StyledTextArea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
      />
      <BtnWrapperStyle>
        <ChatbotBtn onClick={handleSubmit}>Submit Enquiry</ChatbotBtn>
      </BtnWrapperStyle>
    </StyledEnquiryForm>
  );
};

const StyledEnquiryForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  height: 3em;
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 0 10px;
`;

const StyledTextArea = styled.textarea`
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 10px;
  resize: none;
  height: 5em;
`;

export default ContactForm;
