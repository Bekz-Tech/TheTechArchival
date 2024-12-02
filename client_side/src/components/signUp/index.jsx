import { Box, Button, TextField, Typography, Alert, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import useSignUp from './useSignUp';

const SignUpForm = ({ role, offline }) => {
    const {
        roleFields,
        error,
        loadingCohorts,
        handleProgramChange,
        handleCohortChange,  // Added this
        handleChange,
        handleSubmit,
        formData,
        formRef,
        assignedInstructor
    } = useSignUp({ offline, role });
    console.log(assignedInstructor);

    return (
        <Box>
            <Typography variant="h4">
                Sign Up ({role.charAt(0).toUpperCase() + role.slice(1)})
            </Typography>
            <form onSubmit={handleSubmit} ref={formRef}>
                {roleFields[role].map((field) => (
                    <Box key={field.name} mb={2}>
                        {field.name === 'assignedInstructor' ? (
                            // Display the assigned instructor field as a disabled TextField
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={assignedInstructor}
                                disabled
                                fullWidth
                            />
                        ) : field.name === 'cohort' ? (
                            // If it's the cohort field, render a select menu for cohort selection
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleCohortChange}  // Cohort change handler
                                    required={field.required}
                                >
                                    {loadingCohorts ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={24} />
                                        </MenuItem>
                                    ) : (
                                        field.options && field.options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        ) : field.type === 'select' ? (
                            // Program select handler
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleProgramChange}
                                    required={field.required}
                                >
                                    {field.options && field.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : field.type === 'file' ? (
                            // File input field handler
                            <Box mb={2}>
                                <input
                                    type="file"
                                    name={field.name}
                                    id={field.name}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={{ display: 'block', width: '100%' }}
                                />
                            </Box>
                        ) : (
                            <TextField
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                fullWidth
                            />
                        )}
                    </Box>
                ))}
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" type="submit">
                    Sign Up
                </Button>
            </form>
        </Box>
    );
};

export default SignUpForm;
