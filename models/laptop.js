const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    thresholdPrice: {
        type: Number
    },
    description: {
        type: String
    },
    storage: {
        type: String
    },
    ram: {
        type: String
    },
    color: {
        type: String
    },
    inStock: {
        type: Boolean
    },
    imageUrl: {
        type: String
    }
});

const Laptop = mongoose.model('Laptops', laptopSchema);

exports.Laptop = Laptop;