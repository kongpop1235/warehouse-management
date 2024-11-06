const mongoose = require('mongoose');

// ตรวจสอบว่ามี Model ที่ชื่อ `Tag` อยู่แล้วหรือไม่
const Tag = mongoose.models.Tag || mongoose.model('Tag', new mongoose.Schema({
    name: {
        en: { type: String, required: true, unique: true, maxlength: 255 },
        th: { type: String, required: true, unique: true, maxlength: 255 },
    },
    description: { type: String, maxlength: 1000 },
    referencedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}));

module.exports = Tag;
