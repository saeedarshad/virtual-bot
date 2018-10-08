const express = require("express");
const connection = require("../db");
const {
  Iphone,
  Samsung
} = require('../models/mobile');
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", async (req, res) => {
  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText;
  if (intent === 'order.mobile') {
    var mobile = req.body.queryResult.parameters.mobiles;
    var colour = req.body.queryResult.parameters.colour;
    var memory = req.body.queryResult.parameters.memory_gb;
    var price = req.body.queryResult.parameters.price;
    price = Number(price);
    console.log('Type of number : ', typeof price);
    console.log('intent : ', intent);
    console.log('mobileee : ', mobile);
    console.log('colourr : ', colour);
    console.log('memory : ', memory);
    console.log('pricee : ', price);

  }


  const iphone = await Iphone.findOne({
    price: price,
    name: mobile,
    color: colour,
    storage: memory
  });
  if (!iphone) {
    var result = 'Mobile not found';
  } else {
    console.log('iphone output ', iphone);
    var result = iphone.title + " " + iphone.price;
  }


  /* var mobile = req.body.queryResult.parameters.mobiles;
  //var memory = req.body.queryResult.parameters.memorygb;
  var colour = req.body.queryResult.parameters.colour;

   */
  return res.send({
    fulfillmentText: result,
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
    /* fulfillmentMessages: [{
      card: {
        title: iphone.title,
        subtitle: "Session : " + session,
        imageUri: "https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2014/03/topic_iphone_5.png?itok=EHmSheG0",
        buttons: [{
          text: "Buy",
          postback: "https://assistant.google.com/"
        }]
      }
    }], */
    source: "virtual sales bot",
    payload: {
      name: "saeed",
      age: 22
    }
  });
});

module.exports = router;