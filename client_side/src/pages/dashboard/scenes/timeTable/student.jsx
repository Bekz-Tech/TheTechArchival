import React, { useState } from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import useStudentData from '../dashboard/student/useStudentData'; 
import useSessionStoarge from '../../../../hooks/useSessionStorage';

const TimeTable = () => {
  const { timeTable } = useStudentData(); // Use the timeTable from the hook
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map timeTable data to the format required by the table
  const schedules = timeTable.map((schedule) => ({
    ...schedule,
    attended: schedule.done ? 'Yes' : 'No' // Use 'attended' field based on 'done'
  }));

  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'location', label: 'Location' },
    { id: 'time', label: 'Time' },
    { id: 'topic', label: 'Topic' },
    { id: 'attended', label: 'Attended' }, // Consistent lowercase 'attended' field
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (newPage) => {
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
      </Box>
      <Divider />
      <TableComponent
        columns={columns}
        tableHeader={`${useSessionStoarge().memoizedUserDetails.program} Schedule`}
        data={schedules} // Use the schedules from the timeTable
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
