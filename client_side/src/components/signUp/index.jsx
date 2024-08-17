import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { handleSignUp } from "../../firebase/utils";

const roleFields = {
    student: [
        { label: 'First Name', name: 'firstName', type: 'text', required: true },
        { label: 'Last Name', name: 'lastName', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
        { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
        { label: 'Program', name: 'program', type: 'select', required: true, options: ['Fullstack Development', 'Frontend Development', 'Data Analysis', 'Cyber Security', 'UI/UX Design'] },
        { label: 'Emergency Contact Name', name: 'emergencyContactName', type: 'text', required: true },
        { label: 'Emergency Contact Relationship', name: 'emergencyContactRelationship', type: 'text', required: true },
        { label: 'Emergency Contact Phone', name: 'emergencyContactPhone', type: 'tel', required: true },
        { label: 'Amount Paid', name: 'amountPaid', type: 'number', required: true },
    ],
    instructor: [
        { label: 'First Name', name: 'firstName', type: 'text', required: true },
        { label: 'Last Name', name: 'lastName', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
        { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
        { label: 'Program', name: 'program', type: 'select', required: true, options: ['Fullstack Development', 'Frontend Development', 'Data Analysis', 'Cyber Security', 'UI/UX Design'] },
        // Add any additional instructor-specific fields here
    ],
    admin: [
        { label: 'First Name', name: 'firstName', type: 'text', required: true },
        { label: 'Last Name', name: 'lastName', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
        { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
        // Add more fields specific to admins here
    ]
};

const SignUpForm = ({ role }) => {
    // Initialize form data
    const initialFormData = () => {
        const initialData = {};
        if (roleFields[role]) {
            roleFields[role].forEach(field => {
                initialData[field.name] = field.type === 'number' ? 0 : ''; // Set initial value for 'amountPaid' to 0
            });
        }
        return initialData;
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const formRef = useRef(null);

    useEffect(() => {
        setFormData(initialFormData()); // Reset form data when role changes
    }, [role]);

    const handleChange = (e) => {
        if (e.target.name === 'profilePicture') {
            setProfilePicture(e.target.files[0]);
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            let downloadURL = '';
            if (profilePicture) {
                const storage = getStorage();
                const storageRef = ref(storage, `profile_pictures/${profilePicture.name}`);
                const uploadTask = uploadBytesResumable(storageRef, profilePicture);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            // Optionally handle upload progress
                        },
                        (error) => {
                            reject(error);
                        },
                        async () => {
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            setProfilePictureUrl(downloadURL);
                            resolve();
                        }
                    );
                });
            }

            // Construct the user data object to pass to handleSignUp
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                profilePictureUrl: downloadURL,
                ...(role === 'student' && {
                    program: formData.program,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactRelationship: formData.emergencyContactRelationship,
                    emergencyContactPhone: formData.emergencyContactPhone,
                    amountPaid: formData.amountPaid // Include amountPaid for students
                }),
                // Add additional fields for instructor and admin roles if necessary
            };

            await handleSignUp(userData, role);
            alert('User successfully registered');
            
            // Reset form state
            setFormData(initialFormData());
            setProfilePicture(null);
            setProfilePictureUrl('');
        } catch (error) {
            setError(`Failed to sign up: ${error.message}`);
            alert(`Error signing up user: ${error.message}`);
        }
    };

    return (
        <Box ref={formRef} sx={{ mx: 'auto', mb: 5, p: 5 }}>
            <Typography variant="h4" gutterBottom>
                Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {roleFields[role]?.map((field) => (
                        <Grid item xs={12} key={field.name}>
                            {field.type === 'select' ? (
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{field.label}</InputLabel>
                                    <Select
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        label={field.label}
                                        required={field.required}
                                    >
                                        {field.options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : field.type === 'file' ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="file"
                                    name={field.name}
                                    label={field.label}
                                    onChange={handleChange}
                                    required={field.required}
                                    InputLabelProps={{ shrink: true }}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={field.type}
                                    name={field.name}
                                    label={field.label}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Sign Up
                </Button>
            </form>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
    );
};

export default SignUpForm;
