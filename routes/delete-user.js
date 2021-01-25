const express = require("express");
const router = express.Router();

const User = require('../models/User');

router.post("/", (req, res) => {
    User.findOneAndRemove({username: req.body.userDel},
        function (err, user) {
            if (!user) {
                res.render("error", {
                    errorText: 'User does not exist'
                })
            } else if (!err)
                res.render("deletedUser", {user});
            else {
                console.log(err);
            }
        });
});


module.exports = router;