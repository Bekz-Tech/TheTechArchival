import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo.svg';
import { NavLogo } from './SigninElements';
import { Button } from '@mui/material';
import {
    Container,
    FormWrap,
    FormContent,
    Form,
    FormH1,
    FormLabel,
    FormInput,
    Text
} from './SigninElements';
import LoadingButton from '../loadingButton'; // Adjust the path as needed
import useAuth from '../../hooks/useAuth'; // Import useAuth hook
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store

const SignIn = () => {
    const { user, loading, error, login, logout, allUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading button
    const navigate = useNavigate();

    // Access user state from Redux store using useSelector
    const currentUser = useSelector((state) => state.users.user);
    console.log(currentUser);

    // If user is already logged in, redirect to the dashboard
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        setIsSubmitting(true); // Set loading state for submit button

        try {
            // Call the login function from useAuth hook
            await login(email, password);
            console.log('userloggin')
        } catch (err) {
            console.error('Error during login:', err);
        } finally {
            setIsSubmitting(false); // Set loading state to false after login attempt
        }
    };

    return (
        <Container>
            <NavLogo to="/">
                <img src={Logo} style={{ width: "2em", height: "2em", marginRight: "15px" }} />
                <p>Babtech e-Learning</p>
            </NavLogo>
            <FormWrap>
                <FormContent>
                    <Form onSubmit={handleSubmit}>
                        <FormH1>Sign in to your account</FormH1>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <FormInput
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FormLabel htmlFor='password'>Password</FormLabel>
                        <FormInput
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <Text style={{ color: 'red' }}>{error}</Text>} {/* Show error if present */}
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            isLoading={isSubmitting || loading} // Show loading state when submitting
                        >
                            Continue
                        </LoadingButton>
                        <Text>Forgot password?</Text>
                    </Form>
                </FormContent>
            </FormWrap>
        </Container>
    );
};

export default SignIn;
