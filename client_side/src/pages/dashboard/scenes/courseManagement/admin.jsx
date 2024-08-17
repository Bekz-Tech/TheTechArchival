import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import { tokens } from '../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";
import Modal from "../../components/modal"; // Import the Modal component
import { addCourse } from "../../../../firebase/utils"; // Import the addCourse function

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [courses, setCourses] = useState([]);
  const [formValues, setFormValues] = useState({
    courseName: '',
    courseDescription: '',
    duration: '',
    startDate: '',
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleAddCourse = async () => {
    const { courseName, courseDescription, duration, startDate } = formValues;

    if (
      courseName.trim() === '' ||
      courseDescription.trim() === '' ||
      duration.trim() === '' ||
      startDate.trim() === ''
    )
      return;

    const courseData = {
      courseName,
      description: courseDescription,
      duration,
      startDate,
    };

    try {
      // Add the new course to Firestore using the addCourse function
      const courseId = await addCourse(courseData);

      // Update the local state with the newly added course
      setCourses([...courses, { id: courseId, ...courseData }]);
      // Clear the input fields
      setFormValues({
        courseName: '',
        courseDescription: '',
        duration: '',
        startDate: '',
      });
      setModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Header title="Course Management" subtitle="Manage courses" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
          <Typography variant="h6" gutterBottom>
            Courses
          </Typography>
          <List>
            {courses.map(course => (
              <ListItem key={course.id}>
                <ListItemText
                  primary={`${course.courseName} - ${course.description}`}
                  secondary={`Duration: ${course.duration}, Start Date: ${course.startDate}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCourse(course.id)}>
                    <DeleteIcon style={{ color: colors.error }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
          <Typography variant="h6" gutterBottom>
            Add New Course
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            style={{ backgroundColor: colors.primary }}
          >
            Add Course
          </Button>
        </Paper>
      </Grid>

      {/* Modal for adding a new course */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Add New Course"
        onConfirm={handleAddCourse}
        confirmMessage="Add Course"
      >
        <TextField
          label="Course Name"
          name="courseName"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.courseName}
          onChange={handleChange}
        />
        <TextField
          label="Course Description"
          name="courseDescription"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.courseDescription}
          onChange={handleChange}
        />
        <TextField
          label="Duration (weeks)"
          name="duration"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.duration}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.startDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Modal>
    </Grid>
  );
};

export default Admin;
