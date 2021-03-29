const express = require("express");
const router = express.Router();

const Device = require('../models/Device');

router.get("/", (req, res) => { // option can be "serial-11111" (edit one device contact data) or "station-StationName-CompanyName" (edit station contact data for many devices)
    const searchCondition = {};
    let isStation = false;
    if (req.query.mode === 'serial') {  // parsing url params, what user wants to edit? single device or company devices?
        searchCondition.serial = req.query.number;
    } else {
        searchCondition.station = decodeURIComponent(req.query.station);
        searchCondition.company = decodeURIComponent(req.query.company);
        isStation = true
    }

    Device.find(searchCondition, (err, foundDeviceArr) => {
            if (err) {
                console.log(err)
            } else {
                res.render("edit", {deviceArr: foundDeviceArr, isStation})
            }
        }
    );
});

router.post("/", async (req, res) => {
    const searchCondition = {};
    if (req.body.serial) {  // parsing post params, what user wants to edit? single device or company devices?
        searchCondition.serial = req.body.serial
    } else {
        searchCondition.station = req.body.station;
        searchCondition.company = req.body.company
    }
    // Updating devices
    await Device.updateMany(searchCondition, {
        $set: {
            person: req.body.person,
            phone: req.body.phone,
            email: req.body.email,
            person2: req.body.person2,
            phone2: req.body.phone2,
            email2: req.body.email2,
            comment: req.body.comment,
        }
    });
    // rendering the success page with updated devices
    Device.find(searchCondition, (err, foundDeviceArr) => {
            if (err) {
                console.log(err)
            } else {
                res.render("editedDevices", {deviceArr: foundDeviceArr})
            }
        }
    );
});


module.exports = router;