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
    },
    date: {
        type: Date
    }
});

const Laptop = mongoose.model('Laptops', laptopSchema);
const Laptop_temp = mongoose.model('LaptopsTemp', laptopSchema);

exports.Laptop = Laptop;
exports.Laptop_temp = Laptop_temp;