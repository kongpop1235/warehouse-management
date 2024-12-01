const Supplier = require('../models/supplier');

// Create a new supplier
exports.createSupplier = async (req, res, next) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json(supplier);
    } catch (error) {
        next(error);
    }
};

// Get all suppliers
exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        next(error);
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        next(error);
    }
};

// Get only ID, name, and status of all suppliers
exports.getSupplierIdsAndStatuses = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({ status: 'Active' }, '_id name status');
        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        next(error);
    }
};

// Update supplier by ID
exports.updateSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        next(error);
    }
};

// Delete supplier by ID
exports.deleteSupplier = async (req, res, next) => {
    try {
        // Find the supplier by ID
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Check if the supplier has any referencedProducts
        if (supplier.referencedProducts.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete supplier because there are referenced products.'
            });
        }

        // If no referenced products, proceed to delete
        await supplier.deleteOne();

        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        next(error);
    }
};