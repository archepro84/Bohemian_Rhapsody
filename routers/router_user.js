const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware")

router.get("/user/me", authMiddleware, async (req, res) => {
    const {user} = res.locals
    res.send({userId: user.userId, nickname: user.nickname});
});

module.exports = router;