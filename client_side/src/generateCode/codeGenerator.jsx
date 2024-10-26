import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { db } from "../firebase/config"; // Make sure to import your Firebase config
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firestore functions
import Modal from "../pages/dashboard/components/modal"; // Import your reusable Modal

const CodeGenerator = () => {
  const [codes, setLocalCodes] = useState(''); // Local state for handling codes
  const [modalOpen, setModalOpen] = useState(false); // State to handle modal visibility
  const [sortBy, setSortBy] = useState("generatedDate"); // Sorting state
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Function to generate and save the code
  const generateCode = async () => {
    const length = 11;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    // Generate a random 11-character alphanumeric code
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const now = new Date();

    // Format date and time
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

    const codeData = {
      code: result,
      generatedDate: formattedDate,
      generatedTime: formattedTime,
      used: false, // Initially set as unused
      usedDate: null, // No date since it's not used yet
      usedTime: null, // No time since it's not used yet
    };

    try {
      // Save the code to Firestore with the additional fields
      const docRef = await addDoc(collection(db, "codes"), codeData);
      console.log("Document written with ID: ", docRef.id);

      setLocalCodes(result); // Update local state
      setModalOpen(true);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

 


  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Button variant="contained" color="secondary" onClick={generateCode}>
          Generate Code
        </Button>

        {modalOpen && (
          <Modal open={true}
            onClose={() => setModalOpen(false)}
            title="This your generated code below:"
            noConfirm>
            
            <p>{codes}</p>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default CodeGenerator;
