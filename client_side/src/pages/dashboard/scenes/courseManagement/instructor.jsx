import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Divider, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Instructors = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Introduction to Programming' },
    { id: 2, name: 'Web Development Fundamentals' },
    // Add more courses as needed
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (course = null) => {
    setCurrentCourse(course);
    setNewCourseName(course ? course.name : '');
    setIsEditing(!!course);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveCourse = () => {
    if (isEditing) {
      // Update existing course
      const updatedCourses = courses.map(course =>
        course.id === currentCourse.id ? { ...course, name: newCourseName } : course
      );
      setCourses(updatedCourses);
    } else {
      // Add new course
      const newCourse = { id: courses.length + 1, name: newCourseName };
      setCourses([...courses, newCourse]);
    }
    handleCloseDialog();
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Course Management
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Courses
          </Typography>
          <List>
            {courses.map(course => (
              <ListItem key={course.id}>
                <ListItemText primary={course.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCourse(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </Typography>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            {isEditing ? 'Save Changes' : 'Add Course'}
          </Button>
        </Paper>
      </Grid>

      {/* Dialog for adding/editing courses */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCourse} color="primary">
            {isEditing ? 'Save Changes' : 'Add Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Instructors;
