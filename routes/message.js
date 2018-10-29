const express = require("express");
var validator = require('validator');
var Sentiment = require("sentiment");
var nodemailer = require("nodemailer");
var sentiment = new Sentiment();
const {
  Iphone,
  Samsung,
  Mobile
} = require("../models/mobile");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get request on end point");
});

router.post("/", async (req, res) => {
  var intent = req.body.queryResult.intent.displayName;
  var message = req.body.queryResult.queryText;
  console.log('Intent name : ', intent)
  if (intent === "mobile_order_specification") {
    var mobile_model = req.body.queryResult.parameters.model;
    var colour = req.body.queryResult.parameters.colour;
    var memory = req.body.queryResult.parameters.storage;
    // var price = req.body.queryResult.parameters.price;
    // price = parseInt(price);
    // console.log("Type of number : ", typeof price);
    console.log("Type of number : ", typeof colour);
    console.log("Type of number : ", typeof memory);
    console.log("intent : ", intent);
    console.log("mobileee : ", mobile_model);
    console.log("colourr : ", colour);
    console.log("memory : ", memory);
    // console.log("pricee : ", price);
    var result = sentiment.analyze(message);
    console.log("Sentiment analysis", result);
    var imageUrl = null;
    const mobile = await Mobile.findOne({
      /* price: {
        $gt: price - 1000,
        $lt: price + 1000
      }, */
      name: mobile_model,
      color: colour,
      storage: memory
    });
    if (!Mobile) {
      var result = "Mobile not found";
      imageUrl =
        "https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552";
    } else {
      console.log("Mobile Output ", mobile);
      var result = mobile.title + " " + mobile.price + ", Do you like it?";
      imageUrl = mobile.imageUrl;
    }

  } else if (intent === 'mobile_order_specification_yes_custom_custom_custom') {
    var receiver = message;
    if (validator.isEmail(message)) {
      var subject = 'Order Details';
      var colour = req.body.queryResult.outputContexts[2].parameters.colour;
      var mobile_model = req.body.queryResult.outputContexts[2].parameters.model;
      var storage = req.body.queryResult.outputContexts[2].parameters.storage;
      var paymentMethod = req.body.queryResult.outputContexts[2].parameters.payment_method;
      const mobile = await Mobile.findOne({
        /* price: {
          $gt: price - 1000,
          $lt: price + 1000
        }, */
        name: mobile_model,
        color: colour,
        storage: storage
      });
      console.log('output context : ', req.body.queryResult.outputContexts[2])
      var content = '<h1>Here is Your order Details!</h1><br><br><h3>Mobile : </h3>' + mobile_model + '<h3>Colour : </h3>' + colour + '<h3>Storage  : </h3>' + storage + '<h3>Price  : </h3>' + mobile.price + '<br><img src=' + mobile.imageUrl + '>';
      sendEmail(subject, content, receiver);
      result = receiver;
      mobile_model = 'Email Sent to ';
      imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgoS83usvxagVAfmgo2f9cQW8e6ds6Yp25xCqz96Io8GQVrevGZg'
    } else {
      mobile_model = 'Invalid Email!!';
      result = 'please enter valid email';
    }

  } else {
    console.log('nothing match')
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
    fulfillmentMessages: [{
      card: {
        title: mobile_model,
        subtitle: result,
        imageUri: imageUrl,
        buttons: []
      }
    }],
    source: "virtual sales bot",
    payload: {
      name: "saeed",
      age: 22
    }
  });
});

function sendEmail(subject, content, receiver) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "virtualsalesbot@gmail.com",
      pass: "dialogflow12345"
    }
  });

  var mailOptions = {
    from: "virtualsalesbot@gmail.com",
    to: receiver,
    subject: subject,
    //text: content
    html: content
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = router;