const express = require("express");
const router = express.Router();

const Type = require('../models/Type');

router.get("/", (req, res) => {
    Type.findOne({name: req.query.typeName}, (err, type) => {
            if (!type) {
                res.render("error", {
                    errorText: 'Тип устройств не существует'
                })
            } else if (!err)
                res.render("editType", {type});
            else {
                console.log(err);
            }
        });
});


module.exports = router;
