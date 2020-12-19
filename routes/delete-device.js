const express = require("express");
const router = express.Router();

const Device = require('../models/Device');

router.get("/:serial", (req, res) => {
    Device.findOneAndRemove({serial: req.params.serial},
        function (err, device) {
            if (!err)
                res.render("deletedDevice", {device});
            else
                console.log(err);
        });
});

module.exports = router;