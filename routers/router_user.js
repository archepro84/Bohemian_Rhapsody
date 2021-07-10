const express = require("express");
const router = express.Router();



router.get('/user', async (req, res) => {
    res.send({result: "Hello"})
});

module.exports = router