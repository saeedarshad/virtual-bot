const express = require("express");
const MongoClient = require("mongodb").MongoClient;
//const url = "mongodb://localhost:27017/BOT";
const url =
  "mongodb://saeedarshadd:vsalesbot123@ds211083.mlab.com:11083/vsalesbot";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", async (req, res) => {
  const db = await connection();
  const result = await db
    .collection("iphones")
    .find({ Price: { $lt: 2 } })
    .toArray();

  console.log("result is : ", typeof result);

  /* var mobile = req.body.queryResult.parameters.mobiles;
  //var memory = req.body.queryResult.parameters.memorygb;
  var colour = req.body.queryResult.parameters.colour;

  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText; */
  return res.send({
    fulfillmentText: JSON.stringify(result),
    /* mobile +
      " is mobile.. " +
      // memory +
      //" in gb.. " +
      colour +
      " is colour.. " +
      message +
      " is text from user " +
      "response from Node End Point and This is " +
      intent, */
    /* "fulfillmentMessages": [
            {
              "card": {
                "title": "card title",
                "subtitle": "card text",
                "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                "buttons": [
                  {
                    "text": "button text",
                    "postback": "https://assistant.google.com/"
                  }
                ]
              }
            }
          ], */
    source: "virtual sales bot",
    payload: {
      name: "saeed",
      age: 22
    }
  });
});

async function connection() {
  const client = await MongoClient.connect(
    url,
    { useNewUrlParser: true }
  );
  if (client.error) return console.log("unable to connect to mongodb server");
  console.log("Connected successfully to mongodb server");

  var db = client.db("vsalesbot");
  // var db = client.db("BOT");

  return db;
}

module.exports = router;
