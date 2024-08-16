import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import { tokens } from '../../theme';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [schedules, setSchedules] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ day: '', course: '', time: '', location: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const mockSchedules = [
    { id: 1, day: 'Monday', course: 'Object Oriented Porgramming', time: '09:00 - 10:30', location: 'Room 101' },
    { id: 2, day: 'Tuesday', course: 'Functional programming', time: '11:00 - 12:30', location: 'Room 102' },
    { id: 3, day: 'Wednesday', course: 'DOm manipulation', time: '09:00 - 10:30', location: 'Room 103' },
    { id: 4, day: 'Thursday', course: 'Project', time: '11:00 - 12:30', location: 'Room 104' },
    { id: 5, day: 'Friday', course: 'Asynchronous programming', time: '13:00 - 14:30', location: 'Gym' },
  ];

  useEffect(() => {
    // Simulating API call to fetch schedules
    setTimeout(() => {
      setSchedules(mockSchedules);
    }, 1000);
  }, []);

  const columns = [
    { id: 'day', label: 'Day' },
    { id: 'course', label: 'Course' },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ day: '', course: '', time: '', location: '' });
    setEditingSchedule(null);
  };

  const handleEdit = (schedule) => {
    setFormData({
      day: schedule.day,
      course: schedule.course,
      time: schedule.time,
      location: schedule.location,
    });
    setEditingSchedule(schedule);
    handleOpenModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingSchedule) {
      // Update existing schedule
      setSchedules(schedules.map((schedule) =>
        schedule.id === editingSchedule.id ? { ...schedule, ...formData } : schedule
      ));
    } else {
      // Add new schedule
      setSchedules([
        ...schedules,
        {
          id: schedules.length + 1,
          ...formData,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (row) => {
    handleEdit(row);
  };

  return (
    <Box m="20px">
      <Header
        title="TIME TABLE"
        subtitle="Overview of Weekly Schedule"
      />
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Schedule
      </Button>
      <Box p="40px 0 0 0" height="75vh">
        <TableComponent
          columns={columns}
          tableHeader="Time Table"
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        onConfirm={handleSubmit}
        confirmMessage={editingSchedule ? 'Update' : 'Add'}
      >
        <TextField
          fullWidth
          label="Day"
          name="day"
          value={formData.day}
          onChange={handleChange}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          label="Time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          sx={{ mb: '15px' }}
        />
      </Modal>
    </Box>
  );
};

export default Instructor;
