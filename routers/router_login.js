const express = require("express");
const router = express.Router();



router.get('/login', async (req, res) => {
    res.send({result: "Hello"})
});

module.exports = router