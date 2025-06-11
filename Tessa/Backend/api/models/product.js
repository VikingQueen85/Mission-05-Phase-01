
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    start_price: { type: Number, required: true },
    reserve_price: { type: Number, required: true },
    current_price: { type: Number, required: true },
    end_time: { type: Date, required: true },
    seller: { type: String, required: true },
    image_urls: [{ type: String }],
    condition: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema, 'products');
