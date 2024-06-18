const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    descriptions: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
    cloudinary_id: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Blog', BlogSchema);
