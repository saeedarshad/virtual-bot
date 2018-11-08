const express = require("express");
const bodyParser = require("body-parser");
const message = require("./routes/message");
const webhook = require("./routes/webhook");

require('./db')();

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Virtual sales bot End point");
});

app.use("/message", message);
app.use("/webhook", webhook);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server up and listening at", port);
});