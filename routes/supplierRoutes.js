const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), supplierController.createSupplier); // Create
router.get('/', protect, supplierController.getSuppliers); // Read All
router.get('/:id', protect, supplierController.getSupplierById); // Read One
router.put('/:id', protect, authorize('admin'), supplierController.updateSupplier); // Update
router.delete('/:id', protect, authorize('admin'), supplierController.deleteSupplier); // Delete

module.exports = router;
