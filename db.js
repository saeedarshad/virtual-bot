var mongoose = require('mongoose');

const url =
  "mongodb://saeedarshadd:vsalesbot123@ds211083.mlab.com:11083/vsalesbot";

module.exports = function () {
  mongoose.connect(url, {
      useNewUrlParser: true
    })
    .then(() => console.log(' connected to database.. '))
    .catch(() => console.log('unable to connect to database '));
};