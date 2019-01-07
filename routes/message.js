const express = require("express");
var validator = require('validator');
var Sentiment = require("sentiment");
var nodemailer = require("nodemailer");
var sentiment = new Sentiment();

const {
  Iphone,
  Samsung,
  Mobile,
  Mobile_temp
} = require("../models/mobile");

const {
  Laptop,
  Laptop_temp
} = require("../models/laptop");

const {
  Order
} = require("../models/order");

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
      storage: memory,
      inStock: true
    });
    if (!mobile) {
      var result = "Mobile not found";
      imageUrl =
        "https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552";
    } else {

      const mobile_temp = new Mobile_temp({
        name: mobile_model,
        title: mobile.title,
        color: colour,
        date: Date.now(),
        storage: memory,
        inStock: true,
        thresholdPrice: mobile.thresholdPrice,
        imageUrl: mobile.imageUrl,
        price: mobile.price
      });
      await mobile_temp.save();

      console.log("Mobile Output ", mobile);
      var result = mobile.title + " at price : " + mobile.price + ", Do you like it?";
      imageUrl = mobile.imageUrl;
    }

  } else if (intent === "laptop_order") {
    var laptop_model = req.body.queryResult.parameters.model1;
    var colour = req.body.queryResult.parameters.colour;
    var memory = req.body.queryResult.parameters.storage;
    var ram = req.body.queryResult.parameters.ram;
    // var price = req.body.queryResult.parameters.price;
    // price = parseInt(price);
    // console.log("Type of number : ", typeof price);
    console.log("Type of number : ", typeof colour);
    console.log("Type of number : ", typeof memory);
    console.log("intent : ", intent);
    console.log("laptop modelll : ", laptop_model);
    console.log("colourr : ", colour);
    console.log("memory : ", memory);
    console.log("Ram : ", ram);
    // console.log("pricee : ", price);
    //var result = sentiment.analyze(message);
    //console.log("Sentiment analysis", result);
    var imageUrl = null;
    const laptop = await Laptop.findOne({
      name: laptop_model,
      color: colour,
      storage: memory,
      ram: ram,
      inStock: true
    });

    console.log("Laptop Output ", laptop);
    if (!laptop) {
      var result = "Laptop not found";
      imageUrl =
        "https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552";
    } else {
      const laptop_temp = new Laptop_temp({
        name: laptop_model,
        title: laptop.title,
        date: Date.now(),
        color: colour,
        storage: memory,
        ram: ram,
        inStock: true,
        thresholdPrice: laptop.thresholdPrice,
        imageUrl: laptop.imageUrl,
        price: laptop.price
      });
      await laptop_temp.save();

      console.log("Laptop Output ", laptop);
      var result = laptop.title + " at price : " + laptop.price + ", Do you like it?";
      imageUrl = laptop.imageUrl;
    }

  } else if (intent === 'mobile_order_specification_yes_custom_custom_custom') {
    var receiver = message;
    var str = req.body.session;
    var userid = str.split("/");
    var userID = userid[4];
    console.log('User ID : ', userID);

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
        storage: storage,
        inStock: true
      });

      //Updated the db and marked the item as sold
      await Mobile.updateOne({
        name: mobile_model,
        color: colour,
        storage: storage,
        inStock: true
      }, {
        $set: {
          inStock: false
        }
      });

      //Add order in order Document

      const order = new Order({
        userId: userID,
        productId: mobile._id
      });
      await order.save();

      var disountedPrice = mobile.price - 500;
      console.log('output context : ', req.body.queryResult.outputContexts[2])
      var content = '<h1>Here is Your order Details!</h1><br><h2>We are giving Halloween treat.So we are giving you 500 off.Happy Shopping!:)</h2><h3>Mobile :' + mobile_model + '</h3><h3>Colour : ' + colour + '</h3><h3>Storage  :' + storage + ' </h3><h3>Price  : ' + disountedPrice + '</h3><br><img src=' + mobile.imageUrl + '>';
      sendEmail(subject, content, receiver);
      result = receiver;
      mobile_model = 'Email Sent to ';
      imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgoS83usvxagVAfmgo2f9cQW8e6ds6Yp25xCqz96Io8GQVrevGZg'
    } else {
      mobile_model = 'Invalid Email!!';
      result = 'please enter valid email';
    }

  } else if (intent === 'laptop_order_yes_custom_custom_custom') {
    var receiver = message;
    var str = req.body.session;
    var userid = str.split("/");
    var userID = userid[4];
    console.log('User ID : ', userID);

    if (validator.isEmail(message)) {
      var subject = 'Order Details';
      var colour = req.body.queryResult.outputContexts[2].parameters.colour;
      var laptop_model = req.body.queryResult.outputContexts[2].parameters.model1;
      var storage = req.body.queryResult.outputContexts[2].parameters.storage;
      var ram = req.body.queryResult.outputContexts[2].parameters.ram;
      var paymentMethod = req.body.queryResult.outputContexts[2].parameters.payment_method;

      const laptop = await Laptop.findOne({
        /* price: {
          $gt: price - 1000,
          $lt: price + 1000
        }, */
        name: laptop_model,
        color: colour,
        storage: storage,
        ram: ram,
        inStock: true
      });

      //Updated the db and marked the item as sold
      await Laptop.updateOne({
        name: laptop_model,
        color: colour,
        storage: storage,
        ram: ram,
        inStock: true
      }, {
        $set: {
          inStock: false
        }
      });

      //Add order in order Document

      const order = new Order({
        userId: userID,
        productId: laptop._id
      });
      await order.save();

      var disountedPrice = laptop.price - 500;
      console.log('output context : ', req.body.queryResult.outputContexts[2])
      var content = '<h1>Here is Your order Details!</h1><br><h2>We are giving Halloween treat.So we are giving you 500 off.Happy Shopping!:)</h2><h3>Laptop :' + laptop_model + '</h3><h3>Colour : ' + colour + '</h3><h3>Storage  :' + storage + ' </h3><h3>Price  : ' + disountedPrice + '</h3><br><img src=' + laptop.imageUrl + '>';
      sendEmail(subject, content, receiver);
      result = receiver;
      laptop_model = 'Email Sent to ';
      imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgoS83usvxagVAfmgo2f9cQW8e6ds6Yp25xCqz96Io8GQVrevGZg'
    } else {
      laptop_model = 'Invalid Email!!';
      result = 'please enter valid email';
    }

  } else if (intent === 'laptop_order_negotiation_step2') {

    const laptopTemp = await Laptop_temp.findOne({}).sort('-date');

    var randomNumber = Math.floor((Math.random() * 300) + 200);
    var avg = (laptopTemp.price + laptopTemp.thresholdPrice) / 2;
    var temp = avg + randomNumber;
    var min = Math.min(temp, laptopTemp.price);
    var discounted_price = Math.max(min, laptopTemp.thresholdPrice);

    console.log('Price : ', laptopTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else if (intent === 'laptop_order_negotiation_step3') {

    const laptopTemp = await Laptop_temp.findOne({}).sort('-date');

    /*  var avg = (laptopTemp.price + laptopTemp.thresholdPrice) / 2;
     var temp = avg + Math.sqrt(avg / 2);
     var min = Math.min(temp, laptopTemp.price); */
    var discounted_price = (laptopTemp.price + laptopTemp.thresholdPrice) / 2;

    console.log('Price : ', laptopTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else if (intent === 'laptop_order_negotiation_step4') {

    const laptopTemp = await Laptop_temp.findOne({}).sort('-date');

    var randomNumber = Math.floor((Math.random() * 300) + 200);
    var avg = (laptopTemp.price + laptopTemp.thresholdPrice) / 2;
    var temp = avg - randomNumber;
    var min = Math.min(temp, laptopTemp.price);
    var discounted_price = Math.max(min, laptopTemp.thresholdPrice);

    console.log('Price : ', laptopTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else if (intent === 'mobile_order_negotiation_step2') {

    const mobileTemp = await Mobile_temp.findOne({}).sort('-date');

    var randomNumber = Math.floor((Math.random() * 300) + 200);
    var avg = (mobileTemp.price + mobileTemp.thresholdPrice) / 2;
    var temp = avg + randomNumber;
    var min = Math.min(temp, mobileTemp.price);
    var discounted_price = Math.max(min, mobileTemp.thresholdPrice);

    console.log('Price : ', mobileTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else if (intent === 'mobile_order_negotiation_step3') {

    const mobileTemp = await Mobile_temp.findOne({}).sort('-date');

    /*  var avg = (mobileTemp.price + mobileTemp.thresholdPrice) / 2;
     var temp = avg + Math.sqrt(avg / 2);
     var min = Math.min(temp, mobileTemp.price); */
    var discounted_price = (mobileTemp.price + mobileTemp.thresholdPrice) / 2;

    console.log('Price : ', mobileTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else if (intent === 'mobile_order_negotiation_step4') {

    const mobileTemp = await Mobile_temp.findOne({}).sort('-date');

    var randomNumber = Math.floor((Math.random() * 300) + 200);
    var avg = (mobileTemp.price + mobileTemp.thresholdPrice) / 2;
    var temp = avg - randomNumber;
    var min = Math.min(temp, mobileTemp.price);
    var discounted_price = Math.max(min, mobileTemp.thresholdPrice);

    console.log('Price : ', mobileTemp.price);
    console.log('Discountedddd : ', discounted_price);
  } else {
    console.log('nothing match')
  }



  /* var mobile = req.body.queryResult.parameters.mobiles;
  //var memory = req.body.queryResult.parameters.memorygb;
  var colour = req.body.queryResult.parameters.colour;

   */



  if (intent === "mobile_order_specification" || intent === 'mobile_order_specification_yes_custom_custom_custom') {
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
  } else if (intent === "laptop_order" || intent === 'laptop_order_yes_custom_custom_custom') {
    return res.send({
      fulfillmentText: result,
      fulfillmentMessages: [{
        card: {
          title: laptop_model,
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
    })
  } else if (intent === 'laptop_order_negotiation_step2' || intent === 'laptop_order_negotiation_step3' ||
    intent === 'laptop_order_negotiation_step4' || intent === 'mobile_order_negotiation_step2' ||
    intent === 'mobile_order_negotiation_step2' || intent === 'mobile_order_negotiation_step2') {
    return res.send({
      fulfillmentText: 'You can get on this price : ' + discounted_price + ' With all accessories',
      fulfillmentMessages: [],
      source: "virtual sales bot",
      payload: {
        name: "saeed",
        age: 22
      }
    })
  } else {
    return 'error';
  }
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