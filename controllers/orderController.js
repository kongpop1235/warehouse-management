const Order = require('../models/Order');

// New order creation function
exports.createOrder = async (req, res, next) => {
    try {
        const { orderItems, totalPrice, customer } = req.body;

        const newOrder = new Order({
            orderItems,
            totalPrice,
            customer,
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

// Function to list all orders
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('customer').populate('orderItems.product');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Function to display order history for a customer
// exports.getOrderHistory = async (req, res, next) => {
//     try {
//         const { customerId } = req.params;
//         const orders = await Order.find({ customer: customerId }).populate('orderItems.product');
//         res.json(orders);
//     } catch (error) {
//         next(error);
//     }
// };
