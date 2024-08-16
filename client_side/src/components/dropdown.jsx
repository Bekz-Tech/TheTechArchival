import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Dropdown = ({ label, options, onSelect }) => {
  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl
    sx={{ width: "15%"
      , paddingBottom: '2%'
     }}
    variant="outlined"
    >
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        value=""
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="" disabled>{label}</MenuItem>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
