const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create an order (Required to login)
router.post('/', protect, orderController.createOrder);

// List all orders (admin only)
router.get('/', protect, authorize('admin'), orderController.getOrders);

// Shows the order history of one customer. (Required to login)
// router.get('/history/:customerId', protect, orderController.getOrderHistory);

module.exports = router;
