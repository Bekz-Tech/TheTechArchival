import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, TextField, Box, Typography } from '@mui/material';

const CodeGenerator = () => {
  const [codes, setCodes] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const generateCode = () => {
    const length = 11;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCodes((prevCodes) => [...prevCodes, result]);
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const handleSubmit = () => {
    if (codes.includes(inputCode)) {
      // Remove the code from the array if it matches
      setCodes(codes.filter((code) => code !== inputCode));

      // Simulate successful authentication
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid code. Please try again.');
      setIsAuthenticated(false);
    }

    // Clear the input field
    setInputCode('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateCode}
        style={{ marginBottom: '20px' }}
      >
        Generate Code
      </Button>

      <List>
        {codes.map((code, index) => (
          <ListItem key={index}>
            <ListItemText primary={code} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Enter OTP
        </Typography>

        <TextField
          label="Enter Code"
          variant="outlined"
          value={inputCode}
          onChange={handleInputChange}
          inputProps={{ maxLength: 11 }}
          sx={{ marginBottom: '20px', width: '300px' }}
        />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>

        {error && (
          <Typography color="error" sx={{ marginTop: '20px' }}>
            {error}
          </Typography>
        )}

        {isAuthenticated && (
          <Typography color="primary" sx={{ marginTop: '20px' }}>
            Code authenticated successfully!
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default CodeGenerator;
