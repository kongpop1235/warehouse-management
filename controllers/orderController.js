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

// Fetch orders only for orders by ID.
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer').populate('orderItems.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        order.status = 'cancelled';
        await order.save();
        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};
