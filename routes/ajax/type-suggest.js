const express = require("express");
const router = express.Router();

const Type = require('../../models/Type');

router.get("/:typeName", (req, res) => {
    Type.findOne({name: req.params.typeName}, (err, type) => {
            if (err) {
                console.log(err)
            } else {
                res.send([type.props, type.hashcalc])
            }
        }
    );
});

router.get("/", (req, res) => {
    Type.distinct('name', (err, types) => {
            if (err) {
                console.log(err)
            } else {
                res.send(types)
            }
        }
    );
});

module.exports = router;