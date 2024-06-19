// controllers/imageController.js
// controllers/imageController.js
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

const uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = new Image({
            url: result.secure_url,
            cloudinary_id: result.public_id,
        });
        await image.save();
        res.json({ message: 'Image uploaded successfully', image });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const uploadMultipleImages = async (req, res) => {
    try {
        const uploadPromises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            const image = new Image({
                url: result.secure_url,
                cloudinary_id: result.public_id,
            });
            await image.save();
            return image;
        });

        const images = await Promise.all(uploadPromises);

        res.json({ message: 'Images uploaded successfully', images });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// New function to delete an image by ID


const deleteImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Debugging log
        console.log(`Deleting image with ID: ${req.params.id}, Cloudinary ID: ${image.cloudinary_id}`);

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);

        // Delete image from MongoDB
        await Image.deleteOne({ _id: req.params.id });

        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error('Error deleting image:', err);  // Improved error logging
        res.status(500).json({ error: err.message });
    }
};

const deleteImagesByIds = async (req, res) => {
    try {
        const { ids } = req.body; // Assume an array of IDs is sent in the request body

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided or IDs is not an array' });
        }

        const images = await Image.find({ _id: { $in: ids } });

        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found with the provided IDs' });
        }

        // Delete images from Cloudinary
        const cloudinaryIds = images.map(image => image.cloudinary_id);
        const deletePromises = cloudinaryIds.map(id => cloudinary.uploader.destroy(id));
        await Promise.all(deletePromises);

        // Delete images from MongoDB
        await Image.deleteMany({ _id: { $in: ids } });

        res.json({ message: 'Images deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAllImages = async (req, res) => {
    try {
        // Fetch all images
        const images = await Image.find();

        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        // Delete all images from Cloudinary
        const cloudinaryDeletePromises = images.map(image =>
            cloudinary.uploader.destroy(image.cloudinary_id)
        );

        await Promise.all(cloudinaryDeletePromises);

        // Delete all images from MongoDB
        await Image.deleteMany({});

        res.json({ message: 'All images deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);

        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Update the image in MongoDB
        image.url = result.secure_url;
        image.cloudinary_id = result.public_id;
        await image.save();

        res.json({ message: 'Image updated successfully', image });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    uploadImage,
    getAllImages,
    getImageById,
    deleteImagesByIds,
    deleteAllImages,
     deleteImageById ,
    updateImageById,
    uploadMultipleImages// export the new function
};

