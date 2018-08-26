"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post("/echo", function(req, res) {
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
      ? req.body.queryResult.parameters.echoText
      : "Seems like some problem. Speak again.";
      
  return res.json({
    fulfillmentText: speech + " response from node app",
    source: "webhook-echo-sample"
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server up and listening at" , port);
});
