const express = require("express");
const router = express.Router();



router.get('/post', async (req, res) => {
    res.send({result: "Hello"})
});

module.exports = router