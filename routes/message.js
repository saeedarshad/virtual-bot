const express = require("express");
var Sentiment = require("sentiment");
var nodemailer = require("nodemailer");
var sentiment = new Sentiment();
const {
  Iphone,
  Samsung
} = require("../models/mobile");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", async (req, res) => {
  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText;
  if (intent === "mobile_order_specification") {
    var mobile = req.body.queryResult.parameters.model;
    var colour = req.body.queryResult.parameters.colour;
    var memory = req.body.queryResult.parameters.storage;
    // var price = req.body.queryResult.parameters.price;
    // price = parseInt(price);
    console.log("Type of number : ", typeof price);
    console.log("Type of number : ", typeof colour);
    console.log("Type of number : ", typeof memory);
    console.log("intent : ", intent);
    console.log("mobileee : ", mobile);
    console.log("colourr : ", colour);
    console.log("memory : ", memory);
    // console.log("pricee : ", price);
    var result = sentiment.analyze(message);
    console.log("Sentiment analysis", result);

    if (
      String(mobile)
      .toLowerCase()
      .includes("iphone")
    ) {
      const iphone = await Iphone.findOne({
        /* price: {
          $gt: price - 1000,
          $lt: price + 1000
        }, */
        name: mobile,
        color: colour,
        storage: memory
      });
      if (!iphone) {
        var result = "Mobile not founddd";
      } else {
        console.log("iphone output ", iphone);
        var result = iphone.title + " " + iphone.price + ", Do you like it?";
        let emailContent =
          "You order is " +
          iphone.title +
          ".price : " +
          iphone.price +
          ",.. Thanks";
        //sendEmail("Order Details", emailContent);
      }
    } else if (
      String(mobile)
      .toLowerCase()
      .includes("samsung")
    ) {
      const samsung = await Samsung.findOne({
        /*  price: {
          $gt: price - 1000,
          $lt: price + 1000
        }, */
        name: mobile
        /* ,
                color: colour,
                storage: memory */
      });
      if (!samsung) {
        var result = "Mobile not found";
      } else {
        console.log("samsung output ", samsung);
        var result = samsung.title + " " /* + samsung.price */ + ", Do you like it?";
      }
    }
  }

  function sendEmail(subject, content) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "virtualsalesbot@gmail.com",
        pass: "dialogflow12345"
      }
    });

    var mailOptions = {
      from: "virtualsalesbot@gmail.com",
      to: "m.saeedarshad95@gmail.com",
      subject: subject,
      text: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
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