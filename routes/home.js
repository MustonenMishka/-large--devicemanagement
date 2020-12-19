const express = require("express");
const router = express.Router();
const fs = require('fs');

const Device = require('../models/Device');
const createMapData = require("../utility/map-handler.js"); // There comes parsing DB and building homepage map markers and numbers

router.get("/", (req, res) => {
    Device.find({}, (err, foundDevices) => {
        if (err) {
            console.log(err)
        } else {
            const [numOfStations, numOfCountries, totalNum, yandexMarkers] = createMapData(foundDevices); // group all devices into cities and countries
            fs.writeFile('./public/scripts/map-data.json', yandexMarkers, function (err) { //creating file on server with JSON of yandex-map-markers
                if (err) {
                    console.log(err);
                }
            });
            const isAuthenticated = req.isAuthenticated();

            function declOfNum(number, words) { // Определяем склонение слов "объект" и "страна"
                return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
            }

            const countryWord = declOfNum(numOfCountries, ['страна', 'страны', 'стран']);
            const stationWord = declOfNum(numOfStations, ['объект', 'объекта', 'объектов']);

            res.render("home", {numOfStations, numOfCountries, totalNum, isAuthenticated, countryWord, stationWord})
        }
    });
});

module.exports = router;