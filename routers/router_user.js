const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

router.get("/user/me", async (req, res) => {
  const token = localStorage.getItem("token");

  if (token == null) {
    res.status(400).send({
      errorMessage: "사용자 정보가 없습니다.",
    });
  }

  const nickname = jwt.decode(token);

  const user = await Users.findAll({
    where: { nickname },
  });

  res.send({ userId: user.userId , nickname: user.nickname });
});

module.exports = router;