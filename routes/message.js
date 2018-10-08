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
  var colour = req.body.queryResult.parameters.colour;
  var memory = req.body.queryResult.parameters.memorygb;
  var session = req.body.session;
  var responseId = req.body.responseId;
  var speech_confidence = req.body.queryResult.speechRecognitionConfidence;
  var action = req.body.queryResult.responseId;
  var context = req.body.queryResult.context;
  var intentDetectionConfidence = req.body.queryResult.intentDetectionConfidence;
  var diagnosticInfo = req.body.queryResult.diagnosticInfo;

  const iphone = await Iphone.findOne({
    price: {
      $gt: 100000
    },
  });

  /* const result = await db
    .collection("iphones")
    .findOne({
      Price: {
        $lt: 2
      }
    }); */
  //.toArray();

  //console.log("session is : ", session);
  console.log('iphone output ', iphone);
  console.log('iphone id: ', iphone._id);
  console.log('iphone Title: ', iphone.title);
  console.log('Speech ', speech_confidence);
  console.log('Response Id ', responseId);
  console.log('Action ', action);
  console.log('output context', context);
  console.log(' intentDetectionConfidence', intentDetectionConfidence);
  console.log(' diagnosticInfo', diagnosticInfo);



  /* var mobile = req.body.queryResult.parameters.mobiles;
  //var memory = req.body.queryResult.parameters.memorygb;
  var colour = req.body.queryResult.parameters.colour;

  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText; */
  return res.send({
    fulfillmentText: iphone.title + " " + iphone.price,
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
    fulfillmentMessages: [{
      card: {
        title: iphone.title,
        subtitle: "Session : " + session,
        imageUri: "https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2014/03/topic_iphone_5.png?itok=EHmSheG0",
        buttons: [{
          text: "Buy",
          postback: "https://assistant.google.com/"
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