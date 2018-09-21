const express = require("express");
const moongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", (req, res) => {
  var entity = req.body.queryResult.parameters.mobile;
  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText;
  return res.send({
    fulfillmentText:
      entity +
      " is entity.. " +
      message +
      " is text from user " +
      "response from Node End Point and This is " +
      intent,
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

module.exports = router;
