const express = require("express");
const router = express.Router();

const Type = require('../models/Type');

router.get("/", (req, res) => {
    Type.findOne({name: req.query.typeName}, (err, type) => {
            if (!type) {
                res.render("error", {
                    errorText: 'Device type does not exist'
                })
            } else if (!err)
                res.render("editType", {type});
            else {
                console.log(err);
            }
        });
});


module.exports = router;
