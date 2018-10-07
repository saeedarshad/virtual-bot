const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    discription: {
        type: String
    },
    storage: {
        type: String
    },
    color: {
        type: String
    },
    inStock: {
        type: Boolean
    }
});

const Iphone = mongoose.model('Iphones', mobileSchema);

exports.Iphone = Iphone;