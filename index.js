// app.js

const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173' // or use '*' to allow all origins
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is Running");
});

app.use('/api', authRoutes);

connectDb();

app.listen(PORT, () => {
    console.log(`Server is Running at PORT: ${PORT}`);
});




