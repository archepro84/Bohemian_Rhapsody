const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();



router.get('/user', async (req, res) => {
    res.send({result: "Hello"})
});

module.exports = router