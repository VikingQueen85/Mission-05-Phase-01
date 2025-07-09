
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { seller: { $regex: search, $options: 'i' } },
                    { condition: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const items = await Product.find(query);
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Server error retrieving items.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
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