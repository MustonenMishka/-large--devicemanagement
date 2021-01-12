const express = require("express");
const router = express.Router();
const fs = require('fs');

const Device = require('../models/Device');
const Type = require('../models/Type');
const createMapData = require("../utility/map-handler.js"); // There comes parsing DB and building homepage map markers and numbers

router.get("/", renderHomepage);

router.post("/", renderHomepage);

module.exports = router;


//-----------UTILS--------------


async function renderHomepage(req, res) {
    const types = await Type.find({})
    await Device.find({}, (err, foundDevices) => {
        if (err) {
            console.log(err)
        } else {
            const isAuthenticated = req.isAuthenticated();
            let prevFilterConfig = 'all'; // Setting filter checkboxes configuration

            if (req.method === "POST") { // If we are submitting filter-type form and processing POST req
                const filterObj = createFilterObj(req.body, types);
                foundDevices = filterDevices(foundDevices, filterObj);
                prevFilterConfig = {...req.body}
            }

            const [numOfStations, numOfCountries, totalNum, yandexMarkers] = createMapData(foundDevices); // group all devices into cities and countries
            fs.writeFile('./public/scripts/map-data.json', yandexMarkers, function (err) { //creating file on server with JSON of yandex-map-markers
                if (err) {
                    console.log(err);
                }
            });
            // Setting heading words
            const countryWord = declOfNum(numOfCountries, ['страна', 'страны', 'стран']);
            const stationWord = declOfNum(numOfStations, ['объект', 'объекта', 'объектов']);

            res.render("home", {
                types,
                numOfStations,
                numOfCountries,
                totalNum,
                isAuthenticated,
                countryWord,
                stationWord,
                prevFilterConfig
            })
        }
    });
}

function createFilterObj(inputs, types) {
    const filterObj = {};
    for (let typeCount = 0; typeCount < types.length; typeCount++) {
        if (inputs[`type-${typeCount}`]) {
            if (types.find(type => type.name === inputs[`type-${typeCount}`]).props.length === 0) { // if type has no options
                filterObj[inputs[`type-${typeCount}`]] = true // no array of options, all type is one unit
            } else {
                filterObj[inputs[`type-${typeCount}`]] = []  // init array of options
            }

            const optionsOfType = types.find(type => type.name === inputs[`type-${typeCount}`]).props[0]
            if (optionsOfType) {
                const maxOptions = optionsOfType.options.length
                for (let optCount = 0; optCount < maxOptions; optCount++) {
                    if (inputs[`type-${typeCount}-opt-${optCount}`]) {
                        filterObj[inputs[`type-${typeCount}`]].push(inputs[`type-${typeCount}-opt-${optCount}`])
                    }
                }
            }
        }
    }
    return filterObj
}

function filterDevices(devices, filter) {
    return devices.filter(device => Object.keys(filter).includes(device.type.name) && (filter[device.type.name] === true) || // if type in filter, but type has no options -> take all devices of that type
        Object.keys(filter).includes(device.type.name) && filter[device.type.name].includes(device.type.props[0].propvalue)) // if type in filter and type has some options -> take only those devices, which 1st option value is in filter
}

function declOfNum(number, words) { // Определяем склонение слов "объект" и "страна"
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
}