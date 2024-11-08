import React, { useState } from "react";
import { TextField,  Box, Typography } from "@mui/material";
import { db } from "../firebase/config"; // Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"; // Frestore functions
import { useNavigate } from "react-router-dom";
import myImage from "../images/authenticator-image.jpg";
import mobileImg from '../images/svg-2.svg';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ButtonElement";

const CodeAuthenticator = () => {
  const [inputCode, setInputCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Input Code:", inputCode);

    try {
      // Query Firestore to find the matching code
      const codesRef = collection(db, "codes");
      const q = query(codesRef, where("code", "==", inputCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const codeDoc = querySnapshot.docs[0]; // Get the first matching document
        const codeData = codeDoc.data();

        if (codeData.used) {
          // If the code is already used, alert the user
          alert("This code has already been used.");
          setError("This code has already been used.");
          setIsAuthenticated(false);
        } else {
          // If the code is unused, mark it as used and update the timestamp
          const now = new Date();

          // Format date as "13 Feb 2024"
          const options = { day: "numeric", month: "short", year: "numeric" };
          const formattedDate = now.toLocaleDateString("en-US", options);

          // Format time as "10:00AM"
          const timeOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

          // Update the Firestore document to mark the code as used and store the used date/time
          const codeDocRef = doc(db, "codes", codeDoc.id);
          await updateDoc(codeDocRef, {
            used: true,
            usedDate: formattedDate,
            usedTime: formattedTime,
          });

          setIsAuthenticated(true);
          setError("");
          alert("User authenticated successfully");
          navigate("/offlineSignup");
        }
      } else {
        // If the code doesn't exist, show an error
        setError("Invalid code. Please try again.");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error checking code: ", err);
      setError("An error occurred while checking the code.");
    }

    setInputCode(""); // Clear the input field after submission
  };


  return (
    <Box>
      {/* navbar */}

      <Navbar otp />

      {/* body */}
      <Box
        sx={{
          display: "flex",
          height: "95vh",
          marginTop: { xs: "-50px", md: "0" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          backgroundColor: "#fff",
          paddingX: "20px",
        }}
      >
        {/* Image placeholder on the left, hidden for screens smaller than 768px */}
        <Box
          sx={{
            width: { xs: "0%", md: "100%" },
            height: "100%",
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${myImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>

        {/* Form Section on the right */}

        <Box
          sx={{
            display: "flex",
            width: "100%",
            padding: "20px",
            placeContent: "center",
            alignItems: "center",
            height: "auto",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            color="#000000"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.2em", md: "2em" },
            }}
          >
            Welcome to Babtech computers
          </Typography>
          <Box
            sx={{
              display: "grid",
              width: "auto",
              padding: "20px",
              placeContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            <img
              src={mobileImg}
              alt="coding image "
              style={{ height: "150px", width: "150px" }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "5%",
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Enter OTP
            </Typography>

            <TextField
              label="Enter Code"
              variant="outlined"
              value={inputCode}
              onChange={handleInputChange}
              inputProps={{ maxLength: 11 }}
              sx={{ marginBottom: "20px", width: "100%" }}
            />

            <Button onClick={handleSubmit} primary otp>
              Submit
            </Button>

            {error && (
              <Typography color="error" sx={{ marginTop: "20px" }}>
                {error}
              </Typography>
            )}

            {isAuthenticated && (
              <Typography
                color="primary"
                sx={{ marginTop: "20px", color: "green" }} // Change to green for success
              >
                Code authenticated successfully!
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default CodeAuthenticator;
