const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const deviceAddingError = false;
    const userDeletionError = false;
    res.render("error", {
        errorText: 'User does not exist / Wrong password',
        deviceAddingError,
        userDeletionError
    })
});

module.exports = router;