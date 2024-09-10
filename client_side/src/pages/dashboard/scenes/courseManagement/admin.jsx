import React, { useState, useEffect } from 'react';
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
  useTheme,
  Tooltip,
  Box
} from '@mui/material';
import { tokens } from '../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from "../../components/Header";
import Modal from "../../components/modal";
import { addCourse, updateCourseCurriculum } from "../../../../firebase/utils";

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [courses, setCourses] = useState([]);
  const [formValues, setFormValues] = useState({
    courseName: '',
    courseDescription: '',
    duration: '',
    startDate: '',
    cost: '',
    curriculum: []
  });
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [updateCurriculumModalOpen, setUpdateCurriculumModalOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const storedCourses = sessionStorage.getItem('btech_courses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error('Error parsing stored courses:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleCurriculumChange = (index, field, value) => {
    const newCurriculum = [...formValues.curriculum];
    newCurriculum[index] = { ...newCurriculum[index], [field]: value };
    setFormValues({
      ...formValues,
      curriculum: newCurriculum
    });
  };

  const handleAddCourse = async () => {
    const { courseName, courseDescription, duration, startDate, cost } = formValues;

    if (
      courseName.trim() === '' ||
      courseDescription.trim() === '' ||
      duration.trim() === '' ||
      startDate.trim() === '' ||
      cost.trim() === ''
    )
      return;

    const courseData = {
      courseName,
      description: courseDescription,
      duration,
      startDate,
      cost: parseFloat(cost),
    };

    try {
      const courseId = await addCourse(courseData);

      const updatedCourses = [...courses, { id: courseId, ...courseData }];
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));

      setFormValues({
        courseName: '',
        courseDescription: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setAddCourseModalOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCurriculum = async () => {
    try {
      await updateCourseCurriculum(currentCourseId, formValues.curriculum);

      const updatedCourses = courses.map(course =>
        course.id === currentCourseId ? { ...course, curriculum: formValues.curriculum } : course
      );
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));

      setFormValues({
        courseName: '',
        courseDescription: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setUpdateCurriculumModalOpen(false);
    } catch (error) {
      console.error('Error updating curriculum:', error);
    }
  };

  const handleDeleteCourse = (id) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleAddCurriculum = (id) => {
    setCurrentCourseId(id);
    const course = courses.find(c => c.id === id);
    if (course && course.curriculum && course.curriculum.length > 0) {
      setFormValues({ ...formValues, curriculum: course.curriculum });
    } else {
      setFormValues({ ...formValues, curriculum: [] });
    }
    setUpdateCurriculumModalOpen(true);
  };

  const addCurriculumField = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: [...prevValues.curriculum, { topic: '', overview: '', week: '', isCompleted: false }]
    }));
  };

  const removeCurriculumField = (index) => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: prevValues.curriculum.filter((_, i) => i !== index)
    }));
  };

  const openAddCourseModal = () => {
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
    setAddCourseModalOpen(true);
  };

  const closeAddCourseModal = () => {
    setAddCourseModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  const closeUpdateCurriculumModal = () => {
    setUpdateCurriculumModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  const openCourseDetailsModal = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetailsModal = () => {
    setSelectedCourse(null);
  };

  return (
    <Grid container spacing={3} px={3}>
      <Grid item xs={12}>
        <Header title="Course Management" subtitle="Manage courses" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
          <Typography variant="h3" gutterBottom>
            Courses
          </Typography>
          <List>
            {courses.map(course => (
              <ListItem
                key={course.id}
                onClick={() => openCourseDetailsModal(course)}
                sx={{
                  backgroundColor: colors.primaryLight,
                  borderRadius: '5px',
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  // alignItems: "",
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #fff',
                  '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)',  // Optional: Adds a slight zoom effect on hover
                      transition: '0.3s',        // Optional: Smooth transition
                    },
                }}
              >
                <Box
                   >
                  <ListItemText
                    primary={`${course.courseName} - ${course.description}`}
                    secondary={`Duration: ${course.duration}, Start Date: ${course.startDate}, Cost: ₦${course.cost}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete Course">
                      <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}>
                        <DeleteIcon style={{ color: colors.error }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Curriculum">
                      <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleAddCurriculum(course.id); }}>
                        <EditIcon style={{ color: colors.primary }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </Box>
                <Box style={{ marginTop: 'auto' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => { e.stopPropagation(); handleAddCurriculum(course.id); }}
                    style={{ width: '100%' }}
                  >
                    {course.curriculum && course.curriculum.length > 0 ? 'Update Curriculum' : 'Add Curriculum'}
                  </Button>
                </Box>
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
            onClick={openAddCourseModal}
          >
            Add Course
          </Button>
        </Paper>
      </Grid>

      {/* Modal for adding a new course */}
      <Modal
        open={addCourseModalOpen}
        onClose={closeAddCourseModal}
        title="Add New Course"
        onConfirm={handleAddCourse}
        onCancel={closeAddCourseModal}
      >
        <TextField
          label="Course Name"
          name="courseName"
          value={formValues.courseName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="courseDescription"
          value={formValues.courseDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration"
          name="duration"
          value={formValues.duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={formValues.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Cost"
          name="cost"
          type="number"
          value={formValues.cost}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </Modal>

      {/* Modal for updating course curriculum */}
      <Modal
        open={updateCurriculumModalOpen}
        onClose={closeUpdateCurriculumModal}
        title="Update Curriculum"
        onConfirm={handleUpdateCurriculum}
        onCancel={closeUpdateCurriculumModal}
      >
        <TextField
          label="Course Name"
          name="courseName"
          value={formValues.courseName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="courseDescription"
          value={formValues.courseDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration"
          name="duration"
          value={formValues.duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={formValues.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Cost"
          name="cost"
          type="number"
          value={formValues.cost}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {formValues.curriculum.map((field, index) => (
          <Box key={index} style={{ marginBottom: '10px' }}>
            <TextField
              label="Topic"
              value={field.topic}
              onChange={(e) => handleCurriculumChange(index, 'topic', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Overview"
              value={field.overview}
              onChange={(e) => handleCurriculumChange(index, 'overview', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Week"
              value={field.week}
              onChange={(e) => handleCurriculumChange(index, 'week', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Completed"
              type="checkbox"
              checked={field.isCompleted}
              onChange={(e) => handleCurriculumChange(index, 'isCompleted', e.target.checked)}
            />
            <Button variant="contained" color="secondary" onClick={() => removeCurriculumField(index)}>
              Remove
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={addCurriculumField}>
          Add Curriculum Field
        </Button>
      </Modal>

      {/* Modal for displaying course details */}
      <Modal
        open={selectedCourse !== null}
        onClose={closeCourseDetailsModal}
        title="Course Details"
        onConfirm={closeCourseDetailsModal}
        onCancel={closeCourseDetailsModal}
      >
        {selectedCourse && (
          <Box>
            <Typography variant="h6">{selectedCourse.courseName}</Typography>
            <Typography variant="body1">Description: {selectedCourse.description}</Typography>
            <Typography variant="body1">Duration: {selectedCourse.duration}</Typography>
            <Typography variant="body1">Start Date: {selectedCourse.startDate}</Typography>
            <Typography variant="body1">Cost: {selectedCourse.cost}</Typography>
            <Typography variant="h6">Curriculum:</Typography>
            {selectedCourse.curriculum.length > 0 ? (
              <List>
                {selectedCourse.curriculum.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Topic: ${item.topic}`}
                      secondary={`Overview: ${item.overview}, Week: ${item.week}, Completed: ${item.isCompleted ? 'Yes' : 'No'}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No curriculum details available.</Typography>
            )}
          </Box>
        )}
      </Modal>
    </Grid>
  );
};

export default Admin;
