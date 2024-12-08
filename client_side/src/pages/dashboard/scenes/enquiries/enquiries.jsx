import React, { useEffect, useState } from 'react';
import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import { fetchEnquiries, updateEnquiryReadStatus, deleteEnquiry } from '../../../../firebase/utils/index';

const Enquiries = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const getEnquiries = async () => {
      try {
        const data = await fetchEnquiries();
        setEnquiries(data);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    getEnquiries();
  }, []);

  const handleReadChange = async (id) => {
    try {
      await updateEnquiryReadStatus(id);
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, read: true } : enquiry
        )
      );
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEnquiry(id);
      setEnquiries((prevEnquiries) => prevEnquiries.filter((enquiry) => enquiry.id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Enquiries" subtitle="List of Enquiries" />
      {enquiries.map((enquiry) => (
        <Accordion key={enquiry.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              {enquiry.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Message:</strong> {enquiry.message}
            </Typography>
            <Typography>
              <strong>Phone Number:</strong> {enquiry.phoneNumber}
            </Typography>
            <Typography>
              <strong>Created At:</strong> {enquiry.createdAt}
            </Typography>
            {!enquiry.read && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReadChange(enquiry.id)}
              >
                Mark as Read
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(enquiry.id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Enquiries;
