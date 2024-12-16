const ProductOrderHistory = require('../models/productOrderHistoryModel');

// Retrieve all order history
exports.getAllProductOrderHistories = async (req, res, next) => {
  try {
    const histories = await ProductOrderHistory.find()
      .populate('productId', 'name price')
      .populate('orderId', 'totalPrice createdAt');
    res.json(histories);
  } catch (error) {
    next(error);
  }
};

// Retrieve order history for a specific product based on productId
exports.getProductOrderHistoryByProductId = async (req, res, next) => {
  try {
    const histories = await ProductOrderHistory.find({ productId: req.params.productId })
      .populate('orderId', 'totalPrice createdAt');
    res.json(histories);
  } catch (error) {
    next(error);
  }
};

// Delete order history
exports.deleteProductOrderHistory = async (req, res, next) => {
  try {
    const history = await ProductOrderHistory.findByIdAndDelete(req.params.id);
    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }
    res.json({ message: 'History deleted successfully' });
  } catch (error) {
    next(error);
  }
};
