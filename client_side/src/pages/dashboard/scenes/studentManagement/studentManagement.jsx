import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../../components/modal';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com' },
    // Add more students as needed
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'message' or 'details'
  const [message, setMessage] = useState('');

  const handleAddStudent = () => {
    // Implement logic to add a new student
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
  };

  const handleOpenDialog = (student, mode) => {
    setSelectedStudent(student);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage('');
  };

  const handleSendMessage = () => {
    // Implement logic to send message
    console.log(`Message to ${selectedStudent.name}: ${message}`);
    handleCloseDialog();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Student Management
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Students List
          </Typography>
          <List>
            {students.map(student => (
              <ListItem key={student.id}>
                <ListItemText primary={student.name} secondary={student.email} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="message" onClick={() => handleOpenDialog(student, 'message')}>
                    <Typography>Message</Typography>
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteStudent(student.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
     
      <Modal
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogMode === 'message' ? `Message to ${selectedStudent?.name}` : 'Student Details'}
        onConfirm={handleSendMessage}
        confirmMessage="Send"
        noConfirm={dialogMode === 'details'}
      >
        {dialogMode === 'message' ? (
          <>
            <TextField
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </>
        ) : (
          <>
            <Typography variant="h6">Name: {selectedStudent?.name}</Typography>
            <Typography variant="body1">Email: {selectedStudent?.email}</Typography>
          </>
        )}
      </Modal>
    </Grid>
  );
};

export default StudentManagement;
