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

// Delete a tag by ID
exports.deleteTag = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        next(error);
    }
};