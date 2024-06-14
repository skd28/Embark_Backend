const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    descrptions: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Blog', BlogSchema);