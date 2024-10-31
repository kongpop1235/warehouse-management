const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route to create a new tag (Only Admin)
router.post('/', protect, authorize('admin'), tagController.createTag);

// Route to get all tags
router.get('/', protect, tagController.getTags);

// Route to get tag by ID
router.get('/:id', protect, tagController.getTagById);

module.exports = router;
