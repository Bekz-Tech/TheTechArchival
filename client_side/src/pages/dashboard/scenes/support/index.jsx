import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table'; // Make sure this path is correct

const Support = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [inquiries, setInquiries] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInquiry = { id: inquiries.length + 1, name, email, date, message };
    setInquiries([...inquiries, newInquiry]);
    setName('');
    setEmail('');
    setDate('');
    setMessage('');
  };

  const columns = [
    { id: 'id', label: 'ID', flex: 0.5 },
    { id: 'name', label: 'Name', flex: 1 },
    { id: 'email', label: 'Email', flex: 1 },
    { id: 'date', label: 'Date', flex: 1 },
    { id: 'message', label: 'Message', flex: 2 },
  ];

  const handleSortChange = (columnId) => {
    // handle sort change logic
  };

  const handlePageChange = (event, newPage) => {
    // handle page change logic
  };

  const handleRowsPerPageChange = (event) => {
    // handle rows per page change logic
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: "Support Inquiries",
    data: inquiries,
    sortBy: 'id',
    sortDirection: 'asc',
    onSortChange: handleSortChange,
    page: 0,
    rowsPerPage: 5,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
  };

  return (
    <Box m="20px">
      <Header title="Support and Customer Care" subtitle="Submit your inquiries and concerns" />

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit Inquiry
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default Support;
