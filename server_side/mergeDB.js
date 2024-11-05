const mongoose = require('mongoose');
const User = require('./models/schema/user'); // Adjust the path according to your project structure

async function upsertData() {
    // Connection URIs
    const localUri = 'mongodb://localhost:27017/users'; // Replace with your local DB URI
    const atlasUri = 'mongodb+srv://chidi90simeon:NhHQ8lPLfsXSLU0F@babtech.8mtvjbk.mongodb.net/?retryWrites=true&w=majority&appName=babtech'

    try {
        // Connect to local MongoDB
        await mongoose.connect(localUri);
        console.log('Connected to local MongoDB');

        // Fetch all documents from the local database
        const localDocuments = await User.find().lean(); // Use lean() for plain JS objects

        // Close local connection before connecting to Atlas
        await mongoose.disconnect();
        console.log('Disconnected from local MongoDB');

        // Connect to MongoDB Atlas
        await mongoose.connect(atlasUri);
        console.log('Connected to MongoDB Atlas');

        // Upsert documents into the Atlas collection
        for (const doc of localDocuments) {
            await User.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
            console.log(`Upserted document with _id: ${doc._id}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Ensure to close the Atlas connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB Atlas');
    }
}

upsertData().catch(console.error);
