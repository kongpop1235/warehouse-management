const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, unique: true, maxlength: 255 },
        th: { type: String, required: true, unique: true, maxlength: 255 }
    },
    description: { type: String, maxlength: 1000 },
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
