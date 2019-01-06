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
    thresholdPrice: {
        type: Number
    },
    description: {
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
    },
    imageUrl: {
        type: String
    },
    date: {
        type: Date
    }
});

const Iphone = mongoose.model('Iphones', mobileSchema);
const Samsung = mongoose.model('Samsungs', mobileSchema);
const Mobile = mongoose.model('Mobiles', mobileSchema);
const Mobile_temp = mongoose.model('MobilesTemp', mobileSchema);

exports.Iphone = Iphone;
exports.Samsung = Samsung;
exports.Mobile = Mobile;
exports.Mobile_temp = Mobile_temp;