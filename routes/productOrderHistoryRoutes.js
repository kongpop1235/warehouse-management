const express = require('express');
const router = express.Router();
const productOrderHistoryController = require('../controllers/productOrderHistoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Retrieve all order history (Admin only)
router.get('/', protect, authorize('admin'), productOrderHistoryController.getAllProductOrderHistories);

// Retrieve order history of products according to productId (Login required)
router.get('/product/:productId', protect, productOrderHistoryController.getProductOrderHistoryByProductId);

// Delete order history (Admin only)
router.delete('/:id', protect, authorize('admin'), productOrderHistoryController.deleteProductOrderHistory);

module.exports = router;
