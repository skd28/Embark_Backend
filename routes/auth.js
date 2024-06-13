// authRoutes.js

// routes/authRoutes.js
const express = require('express');
const { signupUser, loginUser, free_page } = require('../controller/authController');
const { uploadImage } = require('../controller/imageController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// Configure multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => file.originalname.split('.')[0],
    },
});
const upload = multer({ storage: storage });

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/free_pages', free_page);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;

