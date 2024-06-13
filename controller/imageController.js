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

const getAllImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    uploadImage,
    getAllImages 
};
