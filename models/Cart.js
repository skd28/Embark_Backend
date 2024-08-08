const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        // quantity: {
        //     type: Number,
        //     required: true,
        //     default: 1
        // }
    }],
    allow: {
        type: Boolean,
        required: true,
        default: true 
    }
});

module.exports = mongoose.model('Cart', cartSchema);
