const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, unique: true, maxlength: 255 },
        th: { type: String, required: true, unique: true, maxlength: 255 }
    },
    description: { type: String, maxlength: 1000 },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
