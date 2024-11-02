const Product = require('../models/product');

exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category')
            .populate('tags');
        // Adjust data before sending back
        const productsWithReducedFields = products.map(product => {
            // Reduce data in category to include only name.
            const categoryName = product.category ? product.category.name : null;
            // Reduce information in tags to include only name.
            const tagsNames = product.tags ? product.tags.map(tag => tag.name) : [];
            return {
                ...product.toObject(),
                category: categoryName,
                tags: tagsNames
            };
        });
        res.json(productsWithReducedFields);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};