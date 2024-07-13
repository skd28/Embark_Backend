const express = require('express');
const { signupUser, loginUser, free_page } = require('../controller/authController');
const { uploadImage, getAllImages, getImageById, deleteImageById, updateImageById, deleteImagesByIds, deleteAllImages, uploadMultipleImages } = require('../controller/imageController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { createBlog, getAllBlog, updateBlog, deleteBlogId, getBlogByID } = require('../controller/blogController');
const { createProduct, getAllProduct, getProductId, deleteProductByID, updateProductByID, deleteProductByIDS } = require('../controller/storeController');
const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png',
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
router.delete('/delete_image/:id', deleteImageById);
router.delete('/delete_images', deleteImagesByIds);
router.delete('/delete_all_images', deleteAllImages);
router.put('/images/:id', upload.single('image'), updateImageById);
router.post('/upload_many_images', upload.array('images', 10), uploadMultipleImages);

// Blog API
router.post('/blog_create', upload.single('image'), createBlog);
router.get('/allblogs', getAllBlog);
router.get('/blog_get/:id', getBlogByID); 
router.delete('/blog_delete/:id', deleteBlogId);
router.put('/blog_update/:id', upload.single('image'), updateBlog);



// Store Api
router.post('/store_create', upload.single('image'), createProduct);
router.get('/allproducts', getAllProduct);
router.get('/product_get/:id',getProductId);
router.delete('/product_delete/:id',deleteProductByID);
router.delete('/product_deletes',deleteProductByIDS);
router.put('/product_update/:id',updateProductByID);




module.exports = router;


