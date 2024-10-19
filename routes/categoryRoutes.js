const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route to create a new category (Only Admin)
router.post('/', protect, authorize('admin'), categoryController.createCategory);

// Route to get all categories
router.get('/', protect, categoryController.getCategories);

// Route to get category by ID
router.get('/:id', protect, categoryController.getCategoryById);

module.exports = router;
