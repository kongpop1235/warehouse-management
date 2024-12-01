const Product = require('../models/product');
const Tag = require('../models/tag');
const Category = require('../models/category');
const Supplier = require('../models/supplier');

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

async function addProductReferenceToSupplier(productId, supplierId) {
    if (supplierId) {
        await Supplier.findByIdAndUpdate(
            supplierId,
            { $addToSet: { referencedProducts: productId } }
        );
    }
}

async function removeProductReferenceFromSupplier(productId, supplierId) {
    if (supplierId) {
        await Supplier.findByIdAndUpdate(
            supplierId,
            { $pull: { referencedProducts: productId } }
        );
    }
}

exports.createProduct = async (req, res, next) => {
    try {
        // Separate `tags` and `category` into usable formats.
        req.body.tags = extractTagIds(req.body.tags);

        const product = new Product(req.body);
        await product.save();

        // Update references in `Tag`, `Category`, and `Supplier`
        await addProductReferenceToTags(product._id, product.tags);
        await addProductReferenceToCategory(product._id, product.category);
        await addProductReferenceToSupplier(product._id, product.supplier);

        // Populate category, tags, and supplier to retrieve full data
        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name')
            .populate('tags', 'name')
            .populate('supplier', 'name status');

        // Structure the data to include only relevant fields
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
            supplier: populatedProduct.supplier
                ? {
                    id: populatedProduct.supplier._id,
                    name: populatedProduct.supplier.name,
                    status: populatedProduct.supplier.status,
                }
                : null,
        };

        res.status(201).json(formattedProduct);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category', 'name description')
            .populate('tags', 'name description')
            .populate('supplier', 'name description');

        const productsWithFormattedFields = products.map(product => ({
            ...product.toObject(),
            category: product.category
                ? {
                    id: product.category._id,
                    en: product.category.name.en,
                    th: product.category.name.th,
                    description: product.category.description
                }
                : null,
            tags: product.tags.map(tag => ({
                id: tag._id,
                en: tag.name.en,
                th: tag.name.th,
                description: tag.description
            })),
            supplier: product.supplier
                ? {
                    id: product.supplier._id,
                    name: product.supplier.name,
                    description: product.supplier.description
                }
                : null,
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
        await removeProductReferenceFromSupplier(existingProduct._id, existingProduct.supplier);

        // Update new information
        req.body.tags = extractTagIds(req.body.tags);
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Add new references in `Tag` and `Category`
        await addProductReferenceToTags(updatedProduct._id, updatedProduct.tags);
        await addProductReferenceToCategory(updatedProduct._id, updatedProduct.category);
        await addProductReferenceToSupplier(updatedProduct._id, updatedProduct.supplier);

        const populatedProduct = await Product.findById(updatedProduct._id)
            .populate('category', 'name')
            .populate('tags', 'name');

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
        res.json(formattedProduct);
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
        await removeProductReferenceFromSupplier(product._id, product.supplier);

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
