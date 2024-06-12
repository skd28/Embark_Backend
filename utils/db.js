const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URL;
        // console.log(`MongoDB URI: ${mongoUri}`);  // Debugging line to check URI
        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: `); //${conn.connection.host}
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDb;
