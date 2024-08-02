const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    imageurl: {
        type: [String],
        required: true,
    },
    cloudinary_id: {
        type: [String],
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    category :                                                                                                              
    {
        type: String,
        required: true 
    },
    descriptions: {
        type: String,
    },
    price: {
        type: String,
    },
    discount: {
        type: Number,
    },
    amazon_link: {
        type: String,
    },
    digital_product_link:{
        type: String,
    },
    review : {
        type: Number,
    },
    live :{
        type :Boolean,
        required:true,
    }
    
});

module.exports = mongoose.model('Store', StoreSchema);