const express = require("express");
const router = express.Router();

const User = require('../models/User');

router.get("/", (req, res) => {
    (req.isAuthenticated()) ? res.render("register") : res.redirect("/login");
});

router.post("/", (req, res) => {
    User.find({username: req.body.username}, function (err, user) {
        if (user.length) {
            res.render("error", {
                errorText: 'User with this name already exists'
            })
        } else {
            User.register({
                username: req.body.username,
                admin: !!req.body.admin,
                lead: !!req.body.lead
            }, req.body.password, (err, user) => {
                if (err) {
                    console.log(err);
                    res.redirect("/register")
                } else {
                    res.render("addedUser", {username: req.body.username})
                }
            })
        }
    });
});


module.exports = router;