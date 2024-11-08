const Product = require('../models/product');
const Tag = require('../models/tag');
const Category = require('../models/category');

function extractTagIds(tags) {
    return tags.map(tag => tag.$oid || tag);
}

async function addProductReferenceToTags(productId, tagIds) {
    await Tag.updateMany(
        { _id: { $in: tagIds } },
        { $addToSet: { referencedProducts: productId } }
    );
}

async function removeProductReferenceFromTags(productId, tagIds) {
    await Tag.updateMany(
        { _id: { $in: tagIds } },
        { $pull: { referencedProducts: productId } }
    );
}

async function addProductReferenceToCategory(productId, categoryId) {
    await Category.findByIdAndUpdate(
        categoryId,
        { $addToSet: { referencedProducts: productId } }
    );
}

async function removeProductReferenceFromCategory(productId, categoryId) {
    await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { referencedProducts: productId } }
    );
}

exports.createProduct = async (req, res, next) => {
    try {
        // Separate `tags` and `category` into usable formats.
        req.body.tags = extractTagIds(req.body.tags);

        const product = new Product(req.body);
        await product.save();

        // Update references in `Tag` and `Category`
        await addProductReferenceToTags(product._id, product.tags);
        await addProductReferenceToCategory(product._id, product.category);

        // Populate category and tags to retrieve full data including `th`, `en`, and `id`
        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name')
            .populate('tags', 'name');

        // Structure the data to include only `th`, `en`, and `id` for tags and category
        const formattedProduct = {
            ...populatedProduct.toObject(),
            category: populatedProduct.category
                ? {
                    id: populatedProduct.category._id,
                    en: populatedProduct.category.name.en,
                    th: populatedProduct.category.name.th,
                }
                : null,
            tags: populatedProduct.tags.map(tag => ({
                id: tag._id,
                en: tag.name.en,
                th: tag.name.th,
            })),
        };

        res.status(201).json(formattedProduct);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('tags', 'name');

        const productsWithFormattedFields = products.map(product => ({
            ...product.toObject(),
            category: product.category
                ? {
                    id: product.category._id,
                    en: product.category.name.en,
                    th: product.category.name.th,
                }
                : null,
            tags: product.tags.map(tag => ({
                id: tag._id,
                en: tag.name.en,
                th: tag.name.th,
            })),
        }));

        res.json(productsWithFormattedFields);
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
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove old references in `Tag` and `Category`
        await removeProductReferenceFromTags(existingProduct._id, existingProduct.tags);
        await removeProductReferenceFromCategory(existingProduct._id, existingProduct.category);

        // Update new information
        req.body.tags = extractTagIds(req.body.tags);
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Add new references in `Tag` and `Category`
        await addProductReferenceToTags(updatedProduct._id, updatedProduct.tags);
        await addProductReferenceToCategory(updatedProduct._id, updatedProduct.category);

        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await removeProductReferenceFromTags(product._id, product.tags);
        await removeProductReferenceFromCategory(product._id, product.category);

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
