import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Divider, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const TimeTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const mockSchedules = [
    { id: 1, day: 'Monday', course: 'Math', time: '09:00 - 10:30', location: 'Room 101' },
    { id: 2, day: 'Tuesday', course: 'Science', time: '11:00 - 12:30', location: 'Room 102' },
    { id: 3, day: 'Wednesday', course: 'History', time: '09:00 - 10:30', location: 'Room 103' },
    { id: 4, day: 'Thursday', course: 'English', time: '11:00 - 12:30', location: 'Room 104' },
    { id: 5, day: 'Friday', course: 'Physical Education', time: '13:00 - 14:30', location: 'Gym' },
  ];

  const [schedules, setSchedules] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulating API call to fetch schedules
    setTimeout(() => {
      setSchedules(mockSchedules);
    }, 1000);
  }, []);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'day', label: 'Day' },
    { id: 'course', label: 'Course' },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  return (
    <Box p="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h2">Time Table</Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Divider />
      <TableComponent
        columns={columns}
        tableHeader="Overview of Weekly Schedule"
        data={schedules}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default TimeTable;
