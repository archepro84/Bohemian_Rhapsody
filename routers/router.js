const express = require("express");
const router = express.Router();



router.get('/api/get/posts', async (req, res) => {

    res.send({result: "Hello"})
});

module.exports = router