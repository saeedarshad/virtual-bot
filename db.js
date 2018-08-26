var mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/BOT" || process.env.MONGODB_URI;
module.exports = function () {
  mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => console.log(' connected to database.. '))
  .catch(() => console.log('unable to connect to database '));
};
