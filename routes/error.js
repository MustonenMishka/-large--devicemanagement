const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const deviceAddingError = false;
    const userDeletionError = false;
    res.render("error", {
        errorText: 'Пользователя не существует / Неправильный пароль',
        deviceAddingError,
        userDeletionError
    })
});

module.exports = router;