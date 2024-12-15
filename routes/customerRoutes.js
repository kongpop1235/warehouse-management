const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// create new customers (admin only)
router.post('/', protect, authorize('admin'), customerController.createCustomer);

// Retrieve all customer information (admin only)
router.get('/', protect, authorize('admin'), customerController.getCustomers);

// Retrieve customer information using ID (admin only)
router.get('/:id', protect, authorize('admin'), customerController.getCustomerById);

// Update customer information (admin only)
// router.put('/:id', protect, authorize('admin'), customerController.updateCustomer);

// Delete customer data (admin only)
// router.delete('/:id', protect, authorize('admin'), customerController.deleteCustomer);

module.exports = router;
