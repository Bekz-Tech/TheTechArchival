import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase/config'; // Assuming Firestore is configured in this file
import { Button, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import logo from '../../../assets/idCompanyLogo.jpeg'; // Default company logo
import { getUserDetails } from '../../../utils/constants';

// IDCard component (not exported, used internally for generating the card)
const IDCard = ({ idCardRef, userData }) => {
  const fallbackData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'student',
    studentId: 'btech/std/Data Analysis/10',
    instructorId: '',
    program: 'Data Analysis',
    profilePictureUrl: logo,
    address: '123 Tech Street, Babtech',
  };

  const {
    firstName,
    lastName,
    email,
    role,
    studentId,
    instructorId,
    program,
    profilePictureUrl,
    address,
  } = userData || fallbackData;

  const companyName = "Babtech E-learning Center";

  return (
    <div ref={idCardRef} style={{ display: 'block', padding: '20px' }}>
      <Card sx={{ maxWidth: 600, margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <CardMedia
                component="img"
                image={logo}
                alt="Company Logo"
                sx={{ width: 50, height: 50, marginBottom: 2 }}
              />
              <Typography variant="h6" component="div" fontWeight="bold">
                {companyName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} container justifyContent="flex-end">
              <CardMedia
                component="img"
                image={profilePictureUrl || fallbackData.profilePictureUrl}
                alt={firstName}
                sx={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #3f51b5' }}
              />
            </Grid>
          </Grid>
          <Typography variant="h5" component="div" textAlign="center" fontWeight="bold" marginTop={2}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body1" textAlign="center">{email}</Typography>
          <Typography variant="body1" textAlign="center">
            Role: {role === 'student' ? 'Student' : role === 'instructor' ? 'Instructor' : ''}
          </Typography>
          {role === 'student' && <Typography variant="body1" textAlign="center">Student ID: {studentId}</Typography>}
          {role === 'instructor' && <Typography variant="body1" textAlign="center">Instructor ID: {instructorId}</Typography>}
          <Typography variant="body1" textAlign="center">Program: {program}</Typography>
          <Typography variant="body2" textAlign="center" color="textSecondary" marginTop={2}>
            {companyName}
          </Typography>
          <Typography variant="body2" textAlign="center" color="textSecondary">
            {address}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

// Function to generate and upload PDF, updating Firestore
const generatePDFAndUpload = async (idCardRef, userId) => {
  try {
    if (!idCardRef.current) {
      throw new Error('ID card reference is not set.');
    }

    const canvas = await html2canvas(idCardRef.current, {
      useCORS: false,
      scale: 2,
    });
    
    console.log(canvas); // Log the canvas to ensure it's being created correctly

    const imgData = canvas.toDataURL('image/png');
    console.log(imgData); // Log the data URL to check its validity

    if (!imgData || imgData === 'data:,') {
      throw new Error('Captured image data is invalid or empty.');
    }

    const pdf = new jsPDF('landscape');
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
    const pdfBlob = pdf.output('blob');

    const storageRef = ref(storage, `idcards/${Date.now()}_${userId}.pdf`);
    await uploadBytes(storageRef, pdfBlob);
    const downloadUrl = await getDownloadURL(storageRef);

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { idCardUrl: downloadUrl });

    return downloadUrl;
  } catch (error) {
    console.error('Error generating or uploading PDF:', error);
  }
};

// Exported DownloadButton component
const DownloadIdButton = ({ userId }) => {
  const idCardRef = useRef(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = getUserDetails();
    setUserData(storedUser);
  }, []);


  const handleDownload = async () => {
    if (!userId) {
      console.error("User ID is required for downloading the ID card.");
      return;
    }
    const downloadUrl = await generatePDFAndUpload(idCardRef, userId);
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <>
      <IDCard idCardRef={idCardRef} userData={userData} />
      <Button variant="contained" color="primary" onClick={handleDownload} sx={{ marginTop: 2 }}>
        Download ID Card as PDF
      </Button>
    </>
  );
};

export default DownloadIdButton;
