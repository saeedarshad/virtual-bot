const express = require("express");
const bodyParser = require("body-parser");
const message = require('./routes/message');

require('./db')();

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Virtual sales bot End poin');
});

app.use('/message' , message)
 


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server up and listening at", port);
});
