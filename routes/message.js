const express = require('express');
const moongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Get request on end point');
});


router.post('/', (req, res) => {
    var speech = req.body.queryResult.parameters.echoText;
    return res.send({
        fulfillmentText: speech + " response from node app",
        source: "webhook-echo-sample"
    });
});



module.exports = router;