const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const tag = new Tag({
            name: {
                en: name.en,
                th: name.th
            },
            description
        });

        await tag.save();
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
};

// Get all tags
exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
};

// Get tag by ID
exports.getTagById = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};

// Update a tag by ID
exports.updateTag = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        tag.name.en = name.en;
        tag.name.th = name.th;
        tag.description = description;

        await tag.save();
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};

// Delete a tag by ID
exports.deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the tag by ID
        const tag = await Tag.findById(id);

        if (!tag) {
            return res.status(404).json({ message: "tags.alert.notFound" });
        }

        // Check if the tag is referenced by any products
        if (tag.referencedProducts && tag.referencedProducts.length > 0) {
            return res.status(400).json({
                message: "tags.alert.referenced"
            });
        }

        // Proceed with deletion if no references exist
        await Tag.findByIdAndDelete(id);

        res.status(200).json({ message: "tags.deleteSuccess" });
    } catch (error) {
        next(error);
    }
};