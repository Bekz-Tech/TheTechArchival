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
import { AddCurriculumModal,
        AddCourseModal,
        AddCohortModal
} from './courseModals';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    courses,
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
    closeAddMessageModal,
    openCohortAddModal,
    closeCohortAddModal,
    openAddCurriculumModal,
    closeAddCurriculumModal,
    cohortAddModalOpen
  } = useCourses();

  const addCohort = () => { 
    openCohortAddModal();
  }

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

      {/* Course Details Modal */}
      <Modal open={selectedCourse !== null} onClose={closeCourseDetailsModal} title={selectedCourse?.courseName}>
        {selectedCourse && (
          <Box>
            <Typography variant="h6">Course Name</Typography>
            <Typography>{selectedCourse.courseName}</Typography>

            <Typography variant="h6">Description</Typography>
            <Typography>{selectedCourse.description}</Typography>

            <Typography variant="h6">Duration</Typography>
            <Typography>{selectedCourse.duration}</Typography>

            <Typography variant="h6">Start Date</Typography>
            <Typography>{new Date(selectedCourse.startDate).toLocaleDateString()}</Typography>

            <Typography variant="h6">Cost</Typography>
            <Typography>{selectedCourse.cost}</Typography>

            <Typography variant="h6">Cohorts</Typography>
            {selectedCourse.cohorts.length > 0 ? (
              selectedCourse.cohorts.map((cohort, index) => (
                <Typography key={index}>Cohort {index + 1}</Typography>
              ))
            ) : (
              <Typography>No Cohorts available</Typography>
            )}

            <Typography variant="h6">Curriculum</Typography>
            {selectedCourse.curriculum.length > 0 ? (
              selectedCourse.curriculum.map((curriculumItem, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body1">Week {curriculumItem.week}: {curriculumItem.topic}</Typography>
                  <Typography variant="body2">{curriculumItem.overview}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No Curriculum available</Typography>
            )}

            {/* Buttons to add cohorts and curriculum */}
            <Button variant="contained" color="primary" onClick={addCohort}>
              Add Cohort
            </Button>
            <Button variant="contained" color="primary" onClick={openAddCurriculumModal}>
              Add Curriculum
            </Button>
          </Box>
        )}
      </Modal>

      {/* Modals for Adding Course, Cohort, and Curriculum */}
      
      {/* Add Course Modal */}
      <Modal open={addCourseModalOpen} onClose={closeAddCourseModal} title="Add New Course">
        <AddCourseModal />
      </Modal>

      {/* Add Cohort Modal */}
      <Modal open={cohortAddModalOpen} onClose={closeCohortAddModal} title="Add Cohort" noConfirm>
        <AddCohortModal courseId={selectedCourse?.courseId} />
      </Modal>

      {/* Add Curriculum Modal */}
      <Modal open={openAddCurriculumModal} onClose={closeAddCurriculumModal} title="Add Curriculum">
        <AddCurriculumModal />
      </Modal>
    </Grid>
  );
};

export default Admin;
