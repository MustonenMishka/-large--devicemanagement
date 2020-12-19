const mongoose = require("mongoose");

const propSchema = mongoose.Schema({
    propname: String,
    options: [String]
});

const typeSchema = mongoose.Schema({
    name: String,
    hashcalc: String,
    props: [propSchema]
});

module.exports = mongoose.model("Type", typeSchema);