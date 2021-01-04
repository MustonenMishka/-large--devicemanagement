const express = require("express");
const router = express.Router();

const Device = require('../../models/Device');

router.get("/:typeSerial", (req, res) => { // check if serial exists in DB when adding device
    const [type, serial] = req.params.typeSerial.split('-');
    if (!type || !serial) {
        return
    }
    Device.findOne({serial, 'type.name': type}, (err, exist) => {
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