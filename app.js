// connecting tools
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const User = require('./models/User'); //Connecting User schema for passport auth

// app init
const app = express();

// linking files, connecting ejs engine for SSR, connecting body-parser to read forms
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// connecting passportAuth middleware
app.use(session({
    secret: "This secret string is used for hash computing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connecting DB
mongoose.connect("mongodb+srv://mishka:1994-455@cluster0-mqcnk.mongodb.net/I-MT", { // ADD PATH TO DB HERE!
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

// creating authentication strategy
passport.use(User.createStrategy());
// creating auth with cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// ROUTES

app.use("/", require("./routes/home"));

app.use("/devices", require("./routes/devices"));
app.use("/submit", require("./routes/submit"));
app.use("/add-to-station", require("./routes/add-to-station"));
app.use("/edit", require("./routes/edit"));
app.use("/delete-device", require("./routes/delete-device"));

app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/register", require("./routes/register"));
app.use("/delete-user", require("./routes/delete-user"));

app.use("/add-type", require("./routes/add-type"));
app.use("/edit-type", require("./routes/edit-type"));
app.use("/delete-type", require("./routes/delete-type"));

app.use("/serial-check", require("./routes/ajax/serial-check"));
app.use("/company-suggest", require("./routes/ajax/company-suggest"));
app.use("/stations-suggest", require("./routes/ajax/stations-suggest"));
app.use("/type-suggest", require("./routes/ajax/type-suggest"));

app.use("/error", require("./routes/error"));

app.use("/download", require("./routes/download"));


app.listen(3000);

