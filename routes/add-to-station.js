const express = require("express");
const router = express.Router();

const Device = require('../models/Device');

router.post("/", (req, res) => {                  // Add to station (control panel variant)
    const searchCondition = {
        station: req.body.station,
        company: req.body.company
    };
    renderSubmitForStation(req, res, searchCondition)
});

router.get("/:option", (req, res) => {                  // Add to station (device options variant)
    const queryParams = req.params.option.split('-');
    const searchCondition = {
        station: queryParams[0],
        company: queryParams[1]
    };
    renderSubmitForStation(req, res, searchCondition)
});


module.exports = router;



//-----------UTILS--------------

function renderSubmitForStation(req, res, searchCondition) {
    const toNewStation = false;
    Device.findOne(searchCondition, function (err, station) {
        if (err) {
            console.log(err)
        } else {
            (req.isAuthenticated()) ? res.render("submit", {toNewStation, station}) : res.redirect("/login");
        }
    });
}