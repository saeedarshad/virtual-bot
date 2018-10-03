const express = require("express");
const connection = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", async (req, res) => {
  const db = await connection();
  const result = await db
    .collection("iphones")
    .findOne({
      Price: {
        $gt: 50
      },
      $text: {
        $search: "\"5s\" Black"
      }
    }, {
      score: {
        $meta: "textScore"
      }
    });

  /* const result = await db
    .collection("iphones")
    .findOne({
      Price: {
        $lt: 2
      }
    }); */
  //.toArray();

  console.log("result is : ", result.Title);

  /* var mobile = req.body.queryResult.parameters.mobiles;
  //var memory = req.body.queryResult.parameters.memorygb;
  var colour = req.body.queryResult.parameters.colour;

  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText; */
  return res.send({
    fulfillmentText: result.Title + ' ' +
      result.Price,
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
    "fulfillmentMessages": [{
      "card": {
        "title": "Mobile",
        "subtitle": "Iphone",
        "imageUri": "https://www.google.com.pk/search?q=iphone+5+image&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiBn-zOrurdAhUI_SoKHbDqCWsQ_AUIDigB&biw=1366&bih=626#imgrc=fc129Q30dapyZM:",
        "buttons": [{
          "text": "Buy",
          "postback": "https://assistant.google.com/"
        }]
      }
    }],
    source: "virtual sales bot",
    payload: {
      name: "saeed",
      age: 22
    }
  });
});

module.exports = router;