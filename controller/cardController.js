// const User = require("../models/User");
const Store = require("../models/Store");
const Cart = require("../models/Cart");



const createCart = async (req, res) => {
    const { userId, productId, quantity, allow } = req.body;

    try {

        const product = await Store.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {

            cart = new Cart({ userId, products: [] });
        }

        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex !== -1) {

            // cart.products[productIndex].quantity += quantity;
            return res.status(404).json({ error: " Product Already Avilable in Cart " })
        } else {

            cart.products.push({ productId, quantity });
        }

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};



const allProducts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.productId');
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createCart,
    allProducts

}