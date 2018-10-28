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
  console.log('Intent name : ', intent)
  if (intent === "mobile_order_specification") {
    var mobile = req.body.queryResult.parameters.model;
    var colour = req.body.queryResult.parameters.colour;
    var memory = req.body.queryResult.parameters.storage;
    // var price = req.body.queryResult.parameters.price;
    // price = parseInt(price);
    // console.log("Type of number : ", typeof price);
    console.log("Type of number : ", typeof colour);
    console.log("Type of number : ", typeof memory);
    console.log("intent : ", intent);
    console.log("mobileee : ", mobile);
    console.log("colourr : ", colour);
    console.log("memory : ", memory);
    // console.log("pricee : ", price);
    var result = sentiment.analyze(message);
    console.log("Sentiment analysis", result);
    var imageUrl = null;

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
        var result = "Mobile not found";
        imageUrl =
          "https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552";
      } else {
        console.log("iphone output ", iphone);
        var result = iphone.title + " " + iphone.price + ", Do you like it?";
        imageUrl = iphone.imageUrl;
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
        name: mobile,
        color: colour,
        storage: memory
      });
      if (!samsung) {
        var result = "Mobile not found";
        imageUrl =
          "https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552";
      } else {
        console.log("samsung output ", samsung);
        imageUrl = samsung.imageUrl;
        console.log("image uri", imageUrl);
        var result =
          samsung.title + ". Price :  " + samsung.price + ", Do you like it?";
      }
    }
  }
  if (intent === 'mobile_order_specification_yes_custom_custom_custom') {
    var receiver = message;
    var subject = 'Order Details';
    var colour = req.body.queryResult.outputContexts[2].parameters.colour;
    var mobile = req.body.queryResult.outputContexts[2].parameters.model;
    var storage = req.body.queryResult.outputContexts[2].parameters.storage;
    var paymentMethod = req.body.queryResult.outputContexts[2].parameters.payment_method;
    console.log('output context : ', req.body.queryResult.outputContexts[2])
    var content = '<h1>Here is Your order Details!</h1><br><br><h3>Mobile : </h3>' + mobile + 'in ' + colour + ' colour with ' + storage + ' storage';
    sendEmail(subject, content, receiver);
    result = 'Email Sent';
    title = '';
    imageUrl = ''
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
        title: mobile,
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