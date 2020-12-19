const mongoose = require("mongoose");

const propSchema = mongoose.Schema({
    propname: String,
    propvalue: String
});

const deviceSchema = mongoose.Schema({
    type: {
        name: String,
        props: [propSchema]
    },
    serial: Number,
    year: Number,
    month: Number,
    company: String,
    station: String,
    person: String,
    phone: String,
    email: String,
    person2: String,
    phone2: String,
    email2: String,
    country: String,
    city: String,
    comment: String,
    hash: Number,
    coords: {
        lat: Number,
        lng: Number,
    },
    whoadded: String,
    whenadded: String,
});

module.exports = mongoose.model("Device", deviceSchema);