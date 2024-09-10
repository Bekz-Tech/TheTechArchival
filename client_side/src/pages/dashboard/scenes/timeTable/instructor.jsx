import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import { tokens } from '../../theme';
import { getUserDetails } from '../../../../utils/constants';
import { addTimetableToInstructors, deleteTimetable, updateTimetable, fetchUserDetailsByEmailAndRole } from '../../../../firebase/utils';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [schedules, setSchedules] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ day: '', course: '', time: '', location: '', topic: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails && userDetails.programsAssigned) {
      setCourses(userDetails.programsAssigned);
      fetchUserDetailsByEmailAndRole(userDetails.email, userDetails.role);
    }

    if (userDetails && userDetails.courses) {
      const allTimetables = userDetails.courses.flatMap(course => 
        (course.timetable || []).map(timetable => ({
          ...timetable,
          courseName: course.courseName,
        }))
      );
      setSchedules(allTimetables);
    }
  }, []);

  const columns = [
    { id: 'date', label: 'Day' },
    { id: 'courseName', label: 'Course' },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
    { id: 'topic', label: 'Topic' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setFormData({ day: '', course: '', time: '', location: '', topic: '' });
    setEditingSchedule(null);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleEdit = (schedule) => {
    setFormData({
      day: schedule.date,
      course: schedule.courseName,
      time: schedule.time,
      location: schedule.location,
      topic: schedule.topic,
    });
    setEditingSchedule(schedule);
    handleOpenEditModal();
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    handleOpenDeleteModal();
  };

  const handleConfirmDelete = async () => {
    const userDetails = getUserDetails();
    const userId = userDetails?.userId;
    const course = userDetails.courses.find(course => 
      course.timetable.some(t => t.id === scheduleToDelete.id)
    );
    const courseId = course?.id;
    const timetableId = scheduleToDelete.id;

    if (!userId || !courseId || !timetableId) {
      console.error('Missing user ID, course ID, or timetable ID.');
      return;
    }

    try {
      await deleteTimetable(timetableId);
      const updatedSchedules = schedules.filter(s => s.id !== timetableId);
      setSchedules(updatedSchedules);
      console.log('Timetable deleted successfully.');
    } catch (error) {
      console.error('Error deleting timetable:', error);
    }
    handleCloseDeleteModal();
    fetchUserDetailsByEmailAndRole(userDetails.email, userDetails.role);
  };

  const handleSubmit = async () => {
    const userDetails = getUserDetails();
    const userId = userDetails?.userId;
    const selectedCourseObj = userDetails.courses.find(course => course.courseName === selectedCourse);
    const courseId = selectedCourseObj?.id;

    if (!userId || !courseId) {
      console.error('User ID or Course ID is undefined or null. Cannot update timetable.');
      return;
    }

    try {
      if (editingSchedule) {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.id === editingSchedule.id ? { ...schedule, ...formData } : schedule
        );
        setSchedules(updatedSchedules);

        await updateTimetable(editingSchedule.id, {
          date: formData.day,
          time: formData.time,
          location: formData.location,
          topic: formData.topic,
        }, userId, courseId);
      } else {
        const newSchedule = {
          id: schedules.length + 1,
          date: formData.day,
          courseName: selectedCourse,
          time: formData.time,
          location: formData.location,
          topic: formData.topic,
        };
        setSchedules([...schedules, newSchedule]);

        await addTimetableToInstructors({
          date: formData.day,
          time: formData.time,
          location: formData.location,
          topic: formData.topic,
        }, userId, courseId);
      }
    } catch (error) {
      console.error('Error handling schedule submit:', error);
    }
    handleCloseEditModal();
    fetchUserDetailsByEmailAndRole(userDetails.email, userDetails.role);
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

  return (
    <Box m="20px">
      <Header
        title="TIME TABLE"
        subtitle="Overview of Weekly Schedule"
      />
      <FormControl sx={{ mb: '15px', width: '20%' }}>
        <InputLabel>Select Course</InputLabel>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          label="Select Course"
        >
          {courses.map((course, index) => (
            <MenuItem key={index} value={course.courseName}>
              {course.courseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenEditModal}
        sx={{ mb: '15px' }}
      >
        {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
      </Button>
      <TableComponent
        columns={columns}
        data={schedules}
        page={page}
        rowsPerPage={rowsPerPage}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        onConfirm={handleSubmit}
        confirmMessage={editingSchedule ? 'Update' : 'Add'}
      >
        <TextField
          fullWidth
          name="day"
          label="Day"
          value={formData.day}
          onChange={(e) => setFormData({ ...formData, day: e.target.value })}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          name="time"
          label="Time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          name="location"
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          name="topic"
          label="Topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          sx={{ mb: '15px' }}
        />
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        onConfirm={handleConfirmDelete}
        confirmMessage="Delete"
        noConfirm={false}
      >
        <Box>
          <p>Are you sure you want to delete this schedule?</p>
        </Box>
      </Modal>
    </Box>
  );
};

export default Instructor;
