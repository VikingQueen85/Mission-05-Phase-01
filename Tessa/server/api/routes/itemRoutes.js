
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /items - Retrieve all items or search by keyword
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };
    }

    // Project only the required fields, excluding _id
    const items = await Product.find(query, { _id: 0, title: 1, description: 1, start_price: 1, reserve_price: 1 });
    res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Server error retrieving items.' });
    }
});

// GET /items/:id - Retrieve a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Product.findById(req.params.id, { _id: 0, title: 1, description: 1, start_price: 1, reserve_price: 1 });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid item ID format' });
        }
        console.error('Error fetching item by ID:', err);
        res.status(500).json({ message: 'Server error retrieving item.' });
    }
});

module.exports = router;