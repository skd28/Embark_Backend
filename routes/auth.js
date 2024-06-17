// authRoutes.js

const express = require('express');
const { signupUser, loginUser, free_page } = require('../controller/authController');

const { uploadImage, getAllImages, getImageById, deleteImageById, updateImageById, deleteImagesByIds, deleteAllImages, uploadMultipleImages } = 
require('../controller/imageController');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {  updateBlog, createBlog, getAllBlog,  deleteBlogId } = require('../controller/blogController');
const router = express.Router();


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

// Images API
router.post('/upload', upload.single('image'), uploadImage);
router.get('/images', getAllImages);
router.get('/images/:id', getImageById);
//router.delete('/images/:id', deleteImageById) 
router.delete('/delete_images', deleteImagesByIds);
router.delete('/delete_all_images', deleteAllImages);
router.put('/images/:id', upload.single('image'), updateImageById);
router.post('/upload_many_images', upload.array('images', 10), uploadMultipleImages);


// Blog API
router.post('/blog_create',createBlog);
router.post('/blog_update/:id',updateBlog);
router.get('/allblogs',getAllBlog);
router.delete('/blog_delete/:id',deleteBlogId);


module.exports = router;

