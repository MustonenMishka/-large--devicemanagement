const express = require("express");
const router = express.Router();

const Type = require('../models/Type');

router.get("/", (req, res) => {
    (req.isAuthenticated()) ? res.render("newType") : res.redirect("/login");
});

router.post("/", (req, res) => {
    if (!req.body.isEditing) {                  // if adding new type
        Type.find({name: req.body.typeName}, (err, type) => {
            if (type.length) {
                res.render("error", {
                    errorText: 'Тип устройств с данным именем уже существует',
                })
            } else {
                const props = parsePropsFromInputs(req.body);
                Type.create({
                    name: req.body.typeName,
                    hashcalc: req.body.typeHash,
                    props
                }, (err, type) => {
                    if (err) {
                        console.log(err);
                        res.redirect("/add-type")
                    } else {
                        res.render("addedType", {typeName: req.body.typeName, edited: false})
                    }
                })
            }
        });
    } else {                                // if editing type
        const props = parsePropsFromInputs(req.body);
        Type.updateOne({
            name: req.body.typeName
        }, {$set: {props}}, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect("/add-type")
            } else {
                res.render("addedType", {typeName: req.body.typeName, edited: true})
            }
        })
    }
});

function parsePropsFromInputs(form) {
    let propArr = [];
    let propNum = 1;
    while (form[`prop-${propNum}`]) {
        const prop = {propname: form[`prop-${propNum}`], options: []};
        let optNum = 1;
        while (form[`prop-${propNum}-opt-${optNum}`]) {
            prop.options.push(form[`prop-${propNum}-opt-${optNum}`]);
            optNum++
        }
        propArr.push(prop);
        propNum++
    }
    return propArr
}


module.exports = router;