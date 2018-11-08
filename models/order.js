const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    productId: {
        type: String
    }
});

const Order = mongoose.model('Orders', orderSchema);

exports.Order = Order;