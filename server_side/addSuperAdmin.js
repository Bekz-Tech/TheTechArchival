const mongoose = require('mongoose');
const {SuperAdmin} = require('./models/schema/onlineUsers');  // Import your SuperAdmin model

// Function to create a SuperAdmin and add it to the database
const createSuperAdmin = async () => {
  try {
    // MongoDB connection
    await mongoose.connect('mongodb://localhost:27017/users');

    // Define SuperAdmin data
    const superAdminData = {
      email: 'superadmin@example.com',
      password: 'superadminpassword',  // Don't forget to hash the password in a real-world scenario!
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '123-456-7890',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idCardUrl: '',  // Add your idCardUrl if needed
    
    };

    // Create a new SuperAdmin instance
    const newSuperAdmin = new SuperAdmin(superAdminData);

    // Save to the database
    const savedSuperAdmin = await newSuperAdmin.save();
    console.log('SuperAdmin created successfully:', savedSuperAdmin);

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
    mongoose.connection.close();
  }
};

// Execute the function to create a SuperAdmin
createSuperAdmin();
