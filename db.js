const MongoClient = require("mongodb").MongoClient;
//const url = "mongodb://localhost:27017/BOT";
const url =
  "mongodb://saeedarshadd:vsalesbot123@ds211083.mlab.com:11083/vsalesbot";

async function connection() {
  const client = await MongoClient.connect(
    url, {
      useNewUrlParser: true
    }
  );
  if (client.error) return console.log("unable to connect to mongodb server");
  console.log("Connected successfully to mongodb server");

  var db = client.db("vsalesbot");
  // var db = client.db("BOT");

  return db;
}

module.exports = connection