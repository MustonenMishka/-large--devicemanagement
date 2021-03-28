const express = require("express");
const router = express.Router();

const Device = require('../../models/Device');

router.get("/:station", (req, res) => { // suggest to what station add device
    Device.find({station: decodeURIComponent(req.params.station)}, (err, foundDevices) => {
            if (err) {
                console.log(err)
            } else {
                const companies = [...new Set(foundDevices.map(device => device.company))];
                res.send(companies)
            }
        }
    );
});

module.exports = router;