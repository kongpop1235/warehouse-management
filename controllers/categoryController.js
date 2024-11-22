const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

// Update an existing category
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the category by ID
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "categories.alert.notFound" });
        }

        // Check if the category is referenced by any products
        if (category.referencedProducts && category.referencedProducts.length > 0) {
            return res.status(400).json({
                message: "categories.alert.referenced"
            });
        }

        // Proceed with deletion if no references exist
        await Category.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};