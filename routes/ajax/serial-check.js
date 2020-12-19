const express = require("express");
const router = express.Router();

const Device = require('../../models/Device');

router.get("/:serial", (req, res) => { // check if serial exists in DB when adding device
    Device.findOne({serial: req.params.serial}, (err, exist) => {
        if (err) {
            console.log(err);
        } else if (exist) {
            res.send('is-invalid')
        } else {
            res.send('is-valid')
        }
    })
});

module.exports = router;