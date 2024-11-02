const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercentage: { type: Number },
    stockQuantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    supplier: { type: String },
    barcode: { type: String },
    costPrice: { type: Number, required: true },
    productURL: { type: String },
    internalNotes: { type: String },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
