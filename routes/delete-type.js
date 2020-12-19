const express = require("express");
const router = express.Router();

const Type = require('../models/Type');

router.post("/", (req, res) => {
    Type.findOneAndRemove({name: req.body.typeName},
        function (err, type) {
            if (!type) {
                res.render("error", {
                    errorText: 'Тип устройств не существует'
                })
            } else if (!err)
                res.render("deletedType", {type});
            else {
                console.log(err);
            }
        });
});


module.exports = router;