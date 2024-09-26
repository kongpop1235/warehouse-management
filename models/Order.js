const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // สินค้าที่สั่งซื้อ
            quantity: { type: Number, required: true }, // จำนวนสินค้า
            price: { type: Number, required: true }, // ราคาต่อหน่วยของสินค้า
        },
    ],
    totalPrice: { type: Number, required: true }, // ราคาทั้งหมดของคำสั่งซื้อ
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ลูกค้าที่ทำการสั่งซื้อ
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }, // สถานะคำสั่งซื้อ
    createdAt: { type: Date, default: Date.now }, // วันที่สั่งซื้อ
    updatedAt: { type: Date, default: Date.now }, // วันที่มีการอัปเดตล่าสุด
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
