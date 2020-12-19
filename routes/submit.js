const express = require("express");
const router = express.Router();

const Device = require('../models/Device');
const crc = require("../utility/crc.js"); // In this file all hash-calculating logic is done
const emailSender = require("../utility/mailer.js"); // Connecting auto-email-sending system

router.get("/", (req, res) => {
    const toNewStation = true;
    (req.isAuthenticated()) ? res.render("submit", {toNewStation}) : res.redirect("/login");
});

router.post("/", (req, res) => {
    // parsing request body and building array of new devices for DB
    console.log(req.body);
    const newDevices = [...parseDevicesFromRequest(req)];

    Device.find({serial: {$in: [...newDevices.map(device => device.serial)]}}, (err, foundDeviceArr) => { // check if some of added devices are already exist in DB
        if (err) {
            console.log(err)
        } else if (foundDeviceArr.length) {
            res.render("deviceAddError", {
                errorText: 'Устройство с данным серийным номером уже существует',
                deviceArr: foundDeviceArr
            })
        } else {
            // if no duplicating, adding devices
            Device.insertMany(newDevices, (err, devices) => {
                    if (err) {
                        console.log(err)
                    } else {
                        //emailSender(devices);                    //UNCOMMENT!!!!!
                        res.render("addedDevices", {devices});
                    }
                }
            )
        }
    });
});

module.exports = router;


//-----------UTILS--------------

// parsing request and creating array of devices to add
function parseDevicesFromRequest(req) {
    let devicesNum = 1;
    const newDevices = [];
    while (req.body[`serial-${devicesNum}`]) {
        const newDevice = {
            type: {
                name: req.body[`typeName-${devicesNum}`],
                props: []
            },
            serial: parseInt(req.body[`serial-${devicesNum}`]),
            year: parseInt(req.body[`date-${devicesNum}`].split('-')[0]),
            month: parseInt(req.body[`date-${devicesNum}`].split('-')[1]),
            company: req.body.company,
            station: req.body.station,
            person: req.body.person,
            phone: req.body.phone,
            email: req.body.email,
            person2: req.body.person2,
            phone2: req.body.phone2,
            email2: req.body.email2,
            country: validateLocation(req.body.country),
            city: validateLocation(req.body.city),
            comment: req.body.comment,
            coords: JSON.parse(req.body.coords),
            whoadded: req.user.username,
            whenadded: getDate(),
        };
        let propNum = 1;
        while (req.body[`propName-${devicesNum}-${propNum}`]) {     // parsing typeProps for every device
            const newProp = {
                propname: req.body[`propName-${devicesNum}-${propNum}`],
                propvalue: req.body[`propVal-${devicesNum}-${propNum}`]
            };
            newDevice.type.props.push(newProp);
            propNum++
        }

        newDevice.hash = hashCalcMethod(req.body[`hashCalc-${devicesNum}`], newDevice); // adding hash to DB
        newDevices.push(newDevice);
        devicesNum++;
    }
    return newDevices
}

//Selecting license key calculating method
function hashCalcMethod(method, device) {
    switch (method) {
        case 'crc16':
            return crc(device.serial, device.year, device.month);
        case 'none':
            return '';
    }
}

// validating location names
function validateLocation(string) {
    return string.trim().charAt(0).toUpperCase() + string.trim().slice(1); // trimmed and capitalized
}

// recording moment of adding
function getDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/Moscow'
    };
    const today = new Date();
    return today.toLocaleDateString("ru-RU", options);
}