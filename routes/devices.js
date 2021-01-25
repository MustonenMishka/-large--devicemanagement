const express = require("express");
const router = express.Router();

const Device = require('../models/Device');
const Type = require('../models/Type');

router.get("/", (req, res) => {
    renderPageForBase(req, res, 'Engine')
});

router.get("/:typeBase", renderPageForBase);

module.exports = router;


//-----------UTILS--------------


async function renderPageForBase(req, res, base) {
    if (req.isAuthenticated()) {
        const admin = req.user.admin;
        const lead = req.user.lead;
        const currBaseName = req.params.typeBase || base;
        let currBase;
        let typeBases;
        await Type.find({}, (err, types) => {
                if (err) {
                    console.log(err)
                } else {
                    typeBases = types.filter(type => type.name !== currBaseName);
                    currBase = types.find(type => type.name === currBaseName);
                }
            }
        );
        await Device.find({'type.name': currBaseName}, (err, devices) => {
                if (err) {
                    console.log(err)
                } else {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return res.render("devices", {devices, currBase, typeBases, admin, lead, greet: req.user.username, months})
                }
            }
        )
    } else {
        res.redirect("/login")
    }
}