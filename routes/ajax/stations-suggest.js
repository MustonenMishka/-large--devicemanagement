const express = require("express");
const router = express.Router();

const Device = require('../../models/Device');

router.get("/", (req, res) => { // suggest what to what station add device
    Device.distinct('station', (err, stations) => {
        if (err) {
            console.log(err);
        } else {
            res.send(stations)
        }
    })
});

module.exports = router;