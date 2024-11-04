import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { signInWithEmailAndPassword } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth, googleProvider } from '../../firebase/config'; // Ensure auth and db are correctly imported
import LoadingButton from '../loadingButton'; // Adjust the path as needed

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userDetails, setUserDetails] = useState(null); // State to hold user details
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading
    const navigate = useNavigate();
     const [codes, setCodes] = useState([]);
    const newNavigate = useNavigate()
    useEffect(() => {

        let isMounted = true;

        const checkUserDetailsInLocalStorage = async () => {
            const userDetails = sessionStorage.getItem('btech_user');
            if (userDetails) {
                console.log('User details found in localStorage:', JSON.parse(userDetails));
                navigate('/dashboard'); // Redirect to dashboard if user details exist
            }
        };
        
        checkUserDetailsInLocalStorage();
        return () => {
            isMounted = false;
        }
    }, [navigate]);

    const handleNavigate = () => {
    newNavigate('/code-authenticator'); // Navigate to the authentication page
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);
    
        let isMounted = true; // Track if component is still mounted
    
        try {
            // Sign in with email and password using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Fetch user details from Firestore based on authenticated user's email
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty && isMounted) {
                // If user details found, update state user details
                const userDoc = querySnapshot.docs[0];
                setUserDetails(userDoc.data());
                sessionStorage.setItem('btech_user', JSON.stringify(userDoc.data())); // Store user details in local storage
                navigate('/dashboard'); // Redirect to dashboard or another page upon successful sign-in
            } else if (isMounted) {
                setError('User details not found');
            }
        } catch (error) {
            if (isMounted) {
                console.error('Error signing in:', error);
                setError(`Failed to sign in: ${error.message}`);
            }
        } finally {
            if (isMounted) {
                setIsSubmitting(false);
            }
        }
    
        // Cleanup function
        return () => {
            isMounted = false; // Set to false to prevent state updates after unmounting
        };
    };
    

    const handleSocialLogin = async (provider) => {
        setError('');

        try {
            // Implement your social login logic here
            // Example using Google provider
            // const userCredential = await signInWithPopup(auth, provider);
            // const user = userCredential.user;
            // await fetchUserData(user.email, 'student'); // Replace 'student' with the actual user role
        } catch (error) {
            console.error('Error with social login:', error);
            setError(`Failed to sign in with social provider: ${error.message}`);
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
                        {error && <Text style={{ color: 'red' }}>{error}</Text>}
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            isLoading={isSubmitting}
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
