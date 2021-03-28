const express = require("express");
const router = express.Router();
const fs = require('fs');

const Device = require('../models/Device');
const User = require('../models/User');
const Type = require('../models/Type');

router.get("/:base", (req, res) => {
    const base = req.params.base;
    if (req.isAuthenticated()) {
        switch (base) {
            case 'devices':
                downloadDB(Device, res, 'Device-DB');
                break
            case 'users':
                downloadDB(User, res, 'User-DB');
                break
            case 'types':
                downloadDB(Type, res, 'Type-DB');
                break
        }
    } else {
        res.redirect("/login")
    }
});


module.exports = router;


function downloadDB(DB, res, filename) {
    DB.find({}, {_id:0}, (err, allItems) => {
            if (err) {
                console.log(err)
            } else {
                const allItemsJSON = JSON.stringify(allItems);
                fs.writeFile(`./public/scripts/DB-Backups/${filename}.json`, allItemsJSON, (err) => { //creating file on server with JSON of yandex-map-markers
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    );
    res.setHeader('Content-type', 'text/plain');
    res.download(`./public/scripts/DB-Backups/${filename}.json`, (err) => {
        if (err) {
            console.log(err);
        }
    })
}