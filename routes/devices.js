const express = require("express");
const router = express.Router();

const Device = require('../models/Device');
const Type = require('../models/Type');

router.get("/", (req, res) => {
    renderPageForBase(req, res, 'Laurel')
});

router.get("/:typeBase", (req, res) => {
    renderPageForBase(req, res)
});

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
                    console.log(currBase, typeBases)
                    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
                    return res.render("devices", {devices, currBase, typeBases, admin, lead, greet: req.user.username, months})
                }
            }
        )
    } else {
        res.redirect("/login")
    }
}