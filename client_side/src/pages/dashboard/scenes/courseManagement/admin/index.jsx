import React from 'react';
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
import { tokens } from '../../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from "../../../components/Header";
import Modal from "../../../components/modal";
import useCourses from './useCourses';


const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const courses = useSelector((state) => state.adminData.courses.courses);
  // console.log(courses);
  
  const {
    courses,
    formValues,
    addCourseModalOpen,
    updateCurriculumModalOpen,
    selectedCourse,
    addMessageModal,
    message,
    handleChange,
    handleCurriculumChange,
    handleAddCourse,
    handleUpdateCurriculum,
    handleDeleteCourse,
    handleAddCurriculum,
    addCurriculumField,
    removeCurriculumField,
    openAddCourseModal,
    closeAddCourseModal,
    closeUpdateCurriculumModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    closeAddMessageModal
  } = useCourses();

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
              <ListItem key={course.id} onClick={() => openCourseDetailsModal(course)}>
                <ListItemText
                  primary={course.courseName}
                  secondary={course.description}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit Curriculum">
                    <IconButton edge="end" onClick={() => handleAddCurriculum(course.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Course">
                    <IconButton edge="end" onClick={() => handleDeleteCourse(course.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
          <Button onClick={openAddCourseModal} variant="contained" color="primary">
            Add Course
          </Button>
        </Paper>
      </Grid>

      {/* Modals */}
      <Modal open={addCourseModalOpen} onClose={closeAddCourseModal} title="Add New Course">
        <TextField
          label="Course Name"
          name="courseName"
          value={formValues.courseName}
          onChange={handleChange}
        />
        <TextField
          label="Course Description"
          name="courseDescription"
          value={formValues.courseDescription}
          onChange={handleChange}
        />
        <TextField
          label="Duration"
          name="duration"
          value={formValues.duration}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="startDate"
          value={formValues.startDate}
          onChange={handleChange}
        />
        <TextField
          label="Cost"
          name="cost"
          value={formValues.cost}
          onChange={handleChange}
        />
        <Button onClick={handleAddCourse} variant="contained" color="primary">
          Add Course
        </Button>
      </Modal>

      <Modal open={updateCurriculumModalOpen} onClose={closeUpdateCurriculumModal} title="Update Curriculum">
        <Grid container spacing={2}>
          {formValues.curriculum.map((item, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                label="Topic"
                name={`curriculum[${index}].topic`}
                value={item.topic}
                onChange={(e) => handleCurriculumChange(index, 'topic', e.target.value)}
              />
              <TextField
                label="Overview"
                name={`curriculum[${index}].overview`}
                value={item.overview}
                onChange={(e) => handleCurriculumChange(index, 'overview', e.target.value)}
              />
              <TextField
                label="Week"
                name={`curriculum[${index}].week`}
                value={item.week}
                onChange={(e) => handleCurriculumChange(index, 'week', e.target.value)}
              />
              <Button onClick={() => removeCurriculumField(index)} color="secondary">
                Remove
              </Button>
            </Grid>
          ))}
          <Button onClick={addCurriculumField}>Add Curriculum</Button>
          <Button onClick={handleUpdateCurriculum}>Save Curriculum</Button>
        </Grid>
      </Modal>

      <Modal open={addMessageModal} onClose={closeAddMessageModal} title="Add Message">
        <TextField
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={() => {/* Handle add message */}} variant="contained" color="primary">
          Add Message
        </Button>
      </Modal>

      <Modal open={selectedCourse !== null} onClose={closeCourseDetailsModal} title={selectedCourse?.courseName}>
        {/* Course details */}
      </Modal>
    </Grid>
  );
};

export default Admin;
