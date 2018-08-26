var mongoose = require('mongoose');

module.exports = function () {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(' connected to database.. '))
  .catch(() => console.log('unable to connect to database '));
};
