const mongoose = require('mongoose');

const productOrderHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductOrderHistory', productOrderHistorySchema);