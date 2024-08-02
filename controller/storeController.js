const cloudinary = require('../config/cloudinary');
const Store = require("../models/Store")


const createProduct = async (req, res) => {
    try {
        const { title, category, descriptions, price, discount, amazon_link, digital_product_link, review, live } = req.body;

        const uploadPromises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return {
                imageurl: result.secure_url,
                cloudinary_id: result.public_id,
            };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map(image => image.imageurl);
        const cloudinaryIds = uploadedImages.map(image => image.cloudinary_id);


        const store = new Store({
            title,
            category,
            descriptions,
            price,
            discount,
            amazon_link,
            digital_product_link,
            review,
            live,
            imageurl: imageUrls,
            cloudinary_id: cloudinaryIds,
        });
        await store.save();
        res.status(201).json({ message: 'Product created successfully', store });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getAllProduct = async (req, res) => {
    try {
        const stores = await Store.find();
        //      console.log(stores)
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getProductId = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(store);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteProductByID = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images from Cloudinary if they exist
        if (store.cloudinary_id && store.cloudinary_id.length > 0) {
            const deletePromises = store.cloudinary_id.map(id => cloudinary.uploader.destroy(id));
            await Promise.all(deletePromises);
        }

        // Delete the product from MongoDB
        await Store.findByIdAndDelete(req.params.id);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const deleteProductByIDS = async (req, res) => {
    try {
        const { ids } = req.body; // Expect an array of IDs

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided or IDs is not an array' });
        }

        const products = await Store.find({ _id: { $in: ids } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with the provided IDs' });
        }

        // Delete images from Cloudinary
        const cloudinaryIds = products.flatMap(product => product.cloudinary_id);
        const deletePromises = cloudinaryIds.map(id => cloudinary.uploader.destroy(id));
        await Promise.all(deletePromises);

        // Delete products from MongoDB
        await Store.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




const updateProductByID = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        const { title, category, descriptions, price, discount, amazon_link, digital_product_link, review, live } = req.body;
        if (!store) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (title !== undefined) {
            store.title = title;
        }
        if (category !== undefined) {
            store.category = category;
        }
        if (descriptions !== undefined) {
            store.descriptions = descriptions;
        }
        if (price !== undefined) {
            store.price = price;
        }
        if (discount !== undefined) {
            store.discount = discount;
        }
        if (amazon_link !== undefined) {
            store.amazon_link = amazon_link;
        }
        if (digital_product_link !== undefined) {
            store.digital_product_link = digital_product_link;
        }
        if (review !== undefined) {
            store.review = review;
        }
        if (live !== undefined) {
            store.live = live;
        }

        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            // if (store.cloudinary_id && store.cloudinary_id.length > 0) {
            //     const deletePromises = store.cloudinary_id.map(id => cloudinary.uploader.destroy(id));
            //     await Promise.all(deletePromises);
            // }

            // Upload new images to Cloudinary   
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return {
                    imageurl: result.secure_url,
                    cloudinary_id: result.public_id,
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const imageUrls = uploadedImages.map(image => image.imageurl);
            const cloudinaryIds = uploadedImages.map(image => image.cloudinary_id);

            store.imageurl = imageUrls;
            store.cloudinary_id = cloudinaryIds;
        }

        store.updatedAt = Date.now();
        await store.save();
        res.status(200).json({ message: 'Product Updated Successfully', store });

    } catch (error) {
        res.status(500).json({ "Message for Product Update getting error ": error.message });
    }
}




module.exports = {
    createProduct,
    getAllProduct,
    getProductId,
    deleteProductByID,
    deleteProductByIDS,
    updateProductByID,
}