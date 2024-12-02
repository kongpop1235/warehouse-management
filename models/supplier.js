const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 100, required: true },
        description: { type: String, maxlength: 1000, required: true },
        address: {
            street: { type: String, maxlength: 250, required: true },
            city: { type: String, maxlength: 100, required: true },
            state: { type: String, maxlength: 100, required: true },
            zipcode: { type: String, maxlength: 20, required: true },
            country: { type: String, maxlength: 100, required: true },
        },
        contact: {
            phone: { type: String, maxlength: 20, required: true },
            email: { type: String, maxlength: 50, required: true },
            website: { type: String, maxlength: 250, required: true },
            fax: { type: String, maxlength: 20, required: true },
        },
        contactPerson: {
            name: { type: String, maxlength: 100, required: true },
            position: { type: String, maxlength: 100, required: true },
            phone: { type: String, maxlength: 20, required: true },
            email: { type: String, maxlength: 50, required: true },
        },
        type: {
            type: String,
            enum: ['Manufacturer', 'Distributor', 'Wholesaler'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        referencedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        createdBy: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
        updatedBy: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String },
            updatedAt: { type: Date },
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Supplier', SupplierSchema);
