const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // ชื่อสินค้า
    description: { type: String }, // รายละเอียดสินค้า
    category: { type: String, required: true }, // หมวดหมู่สินค้า
    tags: [{ type: String, required: true }], // แท็กสินค้า
    price: { type: Number, required: true }, // ราคาหลัก
    discountPrice: { type: Number }, // ราคาหลังหักส่วนลด (ถ้ามี)
    discountPercentage: { type: Number }, // เปอร์เซ็นต์ส่วนลด (ถ้ามี)
    stockQuantity: { type: Number, required: true }, // จำนวนสต็อกคงเหลือ
    createdAt: { type: Date, default: Date.now }, // วันที่เพิ่มสินค้า
    updatedAt: { type: Date, default: Date.now }, // วันที่ปรับปรุงล่าสุด
    supplier: { type: String }, // ผู้จัดจำหน่ายหรือผู้ผลิต
    barcode: { type: String }, // รหัสบาร์โค้ดหรือ QR Code
    costPrice: { type: Number, required: true }, // ต้นทุนสินค้า
    productURL: { type: String }, // URL ของสินค้า
    internalNotes: { type: String }, // หมายเหตุภายใน
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
