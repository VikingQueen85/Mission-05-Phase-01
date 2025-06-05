
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_price: { type: Number, required: true },
    reserve_price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// We explicitly name the collection 'products'
module.exports = mongoose.model('Product', productSchema, 'products');