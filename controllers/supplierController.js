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
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        next(error);
    }
};