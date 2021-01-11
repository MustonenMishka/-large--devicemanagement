const express = require("express");
const router = express.Router();

const Type = require('../models/Type');
const Device = require('../models/Device');

router.post("/", (req, res) => {
    const deletingType = req.body.typeName;
    Type.findOneAndRemove({name: deletingType}, async (err, type) => {
            if (!type) {
                return res.render("error", {
                    errorText: 'Тип устройств не существует'
                })
            } else if (!err) {
                const devices = await Device.find({'type.name': deletingType});
                await Device.deleteMany({'type.name': deletingType}, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render("deletedType", {type, devices});
                    }
                })
            } else {
                console.log(err);
            }
        });
});


module.exports = router;