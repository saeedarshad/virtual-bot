const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    productId: {
        type: String
    }
});

const Order = mongoose.model('Orders', orderSchema);

exports.Order = Order;